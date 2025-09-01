const https = require('https');
const http = require('http');
const fs = require('fs');

const API_BASE_URL = 'http://localhost:3000/api/generate-invoice';

const testInvoiceData = {
  general: {
    invoiceNumberPrefix: "INV-",
    invoiceNumberValue: "2024-TEST-001",
    issueDate: "2024-01-15",
    dueDate: "2024-02-15",
    serviceDate: "2024-01-10",
    currency: "EUR",
    language: "en",
    template: "default",
    dateFormat: "YYYY-MM-DD"
  },
  seller: {
    name: "Test Company Ltd",
    address: "123 Test Street, Test City, TC 12345",
    vatNumber: "TC123456789",
    email: "test@testcompany.com",
    accountNumber: "12345678",
    swiftBic: "TESTGB22",
    countryCode: "GB",
    showVatInPDF: true,
    showAccountInPDF: false,
    showSwiftInPDF: false,
    notes: "Test invoice",
    showNotesInPDF: true
  },
  buyer: {
    name: "Test Client GmbH",
    address: "456 Client Avenue, Test City, TC 67890",
    vatNumber: "TC987654321",
    email: "accounts@testclient.de",
    countryCode: "DE"
  },
  items: [
    {
      id: "item-1",
      description: "Test Service",
      quantity: 1,
      unitPrice: 1000.00,
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
    content: "This is a test invoice for API feature verification.",
    showInPDF: true
  },
  signature: {
    showInPDF: true,
    name: "Test User",
    title: "Test Manager"
  },
  template: "default"
};

function makeRequest(data, returnHtml = false) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const path = returnHtml ? '/api/generate-invoice?html=true' : '/api/generate-invoice';
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let responseData = [];
      
      res.on('data', (chunk) => {
        responseData.push(chunk);
      });
      
      res.on('end', () => {
        const buffer = Buffer.concat(responseData);
        
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: buffer
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function testDefaultPDFResponse() {
  console.log('Testing default PDF response...');
  
  try {
    const response = await makeRequest(testInvoiceData);
    
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers['content-type']);
    console.log('Content-Disposition:', response.headers['content-disposition']);

    if (response.status === 200) {
      console.log('PDF size:', response.data.length, 'bytes');
      
      // Save the PDF
      fs.writeFileSync('test-default-response.pdf', response.data);
      console.log('✅ Default PDF response test passed - PDF saved as test-default-response.pdf');
    } else {
      console.log('❌ Default PDF response test failed');
      console.log('Error:', response.data.toString());
    }
  } catch (error) {
    console.log('❌ Default PDF response test failed with error:', error.message);
  }
}

async function testHTMLResponse() {
  console.log('\nTesting HTML response with ?html=true...');
  
  try {
    const response = await makeRequest(testInvoiceData, true);
    
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers['content-type']);
    console.log('Content-Disposition:', response.headers['content-disposition']);

    if (response.status === 200) {
      console.log('HTML size:', response.data.length, 'bytes');
      
      // Save the HTML
      fs.writeFileSync('test-html-response.html', response.data);
      console.log('✅ HTML response test passed - HTML saved as test-html-response.html');
    } else {
      console.log('❌ HTML response test failed');
      console.log('Error:', response.data.toString());
    }
  } catch (error) {
    console.log('❌ HTML response test failed with error:', error.message);
  }
}

async function testJSONResponse() {
  console.log('\nTesting JSON response with includeJsonData=true...');
  
  try {
    const response = await makeRequest({
      ...testInvoiceData,
      includeJsonData: true
    });

    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers['content-type']);

    if (response.status === 200) {
      const result = JSON.parse(response.data.toString());
      console.log('Response success:', result.success);
      console.log('Invoice number:', result.data?.invoiceNumber);
      console.log('PDF size in response:', result.data?.pdfSize, 'bytes');
      console.log('Has PDF base64:', !!result.data?.pdfBase64);
      console.log('Has PDF HTML:', !!result.data?.pdfHtml);
      console.log('Has HTML preview:', !!result.data?.htmlPreview);
      console.log('Has totals:', !!result.data?.totals);

      if (result.success && result.data?.pdfBase64) {
        // Save PDF content
        const pdfBuffer = Buffer.from(result.data.pdfBase64, 'base64');
        fs.writeFileSync('test-json-response.pdf', pdfBuffer);
        console.log('✅ JSON response test passed - PDF saved as test-json-response.pdf');
      } else {
        console.log('❌ JSON response test failed - missing expected data');
      }
    } else {
      console.log('❌ JSON response test failed');
      console.log('Error:', response.data.toString());
    }
  } catch (error) {
    console.log('❌ JSON response test failed with error:', error.message);
  }
}

async function runTests() {
  console.log('🧪 Testing new API feature: Default PDF response, HTML response, and JSON response\n');
  
  await testDefaultPDFResponse();
  await testHTMLResponse();
  await testJSONResponse();
  
  console.log('\n🏁 Tests completed!');
}

// Run tests
runTests().catch(console.error);
