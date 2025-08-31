// Test script for the Invoice PDF Generator API
// Run with: node test-api.js

const testInvoiceData = {
  general: {
    invoiceNumber: "INV-2024-001",
    invoiceNumberPrefix: "INV-",
    invoiceNumberValue: "2024-001",
    issueDate: "2024-01-15",
    dueDate: "2024-02-15",
    serviceDate: "2024-01-10",
    currency: "EUR",
    language: "en",
    template: "default",
    dateFormat: "YYYY-MM-DD",
    paymentLinkUrl: "https://payment.example.com/pay/123",
    companyLogo: "https://example.com/logo.png"
  },
  seller: {
    name: "Tech Solutions Ltd",
    address: "123 Business Street, London, UK, SW1A 1AA",
    vatNumber: "GB123456789",
    email: "contact@techsolutions.com",
    accountNumber: "12345678",
    swiftBic: "BARCGB22",
    countryCode: "GB",
    showVatInPDF: true,
    showAccountInPDF: false,
    showSwiftInPDF: false,
    notes: "Thank you for your business!",
    showNotesInPDF: true
  },
  buyer: {
    name: "Client Company GmbH",
    address: "456 Client Avenue, Berlin, Germany, 10115",
    vatNumber: "DE987654321",
    email: "accounts@clientcompany.de",
    countryCode: "DE"
  },
  items: [
    {
      id: "item-1",
      description: "Web Development Services",
      quantity: 1,
      unitPrice: 2500.00,
      vatRate: 20
    },
    {
      id: "item-2",
      description: "UI/UX Design",
      quantity: 1,
      unitPrice: 1500.00,
      vatRate: 20
    },
    {
      id: "item-3",
      description: "Project Management",
      quantity: 10,
      unitPrice: 100.00,
      vatRate: 20
    }
  ],
  payment: {
    method: "Bank Transfer",
    dueDate: "2024-02-15",
    terms: "Net 30 days",
    showMethodInPDF: true,
    showDueDateInPDF: true,
    showTermsInPDF: true
  },
  notes: {
    content: "Please include invoice number as payment reference. Late payments may incur additional charges.",
    showInPDF: true
  },
  signature: {
    showInPDF: true,
    name: "John Smith",
    title: "Managing Director"
  },
  template: "default"
};

async function testAPI() {
  try {
    console.log('🚀 Testing Invoice PDF Generator API...\n');
    
    // Test with local development server
    const response = await fetch('http://localhost:3000/api/generate-invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testInvoiceData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Invoice generated successfully!');
      console.log(`📄 Invoice Number: ${result.data.invoiceNumber}`);
      console.log(`💰 Subtotal: €${result.data.totals.subtotal.toFixed(2)}`);
      console.log(`🧾 VAT: €${result.data.totals.vat.toFixed(2)}`);
      console.log(`💳 Total: €${result.data.totals.total.toFixed(2)}`);
      
      if (result.data.databaseId) {
        console.log(`💾 Database ID: ${result.data.databaseId}`);
      }
      
      console.log('\n📋 HTML Preview length:', result.data.htmlPreview.length, 'characters');
      
      // Save HTML preview to file
      const fs = require('fs');
      fs.writeFileSync('invoice-preview.html', result.data.htmlPreview);
      console.log('💾 HTML preview saved to: invoice-preview.html');
      
    } else {
      console.error('❌ API Error:', result.error);
      if (result.errors) {
        console.error('Validation errors:');
        result.errors.forEach(error => console.error(`  - ${error}`));
      }
    }
    
  } catch (error) {
    console.error('❌ Network Error:', error.message);
    console.log('\n💡 Make sure your development server is running:');
    console.log('   npm run dev');
  }
}

// Test with different languages
async function testMultiLanguage() {
  const languages = ['en', 'de', 'fr', 'es', 'it'];
  
  console.log('\n🌍 Testing multi-language support...\n');
  
  for (const lang of languages) {
    try {
      const testData = {
        ...testInvoiceData,
        general: {
          ...testInvoiceData.general,
          language: lang
        }
      };
      
      const response = await fetch('http://localhost:3000/api/generate-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ ${lang.toUpperCase()}: Invoice generated (Total: €${result.data.totals.total.toFixed(2)})`);
      } else {
        console.log(`❌ ${lang.toUpperCase()}: ${result.error}`);
      }
      
    } catch (error) {
      console.log(`❌ ${lang.toUpperCase()}: Network error`);
    }
  }
}

// Test with different currencies
async function testMultiCurrency() {
  const currencies = ['EUR', 'USD', 'GBP', 'CHF', 'SEK'];
  
  console.log('\n💱 Testing multi-currency support...\n');
  
  for (const currency of currencies) {
    try {
      const testData = {
        ...testInvoiceData,
        general: {
          ...testInvoiceData.general,
          currency: currency
        }
      };
      
      const response = await fetch('http://localhost:3000/api/generate-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ ${currency}: Invoice generated (Total: ${result.data.totals.total.toFixed(2)})`);
      } else {
        console.log(`❌ ${currency}: ${result.error}`);
      }
      
    } catch (error) {
      console.log(`❌ ${currency}: Network error`);
    }
  }
}

// Main test execution
async function runTests() {
  await testAPI();
  await testMultiLanguage();
  await testMultiCurrency();
  
  console.log('\n🎉 All tests completed!');
  console.log('\n📚 For more examples, see: API_DOCUMENTATION.md');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ or fetch polyfill');
  console.log('💡 Install node-fetch: npm install node-fetch');
  process.exit(1);
}

runTests();
