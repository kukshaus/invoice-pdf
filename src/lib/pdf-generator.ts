import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { getTranslation, formatDateLocalized } from './translations';

// Create styles with Stripe-like design
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 8,
    color: '#32325d',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#32325d',
    marginBottom: 3,
  },
  invoiceNumber: {
    fontSize: 9,
    color: '#6b7c93',
    marginBottom: 1,
  },
  companyInfo: {
    alignItems: 'flex-end',
  },
  logoContainer: {
    marginBottom: 12,
  },
  companyLogo: {
    width: 50,
    height: 50,
    objectFit: 'contain',
  },
  companyName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#32325d',
    marginBottom: 3,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  leftColumn: {
    flex: 1,
    marginRight: 40,
  },
  rightColumn: {
    flex: 1,
  },
  sellerInfo: {
    marginBottom: 15,
  },
  sellerName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#32325d',
    marginBottom: 2,
  },
  sellerAddress: {
    fontSize: 9,
    color: '#6b7c93',
    lineHeight: 1.3,
    marginBottom: 1,
  },
  sellerContact: {
    fontSize: 9,
    color: '#6b7c93',
    marginBottom: 1,
  },
  sellerVat: {
    fontSize: 9,
    color: '#6b7c93',
    fontWeight: 'bold',
  },
  invoiceDetails: {
    alignItems: 'flex-end',
  },
  detailItem: {
    marginBottom: 4,
    alignItems: 'flex-end',
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#6b7c93',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 9,
    color: '#32325d',
  },
  billingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  billTo: {
    flex: 1,
    marginRight: 20,
  },
  billToTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#32325d',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  billToContent: {
    backgroundColor: '#f6f9fc',
    padding: 12,
    borderRadius: 6,
  },
  billToName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#32325d',
    marginBottom: 3,
  },
  billToAddress: {
    fontSize: 9,
    color: '#6b7c93',
    lineHeight: 1.3,
    marginBottom: 1,
  },
  billToContact: {
    fontSize: 9,
    color: '#6b7c93',
    marginBottom: 1,
  },
  billToVat: {
    fontSize: 9,
    color: '#6b7c93',
    fontWeight: 'bold',
  },
  shipTo: {
    flex: 1,
    marginLeft: 20,
  },
  shipToTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#32325d',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  shipToContent: {
    backgroundColor: '#f6f9fc',
    padding: 12,
    borderRadius: 6,
  },
  shipToName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#32325d',
    marginBottom: 3,
  },
  shipToAddress: {
    fontSize: 9,
    color: '#6b7c93',
    lineHeight: 1.3,
  },
  table: {
    marginBottom: 50,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e6ebf1',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#6b7c93',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f6f9fc',
  },
  tableCell: {
    fontSize: 9,
    color: '#32325d',
  },
  totals: {
    alignItems: 'flex-end',
    marginTop: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    minWidth: 200,
  },
  totalLabel: {
    fontSize: 9,
    color: '#6b7c93',
  },
  totalValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#32325d',
  },
  finalTotal: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#32325d',
    borderTopWidth: 1,
    borderTopColor: '#e6ebf1',
    paddingTop: 12,
    marginTop: 12,
  },
  paymentInfo: {
    marginTop: 40,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#32325d',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  paymentContent: {
    backgroundColor: '#f6f9fc',
    padding: 12,
    borderRadius: 6,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  paymentLabel: {
    fontSize: 9,
    color: '#6b7c93',
  },
  paymentValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#32325d',
  },
  notes: {
    marginTop: 30,
    marginBottom: 30,
  },
  notesContent: {
    fontSize: 10,
    color: '#32325d',
    backgroundColor: '#f6f9fc',
    padding: 16,
    borderRadius: 6,
    lineHeight: 1.5,
  },
  signature: {
    marginTop: 40,
    alignItems: 'flex-end',
  },
  signatureLine: {
    width: 140,
    height: 1,
    backgroundColor: '#e6ebf1',
    marginBottom: 8,
  },
  signatureName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#32325d',
    textAlign: 'center',
  },
  signatureTitle: {
    fontSize: 9,
    color: '#6b7c93',
    textAlign: 'center',
  },
  paymentLink: {
    marginTop: 30,
    alignItems: 'center',
  },
  paymentLinkText: {
    fontSize: 11,
    color: '#6772e5',
    textDecoration: 'underline',
  },
});

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

const formatDate = (date: string | Date, language: string = 'en'): string => {
  return formatDateLocalized(date, language);
};

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

// Create PDF Document component
const InvoicePDFDocument = ({ data }: { data: InvoiceData }) => {
  const subtotal = calculateSubtotal(data.items);
  const vat = calculateVAT(data.items);
  const total = calculateTotal(data.items);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{getTranslation(data.general.language, 'invoice')}</Text>
            <Text style={styles.invoiceNumber}>{data.general.invoiceNumberPrefix} {data.general.invoiceNumberValue}</Text>
          </View>
          <View style={styles.companyInfo}>
            {data.general.template === 'stripe' && data.general.companyLogo && (
              <View style={styles.logoContainer}>
                <Image src={data.general.companyLogo} style={styles.companyLogo} />
              </View>
            )}
            <Text style={styles.companyName}>{data.seller.name}</Text>
          </View>
        </View>

        {/* Invoice Details and Contact Information */}
        <View style={styles.details}>
          <View style={styles.leftColumn}>
            {/* Seller Information */}
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{data.seller.name}</Text>
              <Text style={styles.sellerAddress}>{data.seller.address}</Text>
              <Text style={styles.sellerContact}>{data.seller.email}</Text>
              <Text style={styles.sellerContact}>+44 20 456 7890</Text>
              {data.seller.showVatInPDF && (
                <Text style={styles.sellerVat}>GB VAT {data.seller.vatNumber}</Text>
              )}
            </View>
          </View>
          
          <View style={styles.rightColumn}>
            {/* Invoice Details */}
            <View style={styles.invoiceDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{getTranslation(data.general.language, 'dateOfIssue')}</Text>
                <Text style={styles.detailValue}>{formatDate(data.general.issueDate, data.general.language)}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{getTranslation(data.general.language, 'dateDue')}</Text>
                <Text style={styles.detailValue}>{formatDate(data.general.dueDate, data.general.language)}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{getTranslation(data.general.language, 'currency')}</Text>
                <Text style={styles.detailValue}>{data.general.currency}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bill To and Ship To */}
        <View style={styles.billingSection}>
          <View style={styles.billTo}>
            <Text style={styles.billToTitle}>{getTranslation(data.general.language, 'billTo')}</Text>
            <View style={styles.billToContent}>
              <Text style={styles.billToName}>{data.buyer.name}</Text>
              <Text style={styles.billToAddress}>{data.buyer.address}</Text>
              <Text style={styles.billToContact}>{data.buyer.email}</Text>
              <Text style={styles.billToVat}>GB VAT {data.buyer.vatNumber}</Text>
            </View>
          </View>
          
          <View style={styles.shipTo}>
            <Text style={styles.shipToTitle}>{getTranslation(data.general.language, 'shipTo')}</Text>
            <View style={styles.shipToContent}>
              <Text style={styles.shipToName}>{data.buyer.name}</Text>
              <Text style={styles.shipToAddress}>{data.buyer.address}</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 4 }]}>{getTranslation(data.general.language, 'description')}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'right' }]}>{getTranslation(data.general.language, 'quantity')}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'right' }]}>{getTranslation(data.general.language, 'unitPrice')}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'right' }]}>{getTranslation(data.general.language, 'tax')}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'right' }]}>{getTranslation(data.general.language, 'amount')}</Text>
          </View>
          
          {data.items.map((item, index) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 4 }]}>{item.description || `Item ${index + 1}`}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                {formatCurrency(item.unitPrice, data.general.currency)}
              </Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>{item.vatRate}%</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', fontWeight: 'bold' }]}>
                {formatCurrency(item.quantity * item.unitPrice, data.general.currency)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{getTranslation(data.general.language, 'subtotal')}</Text>
            <Text style={styles.totalValue}>{formatCurrency(subtotal, data.general.currency)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{getTranslation(data.general.language, 'vat')} - {data.buyer.countryCode} ({data.items[0]?.vatRate || 20}%)</Text>
            <Text style={styles.totalValue}>{formatCurrency(vat, data.general.currency)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.finalTotal}>{getTranslation(data.general.language, 'total')}</Text>
            <Text style={styles.finalTotal}>{formatCurrency(total, data.general.currency)}</Text>
          </View>
        </View>

        {/* Payment Link for Stripe Template */}
        {data.general.template === 'stripe' && data.general.paymentLinkUrl && (
          <View style={styles.paymentLink}>
            <Text style={styles.paymentLinkText}>Pay online</Text>
          </View>
        )}

        {/* Payment Information */}
        {(data.payment?.showMethodInPDF || data.payment?.showDueDateInPDF || data.payment?.showTermsInPDF) && (
          <View style={styles.paymentInfo}>
            <Text style={styles.sectionTitle}>{getTranslation(data.general.language, 'paymentInformation')}</Text>
            <View style={styles.paymentContent}>
              {data.payment?.showMethodInPDF && (
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>{getTranslation(data.general.language, 'paymentMethod')}:</Text>
                  <Text style={styles.paymentValue}>{data.payment.method}</Text>
                </View>
              )}
              {data.payment?.showDueDateInPDF && (
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>{getTranslation(data.general.language, 'dueDate')}:</Text>
                  <Text style={styles.paymentValue}>{formatDate(data.payment.dueDate, data.general.language)}</Text>
                </View>
              )}
              {data.payment?.showTermsInPDF && (
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>{getTranslation(data.general.language, 'paymentTerms')}:</Text>
                  <Text style={styles.paymentValue}>{data.payment.terms}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Notes */}
        {data.notes?.showInPDF && data.notes.content && (
          <View style={styles.notes}>
            <Text style={styles.sectionTitle}>{getTranslation(data.general.language, 'notes')}</Text>
            <Text style={styles.notesContent}>{data.notes.content}</Text>
          </View>
        )}

        {/* Signature */}
        {data.signature?.showInPDF && (
          <View style={styles.signature}>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureName}>{data.signature.name}</Text>
            <Text style={styles.signatureTitle}>{data.signature.title}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export { InvoicePDFDocument };
