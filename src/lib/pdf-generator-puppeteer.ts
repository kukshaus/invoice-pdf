import puppeteer from 'puppeteer';

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
    dateFormat: string;
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

const formatCurrency = (amount: number, currency: string) => {
  const currencySymbols: { [key: string]: string } = {
    'EUR': '€', 'USD': '$', 'GBP': '£', 'CHF': 'CHF', 'SEK': 'SEK', 'NOK': 'NOK', 'DKK': 'DKK',
    'PLN': 'zł', 'CZK': 'Kč', 'HUF': 'Ft', 'RON': 'Lei', 'BGN': 'лв', 'HRK': 'kn', 'RSD': 'дин'
  };
  const symbol = currencySymbols[currency] || currency;
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const calculateSubtotal = (items: InvoiceItem[]) => {
  return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
};

const calculateVAT = (items: InvoiceItem[]) => {
  return items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.unitPrice;
    return sum + (itemTotal * item.vatRate / 100);
  }, 0);
};

const calculateTotal = (items: InvoiceItem[]) => {
  return calculateSubtotal(items) + calculateVAT(items);
};

const generateHTML = (data: InvoiceData): string => {
  const subtotal = calculateSubtotal(data.items);
  const vat = calculateVAT(data.items);
  const total = calculateTotal(data.items);

  return `
    <!DOCTYPE html>
    <html lang="${data.general.language}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice - ${data.general.invoiceNumberPrefix} ${data.general.invoiceNumberValue}</title>
        <style>
            @page {
                size: A4;
                margin: 20mm;
            }
            body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 0; 
                background: #ffffff; 
                font-size: 12px;
                line-height: 1.4;
                color: #333;
            }
            .invoice-container { 
                max-width: 100%; 
                margin: 0; 
                background: white; 
                padding: 0; 
            }
            .header { 
                display: flex; 
                justify-content: space-between; 
                margin-bottom: 30px; 
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
            }
            .title { 
                font-size: 24px; 
                font-weight: bold; 
                color: #333; 
                margin-bottom: 5px; 
            }
            .invoice-number { 
                color: #666; 
                font-size: 14px; 
            }
            .company-name {
                font-size: 18px;
                font-weight: bold;
                color: #333;
            }
            .details { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 40px; 
                margin-bottom: 30px; 
            }
            .seller-info h3 { 
                margin: 0 0 10px 0; 
                color: #333; 
                font-size: 14px;
            }
            .seller-info p { 
                margin: 5px 0; 
                color: #666; 
                font-size: 12px;
            }
            .invoice-details { 
                text-align: right; 
            }
            .detail-item { 
                margin-bottom: 10px; 
            }
            .detail-label { 
                font-size: 10px; 
                color: #666; 
                text-transform: uppercase; 
                font-weight: bold; 
            }
            .detail-value { 
                font-size: 12px; 
                color: #333; 
            }
            .billing-section { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 20px; 
                margin-bottom: 30px; 
            }
            .bill-to, .ship-to { 
                background: #f8f9fa; 
                padding: 15px; 
                border-radius: 6px; 
            }
            .bill-to h3, .ship-to h3 { 
                margin: 0 0 10px 0; 
                font-size: 10px; 
                color: #666; 
                text-transform: uppercase; 
            }
            .bill-to h4, .ship-to h4 { 
                margin: 0 0 5px 0; 
                color: #333; 
                font-size: 12px;
            }
            .bill-to p, .ship-to p { 
                margin: 3px 0; 
                color: #666; 
                font-size: 10px; 
            }
            table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-bottom: 30px; 
            }
            th { 
                background: #f8f9fa; 
                padding: 8px; 
                text-align: left; 
                font-size: 10px; 
                color: #666; 
                text-transform: uppercase; 
                font-weight: bold; 
                border-bottom: 1px solid #ddd;
            }
            td { 
                padding: 8px; 
                border-bottom: 1px solid #eee; 
                font-size: 11px; 
            }
            .text-right { 
                text-align: right; 
            }
            .totals { 
                text-align: right; 
                margin-bottom: 30px; 
            }
            .total-row { 
                display: flex; 
                justify-content: space-between; 
                margin-bottom: 8px; 
                min-width: 200px; 
            }
            .total-label { 
                color: #666; 
                font-size: 11px;
            }
            .total-value { 
                font-weight: bold; 
                color: #333; 
                font-size: 11px;
            }
            .final-total { 
                border-top: 2px solid #333; 
                padding-top: 10px; 
                font-size: 14px; 
                font-weight: bold; 
            }
            .payment-info, .notes { 
                background: #f8f9fa; 
                padding: 15px; 
                border-radius: 6px; 
                margin-bottom: 20px; 
            }
            .payment-info h3, .notes h3 { 
                margin: 0 0 10px 0; 
                font-size: 12px; 
                color: #333; 
                text-transform: uppercase; 
            }
            .signature { 
                text-align: right; 
                margin-top: 40px; 
            }
            .signature-line { 
                width: 150px; 
                height: 1px; 
                background: #ccc; 
                margin-bottom: 10px; 
            }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <div class="header">
                <div>
                    <div class="title">INVOICE</div>
                    <div class="invoice-number">${data.general.invoiceNumberPrefix} ${data.general.invoiceNumberValue}</div>
                </div>
                <div>
                    <div class="company-name">${data.seller.name}</div>
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
                        <div class="detail-label">Date of Issue</div>
                        <div class="detail-value">${data.general.issueDate}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Due Date</div>
                        <div class="detail-value">${data.general.dueDate}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Currency</div>
                        <div class="detail-value">${data.general.currency}</div>
                    </div>
                </div>
            </div>

            <div class="billing-section">
                <div class="bill-to">
                    <h3>Bill To</h3>
                    <h4>${data.buyer.name}</h4>
                    <p>${data.buyer.address}</p>
                    <p>${data.buyer.email}</p>
                    <p><strong>${data.buyer.countryCode} VAT ${data.buyer.vatNumber}</strong></p>
                </div>
                <div class="ship-to">
                    <h3>Ship To</h3>
                    <h4>${data.buyer.name}</h4>
                    <p>${data.buyer.address}</p>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th class="text-right">Quantity</th>
                        <th class="text-right">Unit Price</th>
                        <th class="text-right">Tax</th>
                        <th class="text-right">Amount</th>
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
                    <span class="total-label">Subtotal</span>
                    <span class="total-value">${formatCurrency(subtotal, data.general.currency)}</span>
                </div>
                <div class="total-row">
                    <span class="total-label">VAT - ${data.buyer.countryCode} (${data.items[0]?.vatRate || 20}%)</span>
                    <span class="total-value">${formatCurrency(vat, data.general.currency)}</span>
                </div>
                <div class="total-row final-total">
                    <span class="total-label">Total</span>
                    <span class="total-value">${formatCurrency(total, data.general.currency)}</span>
                </div>
            </div>

            ${(data.payment?.showMethodInPDF || data.payment?.showDueDateInPDF || data.payment?.showTermsInPDF) ? `
                <div class="payment-info">
                    <h3>Payment Information</h3>
                    ${data.payment?.showMethodInPDF ? `<p><strong>Payment Method:</strong> ${data.payment.method}</p>` : ''}
                    ${data.payment?.showDueDateInPDF ? `<p><strong>Due Date:</strong> ${data.payment.dueDate}</p>` : ''}
                    ${data.payment?.showTermsInPDF ? `<p><strong>Payment Terms:</strong> ${data.payment.terms}</p>` : ''}
                </div>
            ` : ''}

            ${data.notes?.showInPDF && data.notes.content ? `
                <div class="notes">
                    <h3>Notes</h3>
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
};

export const generatePDF = async (data: InvoiceData): Promise<Buffer> => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    const html = generateHTML(data);
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      preferCSSPageSize: true
    });
    
    return pdf;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

export { generateHTML };
