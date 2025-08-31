import { NextRequest, NextResponse } from 'next/server';
import { getTranslation, formatDateLocalized } from '@/lib/translations';

// Conditional MongoDB imports
let clientPromise: any = null;
let Invoice: any = null;

if (process.env.MONGODB_URI) {
  try {
    clientPromise = require('@/lib/mongodb').default;
    Invoice = require('@/lib/models/Invoice').default;
  } catch (error) {
    console.log('MongoDB imports not available');
  }
}

// Complete invoice data interface matching the frontend structure
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
}

interface InvoiceData {
  general: {
    invoiceNumber: string;
    invoiceNumberPrefix: string;
    invoiceNumberValue: string;
    issueDate: string;
    dueDate: string;
    serviceDate: string;
    currency: string;
    language: string;
    template: 'default' | 'stripe';
    dateFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY';
    paymentLinkUrl?: string;
    companyLogo?: string;
  };
  seller: {
    name: string;
    address: string;
    vatNumber: string;
    email: string;
    accountNumber: string;
    swiftBic: string;
    countryCode: string;
    showVatInPDF: boolean;
    showAccountInPDF: boolean;
    showSwiftInPDF: boolean;
    notes: string;
    showNotesInPDF: boolean;
  };
  buyer: {
    name: string;
    address: string;
    vatNumber: string;
    email: string;
    countryCode: string;
  };
  items: InvoiceItem[];
  payment: {
    method: string;
    dueDate: string;
    terms: string;
    showMethodInPDF: boolean;
    showDueDateInPDF: boolean;
    showTermsInPDF: boolean;
  };
  notes: {
    content: string;
    showInPDF: boolean;
  };
  signature: {
    showInPDF: boolean;
    name: string;
    title: string;
  };
  template: 'default' | 'stripe';
}

// Validation function
function validateInvoiceData(data: InvoiceData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // General validation
  if (!data.general?.invoiceNumberValue) {
    errors.push('Invoice number is required');
  }
  if (!data.general?.issueDate) {
    errors.push('Issue date is required');
  }
  if (!data.general?.dueDate) {
    errors.push('Due date is required');
  }
  if (!data.general?.currency) {
    errors.push('Currency is required');
  }
  if (!data.general?.language) {
    errors.push('Language is required');
  }

  // Seller validation
  if (!data.seller?.name) {
    errors.push('Seller name is required');
  }
  if (!data.seller?.email) {
    errors.push('Seller email is required');
  }
  if (!data.seller?.address) {
    errors.push('Seller address is required');
  }

  // Buyer validation
  if (!data.buyer?.name) {
    errors.push('Buyer name is required');
  }
  if (!data.buyer?.email) {
    errors.push('Buyer email is required');
  }
  if (!data.buyer?.address) {
    errors.push('Buyer address is required');
  }

  // Items validation
  if (!data.items || data.items.length === 0) {
    errors.push('At least one invoice item is required');
  } else {
    data.items.forEach((item, index) => {
      if (!item.description) {
        errors.push(`Item ${index + 1}: Description is required`);
      }
      if (item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
      }
      if (item.unitPrice < 0) {
        errors.push(`Item ${index + 1}: Unit price cannot be negative`);
      }
      if (item.vatRate < 0 || item.vatRate > 100) {
        errors.push(`Item ${index + 1}: VAT rate must be between 0 and 100`);
      }
    });
  }

  return { isValid: errors.length === 0, errors };
}

// Calculate totals
function calculateTotals(items: InvoiceItem[]) {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const vat = items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.unitPrice;
    return sum + (itemTotal * item.vatRate / 100);
  }, 0);
  const total = subtotal + vat;
  
  return { subtotal, vat, total };
}

// Generate HTML preview
function generateHTMLPreview(data: InvoiceData): string {
  const { subtotal, vat, total } = calculateTotals(data.items);
  
  const formatCurrency = (amount: number, currency: string) => {
    const currencySymbols: { [key: string]: string } = {
      'EUR': '€', 'USD': '$', 'GBP': '£', 'CHF': 'CHF', 'SEK': 'SEK', 'NOK': 'NOK', 'DKK': 'DKK',
      'PLN': 'zł', 'CZK': 'Kč', 'HUF': 'Ft', 'RON': 'Lei', 'BGN': 'лв', 'HRK': 'kn', 'RSD': 'дин'
    };
    const symbol = currencySymbols[currency] || currency;
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (date: string | Date, language: string = 'en'): string => {
    return formatDateLocalized(date, language);
  };

  return `
    <!DOCTYPE html>
    <html lang="${data.general.language}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${getTranslation(data.general.language, 'invoice')} - ${data.general.invoiceNumberPrefix} ${data.general.invoiceNumberValue}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .invoice-container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 5px; }
            .invoice-number { color: #666; font-size: 14px; }
            .company-logo { width: 80px; height: 80px; object-fit: contain; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
            .seller-info h3 { margin: 0 0 10px 0; color: #333; }
            .seller-info p { margin: 5px 0; color: #666; }
            .invoice-details { text-align: right; }
            .detail-item { margin-bottom: 10px; }
            .detail-label { font-size: 12px; color: #666; text-transform: uppercase; font-weight: bold; }
            .detail-value { font-size: 14px; color: #333; }
            .billing-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .bill-to, .ship-to { background: #f8f9fa; padding: 15px; border-radius: 6px; }
            .bill-to h3, .ship-to h3 { margin: 0 0 10px 0; font-size: 12px; color: #666; text-transform: uppercase; }
            .bill-to h4, .ship-to h4 { margin: 0 0 5px 0; color: #333; }
            .bill-to p, .ship-to p { margin: 3px 0; color: #666; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #f8f9fa; padding: 12px; text-align: left; font-size: 12px; color: #666; text-transform: uppercase; font-weight: bold; }
            td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
            .text-right { text-align: right; }
            .totals { text-align: right; margin-bottom: 30px; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; min-width: 200px; }
            .total-label { color: #666; }
            .total-value { font-weight: bold; color: #333; }
            .final-total { border-top: 2px solid #333; padding-top: 10px; font-size: 16px; font-weight: bold; }
            .payment-info, .notes { background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
            .payment-info h3, .notes h3 { margin: 0 0 10px 0; font-size: 14px; color: #333; text-transform: uppercase; }
            .signature { text-align: right; margin-top: 40px; }
            .signature-line { width: 150px; height: 1px; background: #ccc; margin-bottom: 10px; }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <div class="header">
                <div>
                    <div class="title">${getTranslation(data.general.language, 'invoice')}</div>
                    <div class="invoice-number">${data.general.invoiceNumberPrefix} ${data.general.invoiceNumberValue}</div>
                </div>
                <div>
                    ${data.general.companyLogo ? `<img src="${data.general.companyLogo}" alt="Company Logo" class="company-logo">` : ''}
                    <h2>${data.seller.name}</h2>
                </div>
            </div>

            <div class="details">
                <div class="seller-info">
                    <h3>${data.seller.name}</h3>
                    <p>${data.seller.address}</p>
                    <p>${data.seller.email}</p>
                    ${data.seller.showVatInPDF ? `<p><strong>${data.seller.countryCode} VAT ${data.seller.vatNumber}</strong></p>` : ''}
                </div>
                <div class="invoice-details">
                    <div class="detail-item">
                        <div class="detail-label">${getTranslation(data.general.language, 'dateOfIssue')}</div>
                        <div class="detail-value">${formatDate(data.general.issueDate, data.general.language)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">${getTranslation(data.general.language, 'dateDue')}</div>
                        <div class="detail-value">${formatDate(data.general.dueDate, data.general.language)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">${getTranslation(data.general.language, 'currency')}</div>
                        <div class="detail-value">${data.general.currency}</div>
                    </div>
                </div>
            </div>

            <div class="billing-section">
                <div class="bill-to">
                    <h3>${getTranslation(data.general.language, 'billTo')}</h3>
                    <h4>${data.buyer.name}</h4>
                    <p>${data.buyer.address}</p>
                    <p>${data.buyer.email}</p>
                    <p><strong>${data.buyer.countryCode} VAT ${data.buyer.vatNumber}</strong></p>
                </div>
                <div class="ship-to">
                    <h3>${getTranslation(data.general.language, 'shipTo')}</h3>
                    <h4>${data.buyer.name}</h4>
                    <p>${data.buyer.address}</p>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>${getTranslation(data.general.language, 'description')}</th>
                        <th class="text-right">${getTranslation(data.general.language, 'quantity')}</th>
                        <th class="text-right">${getTranslation(data.general.language, 'unitPrice')}</th>
                        <th class="text-right">${getTranslation(data.general.language, 'tax')}</th>
                        <th class="text-right">${getTranslation(data.general.language, 'amount')}</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.items.map(item => `
                        <tr>
                            <td>${item.description}</td>
                            <td class="text-right">${item.quantity}</td>
                            <td class="text-right">${formatCurrency(item.unitPrice, data.general.currency)}</td>
                            <td class="text-right">${item.vatRate}%</td>
                            <td class="text-right"><strong>${formatCurrency(item.quantity * item.unitPrice, data.general.currency)}</strong></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="totals">
                <div class="total-row">
                    <span class="total-label">${getTranslation(data.general.language, 'subtotal')}</span>
                    <span class="total-value">${formatCurrency(subtotal, data.general.currency)}</span>
                </div>
                <div class="total-row">
                    <span class="total-label">${getTranslation(data.general.language, 'vat')} - ${data.buyer.countryCode} (${data.items[0]?.vatRate || 20}%)</span>
                    <span class="total-value">${formatCurrency(vat, data.general.currency)}</span>
                </div>
                <div class="total-row final-total">
                    <span class="total-label">${getTranslation(data.general.language, 'total')}</span>
                    <span class="total-value">${formatCurrency(total, data.general.currency)}</span>
                </div>
            </div>

            ${(data.payment?.showMethodInPDF || data.payment?.showDueDateInPDF || data.payment?.showTermsInPDF) ? `
                <div class="payment-info">
                    <h3>${getTranslation(data.general.language, 'paymentInformation')}</h3>
                    ${data.payment?.showMethodInPDF ? `<p><strong>${getTranslation(data.general.language, 'paymentMethod')}:</strong> ${data.payment.method}</p>` : ''}
                    ${data.payment?.showDueDateInPDF ? `<p><strong>${getTranslation(data.general.language, 'dueDate')}:</strong> ${formatDate(data.payment.dueDate, data.general.language)}</p>` : ''}
                    ${data.payment?.showTermsInPDF ? `<p><strong>${getTranslation(data.general.language, 'paymentTerms')}:</strong> ${data.payment.terms}</p>` : ''}
                </div>
            ` : ''}

            ${data.notes?.showInPDF && data.notes.content ? `
                <div class="notes">
                    <h3>${getTranslation(data.general.language, 'notes')}</h3>
                    <p>${data.notes.content}</p>
                </div>
            ` : ''}

            ${data.signature?.showInPDF ? `
                <div class="signature">
                    <div class="signature-line"></div>
                    <p><strong>${data.signature.name}</strong></p>
                    <p>${data.signature.title}</p>
                </div>
            ` : ''}
        </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const invoiceData: InvoiceData = body;

    // Validate the invoice data
    const validation = validateInvoiceData(invoiceData);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Validation failed',
          errors: validation.errors 
        },
        { status: 400 }
      );
    }

    // Calculate totals
    const totals = calculateTotals(invoiceData.items);

    // Generate HTML preview
    const htmlPreview = generateHTMLPreview(invoiceData);

    // Connect to MongoDB and save invoice (optional)
    let savedInvoice = null;
    if (process.env.MONGODB_URI) {
      try {
        await clientPromise;
        
        // Transform data to match the Invoice model schema
        const invoiceDataForDB = {
          invoiceNumber: `${invoiceData.general.invoiceNumberPrefix} ${invoiceData.general.invoiceNumberValue}`,
          issueDate: new Date(invoiceData.general.issueDate),
          dueDate: new Date(invoiceData.general.dueDate),
          currency: invoiceData.general.currency,
          language: invoiceData.general.language,
          seller: {
            name: invoiceData.seller.name,
            address: invoiceData.seller.address,
            vatNumber: invoiceData.seller.vatNumber,
            email: invoiceData.seller.email,
            accountNumber: invoiceData.seller.accountNumber,
            swiftBic: invoiceData.seller.swiftBic,
          },
          buyer: {
            name: invoiceData.buyer.name,
            address: invoiceData.buyer.address,
            vatNumber: invoiceData.buyer.vatNumber,
            email: invoiceData.buyer.email,
          },
          items: invoiceData.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            vatRate: item.vatRate,
          })),
          template: invoiceData.template,
          totals,
          htmlPreview,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        const invoice = new Invoice(invoiceDataForDB);
        savedInvoice = await invoice.save();
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue without database if it fails
      }
    }

    // Prepare response
    const response: any = {
      success: true,
      data: {
        invoiceNumber: `${invoiceData.general.invoiceNumberPrefix} ${invoiceData.general.invoiceNumberValue}`,
        totals,
        htmlPreview,
        message: 'Invoice generated successfully'
      }
    };

    // Add database ID if saved
    if (savedInvoice) {
      response.data.id = savedInvoice._id;
      response.data.databaseId = savedInvoice._id.toString();
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate invoice',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'MongoDB not configured'
      });
    }
    
    await clientPromise;
    const invoices = await Invoice.find({}).sort({ createdAt: -1 }).limit(10);
    
    return NextResponse.json({
      success: true,
      data: invoices
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}
