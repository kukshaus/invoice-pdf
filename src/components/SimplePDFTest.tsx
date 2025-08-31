'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { ClientOnly } from './ClientOnly';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
  },
});

const SimplePDFTest: React.FC = () => {
  return (
    <ClientOnly fallback={
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading PDF test...</p>
        </div>
      </div>
    }>
      <div className="h-[calc(100vh-12rem)] border border-gray-200 rounded-lg overflow-hidden">
        <PDFViewer style={{ width: '100%', height: '100%' }}>
          <Document>
            <Page size="A4" style={styles.page}>
              <Text style={styles.title}>Test PDF</Text>
              <Text style={styles.text}>This is a test PDF to verify that @react-pdf/renderer is working.</Text>
              <Text style={styles.text}>If you can see this, the PDF rendering is working correctly!</Text>
            </Page>
          </Document>
        </PDFViewer>
      </div>
    </ClientOnly>
  );
};

export default SimplePDFTest;
