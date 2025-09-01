const fs = require('fs');

async function testGenerateLink() {
  const testData = {
    invoiceData: {
      invoiceNumber: "LINK-TEST-001",
      general: {
        issueDate: "2025-01-01",
        dueDate: "2025-01-31",
        currency: "USD",
        language: "en"
      },
      seller: {
        name: "Test Company",
        address: "123 Test St\nTest City, TC 12345",
        email: "seller@testcompany.com",
        vatNumber: "VAT123456"
      },
      buyer: {
        name: "Test Customer",
        address: "456 Customer Ave\nCustomer City, CC 67890",
        email: "customer@testcustomer.com",
        vatNumber: "VAT789012"
      },
      items: [
        {
          description: "Test Service",
          quantity: 1,
          unitPrice: 100,
          total: 100,
          vatRate: 20
        }
      ],
      notes: "Test invoice for generate link"
    },
    hasPassword: false,
    expiryDays: 30
  };

  try {
    console.log('🔗 Testing Generate Link API...');
    
    const response = await fetch('http://localhost:3000/api/invoices/generate-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log('Status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Success!');
      console.log('Link ID:', result.linkId);
      console.log('Share URL:', result.shareableUrl);
      console.log('Expires At:', result.expiresAt);
      console.log('Has Password:', result.hasPassword);
      
      // Save result to file for reference
      fs.writeFileSync('test-generate-link-result.json', JSON.stringify(result, null, 2));
      console.log('📄 Result saved to test-generate-link-result.json');
      
    } else {
      const error = await response.text();
      console.log('❌ Error:', error);
    }
    
  } catch (err) {
    console.error('❌ Network Error:', err.message);
    console.log('\n💡 Make sure your development server is running:');
    console.log('   npm run dev');
  }
}

testGenerateLink();
