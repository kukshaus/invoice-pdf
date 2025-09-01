# Invoice PDF Generator API Documentation

## Overview

The Invoice PDF Generator API allows you to create professional invoices programmatically using JSON payloads. The API generates both HTML preview and PDF versions of invoices with support for multiple languages and currencies.

## Base URL

```
https://your-domain.com/api/generate-invoice
```

## Endpoints

### POST /api/generate-invoice

Creates a new invoice with the provided data and returns HTML preview, PDF (base64), and calculated totals.

#### Request

**Content-Type:** `application/json`

#### Request Body Schema

```typescript
interface InvoiceData {
  includeJsonData?: boolean;        // Optional: Set to true to include JSON response data (default: false)
  general: {
    invoiceNumber: string;           // Legacy field (optional)
    invoiceNumberPrefix: string;     // Required: Invoice prefix (e.g., "INV-")
    invoiceNumberValue: string;      // Required: Invoice number (e.g., "2024-001")
    issueDate: string;              // Required: Date when invoice was issued (YYYY-MM-DD)
    dueDate: string;                // Required: Payment due date (YYYY-MM-DD)
    serviceDate: string;            // Required: Date of service (YYYY-MM-DD)
    currency: string;               // Required: Currency code (e.g., "EUR", "USD")
    language: string;               // Required: Language code (e.g., "en", "de", "fr")
    template: 'default' | 'stripe'; // Required: Template type
    dateFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY'; // Required: Date format
    paymentLinkUrl?: string;         // Optional: Payment link URL
    companyLogo?: string;           // Optional: Company logo URL
  };
  seller: {
    name: string;                   // Required: Seller company name
    address: string;                // Required: Seller address
    vatNumber: string;              // Required: Seller VAT number
    email: string;                  // Required: Seller email
    accountNumber: string;          // Required: Bank account number
    swiftBic: string;               // Required: SWIFT/BIC code
    countryCode: string;            // Required: Country code (e.g., "GB", "DE")
    showVatInPDF: boolean;          // Required: Show VAT in PDF
    showAccountInPDF: boolean;      // Required: Show account in PDF
    showSwiftInPDF: boolean;        // Required: Show SWIFT in PDF
    notes: string;                  // Required: Seller notes
    showNotesInPDF: boolean;        // Required: Show notes in PDF
  };
  buyer: {
    name: string;                   // Required: Buyer company name
    address: string;                // Required: Buyer address
    vatNumber: string;              // Required: Buyer VAT number
    email: string;                  // Required: Buyer email
    countryCode: string;            // Required: Country code
  };
  items: InvoiceItem[];             // Required: Array of invoice items
  payment: {
    method: string;                 // Required: Payment method
    dueDate: string;               // Required: Payment due date
    terms: string;                 // Required: Payment terms
    showMethodInPDF: boolean;      // Required: Show method in PDF
    showDueDateInPDF: boolean;     // Required: Show due date in PDF
    showTermsInPDF: boolean;       // Required: Show terms in PDF
  };
  notes: {
    content: string;               // Required: Invoice notes
    showInPDF: boolean;           // Required: Show notes in PDF
  };
  signature: {
    showInPDF: boolean;           // Required: Show signature in PDF
    name: string;                  // Required: Signer name
    title: string;                // Required: Signer title
  };
  template: 'default' | 'stripe';  // Required: Template type
}

interface InvoiceItem {
  id: string;                      // Required: Unique item ID
  description: string;             // Required: Item description
  quantity: number;                // Required: Item quantity
  unitPrice: number;               // Required: Unit price
  vatRate: number;                 // Required: VAT rate percentage
}
```

#### Example Request - Default (PDF Response)

```json
{
  "general": {
    "invoiceNumber": "INV-2024-001",
    "invoiceNumberPrefix": "INV-",
    "invoiceNumberValue": "2024-001",
    "issueDate": "2024-01-15",
    "dueDate": "2024-02-15",
    "serviceDate": "2024-01-10",
    "currency": "EUR",
    "language": "en",
    "template": "default",
    "dateFormat": "YYYY-MM-DD",
    "paymentLinkUrl": "https://payment.example.com/pay/123",
    "companyLogo": "https://example.com/logo.png"
  },
  "seller": {
    "name": "Tech Solutions Ltd",
    "address": "123 Business Street, London, UK, SW1A 1AA",
    "vatNumber": "GB123456789",
    "email": "contact@techsolutions.com",
    "accountNumber": "12345678",
    "swiftBic": "BARCGB22",
    "countryCode": "GB",
    "showVatInPDF": true,
    "showAccountInPDF": false,
    "showSwiftInPDF": false,
    "notes": "Thank you for your business!",
    "showNotesInPDF": true
  },
  "buyer": {
    "name": "Client Company GmbH",
    "address": "456 Client Avenue, Berlin, Germany, 10115",
    "vatNumber": "DE987654321",
    "email": "accounts@clientcompany.de",
    "countryCode": "DE"
  },
  "items": [
    {
      "id": "item-1",
      "description": "Web Development Services",
      "quantity": 1,
      "unitPrice": 2500.00,
      "vatRate": 20
    },
    {
      "id": "item-2",
      "description": "UI/UX Design",
      "quantity": 1,
      "unitPrice": 1500.00,
      "vatRate": 20
    },
    {
      "id": "item-3",
      "description": "Project Management",
      "quantity": 10,
      "unitPrice": 100.00,
      "vatRate": 20
    }
  ],
  "payment": {
    "method": "Bank Transfer",
    "dueDate": "2024-02-15",
    "terms": "Net 30 days",
    "showMethodInPDF": true,
    "showDueDateInPDF": true,
    "showTermsInPDF": true
  },
  "notes": {
    "content": "Please include invoice number as payment reference. Late payments may incur additional charges.",
    "showInPDF": true
  },
  "signature": {
    "showInPDF": true,
    "name": "John Smith",
    "title": "Managing Director"
  },
  "template": "default"
}
```

#### Example Request - JSON Response

```json
{
  "includeJsonData": true,
  "general": {
    "invoiceNumber": "INV-2024-001",
    "invoiceNumberPrefix": "INV-",
    "invoiceNumberValue": "2024-001",
    "issueDate": "2024-01-15",
    "dueDate": "2024-02-15",
    "serviceDate": "2024-01-10",
    "currency": "EUR",
    "language": "en",
    "template": "default",
    "dateFormat": "YYYY-MM-DD",
    "paymentLinkUrl": "https://payment.example.com/pay/123",
    "companyLogo": "https://example.com/logo.png"
  },
  "seller": {
    "name": "Tech Solutions Ltd",
    "address": "123 Business Street, London, UK, SW1A 1AA",
    "vatNumber": "GB123456789",
    "email": "contact@techsolutions.com",
    "accountNumber": "12345678",
    "swiftBic": "BARCGB22",
    "countryCode": "GB",
    "showVatInPDF": true,
    "showAccountInPDF": false,
    "showSwiftInPDF": false,
    "notes": "Thank you for your business!",
    "showNotesInPDF": true
  },
  "buyer": {
    "name": "Client Company GmbH",
    "address": "456 Client Avenue, Berlin, Germany, 10115",
    "vatNumber": "DE987654321",
    "email": "accounts@clientcompany.de",
    "countryCode": "DE"
  },
  "items": [
    {
      "id": "item-1",
      "description": "Web Development Services",
      "quantity": 1,
      "unitPrice": 2500.00,
      "vatRate": 20
    },
    {
      "id": "item-2",
      "description": "UI/UX Design",
      "quantity": 1,
      "unitPrice": 1500.00,
      "vatRate": 20
    },
    {
      "id": "item-3",
      "description": "Project Management",
      "quantity": 10,
      "unitPrice": 100.00,
      "vatRate": 20
    }
  ],
  "payment": {
    "method": "Bank Transfer",
    "dueDate": "2024-02-15",
    "terms": "Net 30 days",
    "showMethodInPDF": true,
    "showDueDateInPDF": true,
    "showTermsInPDF": true
  },
  "notes": {
    "content": "Please include invoice number as payment reference. Late payments may incur additional charges.",
    "showInPDF": true
  },
  "signature": {
    "showInPDF": true,
    "name": "John Smith",
    "title": "Managing Director"
  },
  "template": "default"
}
```
```

#### Response

**Default Response (200 OK) - PDF Document**
When `includeJsonData` is not set or set to `false`, the API returns the PDF document directly:

- **Content-Type:** `application/pdf`
- **Content-Disposition:** `attachment; filename="invoice-{prefix}{number}.pdf"`
- **Body:** Raw PDF binary data

**HTML Response (200 OK) - When ?html=true**
When the `html=true` URL parameter is added, the API returns the HTML document:

- **Content-Type:** `text/html`
- **Content-Disposition:** `attachment; filename="invoice-{prefix}{number}.html"`
- **Body:** Raw HTML content (can be converted to PDF on client side)

**JSON Response (200 OK) - When includeJsonData=true**
When `includeJsonData` is set to `true`, the API returns a JSON response with all data:

```json
{
  "success": true,
  "data": {
    "invoiceNumber": "INV-2024-001",
    "totals": {
      "subtotal": 5000,
      "vat": 1000,
      "total": 6000
    },
    "htmlPreview": "<!DOCTYPE html>...",
    "pdfBase64": "JVBERi0xLjQKJcOkw7zDtsO...",
    "pdfSize": 45678,
    "pdfHtml": "<!DOCTYPE html>...",
    "pdfHtmlBase64": "PCFET0NUWVBFIGh0bWw+...",
    "pdfHtmlSize": 45678,
    "id": "507f1f77bcf86cd799439011",
    "databaseId": "507f1f77bcf86cd799439011",
    "message": "Invoice generated successfully"
  }
}
```

**Error Response (400 Bad Request)**

```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    "Invoice number is required",
    "Seller name is required",
    "At least one invoice item is required"
  ]
}
```

**Error Response (500 Internal Server Error)**

```json
{
  "success": false,
  "error": "Failed to generate invoice",
  "details": "PDF generation failed"
}
```

### GET /api/generate-invoice

Retrieves recent invoices from the database.

#### Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "general": { ... },
      "seller": { ... },
      "buyer": { ... },
      "items": [ ... ],
      "totals": { ... },
      "htmlPreview": "...",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

## Supported Languages

| Language | Code | Example |
|----------|------|---------|
| English | `en` | Invoice |
| German | `de` | Rechnung |
| French | `fr` | Facture |
| Spanish | `es` | Factura |
| Italian | `it` | Fattura |
| Dutch | `nl` | Factuur |
| Portuguese | `pt` | Fatura |
| Polish | `pl` | Faktura |
| Swedish | `sv` | Faktura |
| Danish | `da` | Faktura |
| Finnish | `fi` | Lasku |
| Norwegian | `no` | Faktura |

## Supported Currencies

The API supports 150+ currencies including:

- **EUR** (€) - Euro
- **USD** ($) - US Dollar
- **GBP** (£) - British Pound
- **CHF** (CHF) - Swiss Franc
- **SEK** (SEK) - Swedish Krona
- **NOK** (NOK) - Norwegian Krone
- **DKK** (DKK) - Danish Krone
- **PLN** (zł) - Polish Złoty
- **CZK** (Kč) - Czech Koruna
- **HUF** (Ft) - Hungarian Forint
- **RON** (Lei) - Romanian Leu
- **BGN** (лв) - Bulgarian Lev
- **HRK** (kn) - Croatian Kuna
- **RSD** (дин) - Serbian Dinar

## Usage Examples

### cURL Examples

#### Default PDF Response

```bash
curl -X POST https://your-domain.com/api/generate-invoice \
  -H "Content-Type: application/json" \
  -d '{
    "general": {
      "invoiceNumberPrefix": "INV-",
      "invoiceNumberValue": "2024-001",
      "issueDate": "2024-01-15",
      "dueDate": "2024-02-15",
      "serviceDate": "2024-01-10",
      "currency": "EUR",
      "language": "en",
      "template": "default",
      "dateFormat": "YYYY-MM-DD"
    },
    "seller": {
      "name": "My Company",
      "address": "123 Business St, City, Country",
      "vatNumber": "VAT123456789",
      "email": "contact@mycompany.com",
      "accountNumber": "12345678",
      "swiftBic": "BARCGB22",
      "countryCode": "GB",
      "showVatInPDF": true,
      "showAccountInPDF": false,
      "showSwiftInPDF": false,
      "notes": "",
      "showNotesInPDF": false
    },
    "buyer": {
      "name": "Client Company",
      "address": "456 Client Ave, City, Country",
      "vatNumber": "VAT987654321",
      "email": "accounts@client.com",
      "countryCode": "DE"
    },
    "items": [
      {
        "id": "item-1",
        "description": "Consulting Services",
        "quantity": 1,
        "unitPrice": 1000.00,
        "vatRate": 20
      }
    ],
    "payment": {
      "method": "Bank Transfer",
      "dueDate": "2024-02-15",
      "terms": "Net 30 days",
      "showMethodInPDF": true,
      "showDueDateInPDF": true,
      "showTermsInPDF": true
    },
    "notes": {
      "content": "Thank you for your business!",
      "showInPDF": true
    },
    "signature": {
      "showInPDF": true,
      "name": "John Doe",
      "title": "CEO"
    },
    "template": "default"
  }' \
  --output invoice.pdf
```

#### JSON Response with PDF Base64

```bash
curl -X POST https://your-domain.com/api/generate-invoice \
  -H "Content-Type: application/json" \
  -d '{
    "includeJsonData": true,
    "general": {
      "invoiceNumberPrefix": "INV-",
      "invoiceNumberValue": "2024-001",
      "issueDate": "2024-01-15",
      "dueDate": "2024-02-15",
      "serviceDate": "2024-01-10",
      "currency": "EUR",
      "language": "en",
      "template": "default",
      "dateFormat": "YYYY-MM-DD"
    },
    "seller": {
      "name": "My Company",
      "address": "123 Business St, City, Country",
      "vatNumber": "VAT123456789",
      "email": "contact@mycompany.com",
      "accountNumber": "12345678",
      "swiftBic": "BARCGB22",
      "countryCode": "GB",
      "showVatInPDF": true,
      "showAccountInPDF": false,
      "showSwiftInPDF": false,
      "notes": "",
      "showNotesInPDF": false
    },
    "buyer": {
      "name": "Client Company",
      "address": "456 Client Ave, City, Country",
      "vatNumber": "VAT987654321",
      "email": "accounts@client.com",
      "countryCode": "DE"
    },
    "items": [
      {
        "id": "item-1",
        "description": "Consulting Services",
        "quantity": 1,
        "unitPrice": 1000.00,
        "vatRate": 20
      }
    ],
    "payment": {
      "method": "Bank Transfer",
      "dueDate": "2024-02-15",
      "terms": "Net 30 days",
      "showMethodInPDF": true,
      "showDueDateInPDF": true,
      "showTermsInPDF": true
    },
    "notes": {
      "content": "Thank you for your business!",
      "showInPDF": true
    },
    "signature": {
      "showInPDF": true,
      "name": "John Doe",
      "title": "CEO"
    },
    "template": "default"
  }'
```

### JavaScript/Node.js Examples

#### Default HTML Response

```javascript
const response = await fetch('https://your-domain.com/api/generate-invoice', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    general: {
      invoiceNumberPrefix: "INV-",
      invoiceNumberValue: "2024-001",
      issueDate: "2024-01-15",
      dueDate: "2024-02-15",
      serviceDate: "2024-01-10",
      currency: "EUR",
      language: "en",
      template: "default",
      dateFormat: "YYYY-MM-DD"
    },
    seller: {
      name: "My Company",
      address: "123 Business St, City, Country",
      vatNumber: "VAT123456789",
      email: "contact@mycompany.com",
      accountNumber: "12345678",
      swiftBic: "BARCGB22",
      countryCode: "GB",
      showVatInPDF: true,
      showAccountInPDF: false,
      showSwiftInPDF: false,
      notes: "",
      showNotesInPDF: false
    },
    buyer: {
      name: "Client Company",
      address: "456 Client Ave, City, Country",
      vatNumber: "VAT987654321",
      email: "accounts@client.com",
      countryCode: "DE"
    },
    items: [
      {
        id: "item-1",
        description: "Consulting Services",
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
      content: "Thank you for your business!",
      showInPDF: true
    },
    signature: {
      showInPDF: true,
      name: "John Doe",
      title: "CEO"
    },
    template: "default"
  })
});

// Response is HTML content
const htmlContent = await response.text();

// Save as HTML file
const blob = new Blob([htmlContent], { type: 'text/html' });
const url = URL.createObjectURL(blob);

// Download the HTML
const link = document.createElement('a');
link.href = url;
link.download = 'invoice-INV-2024-001.html';
link.click();
URL.revokeObjectURL(url);

// Or convert to PDF using client-side library
// Example using html2pdf.js
import html2pdf from 'html2pdf.js';
const element = document.createElement('div');
element.innerHTML = htmlContent;
document.body.appendChild(element);
html2pdf().from(element).save('invoice-INV-2024-001.pdf');
```

#### JSON Response with HTML Content

```javascript
const response = await fetch('https://your-domain.com/api/generate-invoice', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    includeJsonData: true,
    general: {
      invoiceNumberPrefix: "INV-",
      invoiceNumberValue: "2024-001",
      issueDate: "2024-01-15",
      dueDate: "2024-02-15",
      serviceDate: "2024-01-10",
      currency: "EUR",
      language: "en",
      template: "default",
      dateFormat: "YYYY-MM-DD"
    },
    seller: {
      name: "My Company",
      address: "123 Business St, City, Country",
      vatNumber: "VAT123456789",
      email: "contact@mycompany.com",
      accountNumber: "12345678",
      swiftBic: "BARCGB22",
      countryCode: "GB",
      showVatInPDF: true,
      showAccountInPDF: false,
      showSwiftInPDF: false,
      notes: "",
      showNotesInPDF: false
    },
    buyer: {
      name: "Client Company",
      address: "456 Client Ave, City, Country",
      vatNumber: "VAT987654321",
      email: "accounts@client.com",
      countryCode: "DE"
    },
    items: [
      {
        id: "item-1",
        description: "Consulting Services",
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
      content: "Thank you for your business!",
      showInPDF: true
    },
    signature: {
      showInPDF: true,
      name: "John Doe",
      title: "CEO"
    },
    template: "default"
  })
});

const result = await response.json();
console.log(result);

// Use HTML content for PDF conversion
if (result.success && result.data.pdfHtml) {
  // Save as HTML file
  const htmlBlob = new Blob([result.data.pdfHtml], { type: 'text/html' });
  const url = URL.createObjectURL(htmlBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoice-${result.data.invoiceNumber}.html`;
  link.click();
  URL.revokeObjectURL(url);
  
  // Or convert to PDF using client-side library
  // Example using html2pdf.js
  import html2pdf from 'html2pdf.js';
  const element = document.createElement('div');
  element.innerHTML = result.data.pdfHtml;
  document.body.appendChild(element);
  html2pdf().from(element).save(`invoice-${result.data.invoiceNumber}.pdf`);
}
```

### Python Example

```python
import requests
import json

url = "https://your-domain.com/api/generate-invoice"
payload = {
    "general": {
        "invoiceNumberPrefix": "INV-",
        "invoiceNumberValue": "2024-001",
        "issueDate": "2024-01-15",
        "dueDate": "2024-02-15",
        "serviceDate": "2024-01-10",
        "currency": "EUR",
        "language": "en",
        "template": "default",
        "dateFormat": "YYYY-MM-DD"
    },
    "seller": {
        "name": "My Company",
        "address": "123 Business St, City, Country",
        "vatNumber": "VAT123456789",
        "email": "contact@mycompany.com",
        "accountNumber": "12345678",
        "swiftBic": "BARCGB22",
        "countryCode": "GB",
        "showVatInPDF": True,
        "showAccountInPDF": False,
        "showSwiftInPDF": False,
        "notes": "",
        "showNotesInPDF": False
    },
    "buyer": {
        "name": "Client Company",
        "address": "456 Client Ave, City, Country",
        "vatNumber": "VAT987654321",
        "email": "accounts@client.com",
        "countryCode": "DE"
    },
    "items": [
        {
            "id": "item-1",
            "description": "Consulting Services",
            "quantity": 1,
            "unitPrice": 1000.00,
            "vatRate": 20
        }
    ],
    "payment": {
        "method": "Bank Transfer",
        "dueDate": "2024-02-15",
        "terms": "Net 30 days",
        "showMethodInPDF": True,
        "showDueDateInPDF": True,
        "showTermsInPDF": True
    },
    "notes": {
        "content": "Thank you for your business!",
        "showInPDF": True
    },
    "signature": {
        "showInPDF": True,
        "name": "John Doe",
        "title": "CEO"
    },
    "template": "default"
}

response = requests.post(url, json=payload)
result = response.json()
print(json.dumps(result, indent=2))
```

## Working with the Response

### Default PDF Response

When `includeJsonData` is not set or is `false`, the API returns the PDF document directly. You can:

- Save the response directly as a PDF file
- Stream it to the client for download
- Process it as binary data

### HTML Response

When `includeJsonData` is not set or is `false` AND `?html=true` is added to the URL, the API returns the HTML document. You can:

- Save the response directly as an HTML file
- Convert it to PDF using client-side libraries (like jsPDF, html2pdf.js)
- Display it in a web browser
- Process it as text content

### JSON Response with PDF and HTML Content

When `includeJsonData` is set to `true`, the API returns a JSON response containing:

#### HTML Preview

The `htmlPreview` field contains a complete HTML document that can be:
- Displayed in a web browser
- Embedded in an iframe
- Converted to other formats

#### PDF Base64

The `pdfBase64` field contains the PDF as a base64-encoded string. To use it:

```javascript
// Convert base64 to PDF
const pdfBuffer = Buffer.from(result.data.pdfBase64, 'base64');
fs.writeFileSync('invoice.pdf', pdfBuffer);

// Or create a blob for download
const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'invoice.pdf';
a.click();
```

#### PDF HTML

The `pdfHtml` field contains the HTML content optimized for PDF conversion. To use it:

```javascript
// Convert base64 to blob
const pdfBlob = new Blob(
  [Uint8Array.from(atob(result.data.pdfBase64), c => c.charCodeAt(0))],
  { type: 'application/pdf' }
);

// Create download link
const url = URL.createObjectURL(pdfBlob);
const link = document.createElement('a');
link.href = url;
link.download = `invoice-${result.data.invoiceNumber}.pdf`;
link.click();
URL.revokeObjectURL(url);
```

### Totals

The `totals` object contains calculated values:
- `subtotal`: Sum of all items before VAT
- `vat`: Total VAT amount
- `total`: Final total including VAT

## Error Handling

Always check the `success` field in the response:

```javascript
if (response.success) {
  // Handle successful response
  const invoice = response.data;
  console.log('Invoice generated:', invoice.invoiceNumber);
} else {
  // Handle error
  console.error('Error:', response.error);
  if (response.errors) {
    response.errors.forEach(error => console.error('-', error));
  }
}
```

## Rate Limiting

The API includes rate limiting to prevent abuse. If you exceed the limit, you'll receive a 429 status code.

## Authentication

Currently, the API is public. For production use, consider adding authentication headers or API keys.

## Support

For API support and questions:
- Create an issue on GitHub
- Check the project documentation
- Review the validation errors for debugging
