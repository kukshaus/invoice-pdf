import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create basic styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 12,
    color: '#32325d',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#32325d',
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    fontSize: 14,
    color: '#32325d',
    marginBottom: 10,
  },
});

interface InvoiceData {
  general: {
    invoiceNumber: string;
    invoiceNumberPrefix: string;
    invoiceNumberValue: string;
    currency: string;
    language: string;
  };
  seller: {
    name: string;
  };
  buyer: {
    name: string;
  };
  items: any[];
}

// Create a very simple PDF Document
const InvoicePDFDocument = ({ data }: { data: InvoiceData }) => {
  return Document({
    children: [
      Page({
        size: 'A4',
        style: styles.page,
        children: [
          Text({
            style: styles.title,
            children: 'INVOICE'
          }),
          Text({
            style: styles.content,
            children: `Invoice Number: ${data.general.invoiceNumberPrefix} ${data.general.invoiceNumberValue}`
          }),
          Text({
            style: styles.content,
            children: `Seller: ${data.seller.name}`
          }),
          Text({
            style: styles.content,
            children: `Buyer: ${data.buyer.name}`
          }),
          Text({
            style: styles.content,
            children: `Currency: ${data.general.currency}`
          }),
          Text({
            style: styles.content,
            children: `Items: ${data.items.length}`
          })
        ]
      })
    ]
  });
};

export { InvoicePDFDocument };
