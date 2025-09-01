import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { getTranslation, formatDateLocalized } from './translations';

// Create styles
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

// Create PDF Document component without JSX
const InvoicePDFDocument = ({ data }: { data: InvoiceData }) => {
  const subtotal = calculateSubtotal(data.items);
  const vat = calculateVAT(data.items);
  const total = calculateTotal(data.items);

  return Document({
    children: [
      Page({
        size: 'A4',
        style: styles.page,
        children: [
          // Header
          View({
            style: styles.header,
            children: [
              View({
                children: [
                  Text({
                    style: styles.title,
                    children: getTranslation(data.general.language, 'invoice')
                  }),
                  Text({
                    style: styles.invoiceNumber,
                    children: `${data.general.invoiceNumberPrefix} ${data.general.invoiceNumberValue}`
                  })
                ]
              }),
              View({
                children: [
                  Text({
                    style: styles.companyName,
                    children: data.seller.name
                  })
                ]
              })
            ]
          }),

          // Invoice Details and Contact Information
          View({
            style: styles.details,
            children: [
              View({
                style: styles.leftColumn,
                children: [
                  View({
                    style: styles.sellerInfo,
                    children: [
                      Text({
                        style: styles.sellerName,
                        children: data.seller.name
                      }),
                      Text({
                        style: styles.sellerAddress,
                        children: data.seller.address
                      }),
                      Text({
                        style: styles.sellerContact,
                        children: data.seller.email
                      }),
                      ...(data.seller.showVatInPDF ? [
                        Text({
                          style: styles.sellerVat,
                          children: `GB VAT ${data.seller.vatNumber}`
                        })
                      ] : [])
                    ]
                  })
                ]
              }),
              
              View({
                style: styles.rightColumn,
                children: [
                  View({
                    style: styles.invoiceDetails,
                    children: [
                      View({
                        style: styles.detailItem,
                        children: [
                          Text({
                            style: styles.detailLabel,
                            children: getTranslation(data.general.language, 'dateOfIssue')
                          }),
                          Text({
                            style: styles.detailValue,
                            children: formatDate(data.general.issueDate, data.general.language)
                          })
                        ]
                      }),
                      View({
                        style: styles.detailItem,
                        children: [
                          Text({
                            style: styles.detailLabel,
                            children: getTranslation(data.general.language, 'dateDue')
                          }),
                          Text({
                            style: styles.detailValue,
                            children: formatDate(data.general.dueDate, data.general.language)
                          })
                        ]
                      }),
                      View({
                        style: styles.detailItem,
                        children: [
                          Text({
                            style: styles.detailLabel,
                            children: getTranslation(data.general.language, 'currency')
                          }),
                          Text({
                            style: styles.detailValue,
                            children: data.general.currency
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          // Bill To and Ship To
          View({
            style: styles.billingSection,
            children: [
              View({
                style: styles.billTo,
                children: [
                  Text({
                    style: styles.billToTitle,
                    children: getTranslation(data.general.language, 'billTo')
                  }),
                  View({
                    style: styles.billToContent,
                    children: [
                      Text({
                        style: styles.billToName,
                        children: data.buyer.name
                      }),
                      Text({
                        style: styles.billToAddress,
                        children: data.buyer.address
                      }),
                      Text({
                        style: styles.billToContact,
                        children: data.buyer.email
                      }),
                      Text({
                        style: styles.billToVat,
                        children: `GB VAT ${data.buyer.vatNumber}`
                      })
                    ]
                  })
                ]
              }),
              
              View({
                style: styles.shipTo,
                children: [
                  Text({
                    style: styles.shipToTitle,
                    children: getTranslation(data.general.language, 'shipTo')
                  }),
                  View({
                    style: styles.shipToContent,
                    children: [
                      Text({
                        style: styles.shipToName,
                        children: data.buyer.name
                      }),
                      Text({
                        style: styles.shipToAddress,
                        children: data.buyer.address
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          // Items Table
          View({
            style: styles.table,
            children: [
              View({
                style: styles.tableHeader,
                children: [
                  Text({
                    style: [styles.tableHeaderCell, { flex: 4 }],
                    children: getTranslation(data.general.language, 'description')
                  }),
                  Text({
                    style: [styles.tableHeaderCell, { flex: 1, textAlign: 'right' }],
                    children: getTranslation(data.general.language, 'quantity')
                  }),
                  Text({
                    style: [styles.tableHeaderCell, { flex: 1, textAlign: 'right' }],
                    children: getTranslation(data.general.language, 'unitPrice')
                  }),
                  Text({
                    style: [styles.tableHeaderCell, { flex: 1, textAlign: 'right' }],
                    children: getTranslation(data.general.language, 'tax')
                  }),
                  Text({
                    style: [styles.tableHeaderCell, { flex: 1, textAlign: 'right' }],
                    children: getTranslation(data.general.language, 'amount')
                  })
                ]
              }),
              
              ...data.items.map((item, index) => 
                View({
                  key: item.id,
                  style: styles.tableRow,
                  children: [
                    Text({
                      style: [styles.tableCell, { flex: 4 }],
                      children: item.description || `Item ${index + 1}`
                    }),
                    Text({
                      style: [styles.tableCell, { flex: 1, textAlign: 'right' }],
                      children: item.quantity.toString()
                    }),
                    Text({
                      style: [styles.tableCell, { flex: 1, textAlign: 'right' }],
                      children: formatCurrency(item.unitPrice, data.general.currency)
                    }),
                    Text({
                      style: [styles.tableCell, { flex: 1, textAlign: 'right' }],
                      children: `${item.vatRate}%`
                    }),
                    Text({
                      style: [styles.tableCell, { flex: 1, textAlign: 'right', fontWeight: 'bold' }],
                      children: formatCurrency(item.quantity * item.unitPrice, data.general.currency)
                    })
                  ]
                })
              )
            ]
          }),

          // Totals
          View({
            style: styles.totals,
            children: [
              View({
                style: styles.totalRow,
                children: [
                  Text({
                    style: styles.totalLabel,
                    children: getTranslation(data.general.language, 'subtotal')
                  }),
                  Text({
                    style: styles.totalValue,
                    children: formatCurrency(subtotal, data.general.currency)
                  })
                ]
              }),
              View({
                style: styles.totalRow,
                children: [
                  Text({
                    style: styles.totalLabel,
                    children: `${getTranslation(data.general.language, 'vat')} - ${data.buyer.countryCode} (${data.items[0]?.vatRate || 20}%)`
                  }),
                  Text({
                    style: styles.totalValue,
                    children: formatCurrency(vat, data.general.currency)
                  })
                ]
              }),
              View({
                style: styles.totalRow,
                children: [
                  Text({
                    style: styles.finalTotal,
                    children: getTranslation(data.general.language, 'total')
                  }),
                  Text({
                    style: styles.finalTotal,
                    children: formatCurrency(total, data.general.currency)
                  })
                ]
              })
            ]
          }),

          // Payment Information
          ...(data.payment?.showMethodInPDF || data.payment?.showDueDateInPDF || data.payment?.showTermsInPDF ? [
            View({
              style: styles.paymentInfo,
              children: [
                Text({
                  style: styles.sectionTitle,
                  children: getTranslation(data.general.language, 'paymentInformation')
                }),
                View({
                  style: styles.paymentContent,
                  children: [
                    ...(data.payment?.showMethodInPDF ? [
                      View({
                        style: styles.paymentRow,
                        children: [
                          Text({
                            style: styles.paymentLabel,
                            children: `${getTranslation(data.general.language, 'paymentMethod')}:`
                          }),
                          Text({
                            style: styles.paymentValue,
                            children: data.payment.method
                          })
                        ]
                      })
                    ] : []),
                    ...(data.payment?.showDueDateInPDF ? [
                      View({
                        style: styles.paymentRow,
                        children: [
                          Text({
                            style: styles.paymentLabel,
                            children: `${getTranslation(data.general.language, 'dueDate')}:`
                          }),
                          Text({
                            style: styles.paymentValue,
                            children: formatDate(data.payment.dueDate, data.general.language)
                          })
                        ]
                      })
                    ] : []),
                    ...(data.payment?.showTermsInPDF ? [
                      View({
                        style: styles.paymentRow,
                        children: [
                          Text({
                            style: styles.paymentLabel,
                            children: `${getTranslation(data.general.language, 'paymentTerms')}:`
                          }),
                          Text({
                            style: styles.paymentValue,
                            children: data.payment.terms
                          })
                        ]
                      })
                    ] : [])
                  ]
                })
              ]
            })
          ] : []),

          // Notes
          ...(data.notes?.showInPDF && data.notes.content ? [
            View({
              style: styles.notes,
              children: [
                Text({
                  style: styles.sectionTitle,
                  children: getTranslation(data.general.language, 'notes')
                }),
                Text({
                  style: styles.notesContent,
                  children: data.notes.content
                })
              ]
            })
          ] : []),

          // Signature
          ...(data.signature?.showInPDF ? [
            View({
              style: styles.signature,
              children: [
                View({
                  style: styles.signatureLine
                }),
                Text({
                  style: styles.signatureName,
                  children: data.signature.name
                }),
                Text({
                  style: styles.signatureTitle,
                  children: data.signature.title
                })
              ]
            })
          ] : [])
        ]
      })
    ]
  });
};

export { InvoicePDFDocument };
