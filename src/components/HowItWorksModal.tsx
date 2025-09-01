'use client';

import React from 'react';
import { X, Code, FileText, Download, Share2, Globe, Zap } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">How It Works</h2>
              <p className="text-sm text-gray-500">Learn how to use InvoicePDF</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Overview */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Overview
            </h3>
            <p className="text-gray-600 mb-4">
              InvoicePDF is a powerful invoice generator that creates professional PDF invoices in seconds. 
              It supports multiple currencies, European VAT compliance, and beautiful templates.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Real-time Preview</h4>
                <p className="text-sm text-gray-600">See changes instantly as you type with live HTML preview</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mb-3">
                  <Download className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">PDF Export</h4>
                <p className="text-sm text-gray-600">Download professional PDF invoices with one click</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mb-3">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Multi-language</h4>
                <p className="text-sm text-gray-600">Support for 12 languages and 150+ currencies</p>
              </div>
            </div>
          </section>

          {/* Step by Step */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Step by Step Guide</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Fill in Invoice Details</h4>
                  <p className="text-gray-600 text-sm">Enter seller and buyer information, add invoice items, and configure payment terms.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Preview Your Invoice</h4>
                  <p className="text-gray-600 text-sm">Review the real-time HTML preview to ensure everything looks correct.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Generate PDF</h4>
                  <p className="text-gray-600 text-sm">Click "Generate PDF" to download your professional invoice as a PDF file.</p>
                </div>
              </div>
            </div>
          </section>

          {/* REST API */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Code className="h-5 w-5 text-green-600" />
              REST API
            </h3>
            <p className="text-gray-600 mb-4">
              Integrate InvoicePDF into your applications using our REST API. Generate invoices programmatically 
              and receive PDF files directly.
            </p>

            {/* API Endpoints */}
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">POST</span>
                    <code className="text-sm font-mono text-gray-700">/api/generate-invoice</code>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Generate Invoice PDF</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Send invoice data and receive a PDF file in response.
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Request Body:</h5>
                      <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto text-gray-800">
{`{
  "general": {
    "invoiceNumber": "INV-2024-001",
    "issueDate": "2024-01-15",
    "dueDate": "2024-02-15",
    "currency": "EUR",
    "language": "en",
    "template": "stripe"
  },
  "seller": {
    "name": "Your Company",
    "address": "123 Business St",
    "email": "contact@company.com",
    "vatNumber": "VAT123456789"
  },
  "buyer": {
    "name": "Client Company",
    "address": "456 Client Ave",
    "email": "client@company.com"
  },
  "items": [
    {
      "description": "Web Development",
      "quantity": 1,
      "unitPrice": 1500,
      "vatRate": 20
    }
  ]
}`}
                      </pre>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Response:</h5>
                      <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto text-gray-800">
{`{
  "success": true,
  "pdfUrl": "https://example.com/invoice.pdf",
  "invoiceNumber": "INV-2024-001",
  "total": 1800.00
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">GET</span>
                    <code className="text-sm font-mono text-gray-700">/api/invoices/{'{id}'}</code>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Get Invoice Details</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Retrieve invoice information by ID.
                  </p>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Response:</h5>
                    <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto text-gray-800">
{`{
  "id": "invoice_123",
  "invoiceNumber": "INV-2024-001",
  "status": "paid",
  "total": 1800.00,
  "createdAt": "2024-01-15T10:30:00Z",
  "pdfUrl": "https://example.com/invoice.pdf"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* API Usage Examples */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Usage Examples</h4>
              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">JavaScript/Node.js:</h5>
                  <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto text-gray-800">
{`const response = await fetch('/api/generate-invoice', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(invoiceData)
});

const result = await response.json();
console.log('PDF URL:', result.pdfUrl);`}
                  </pre>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">cURL:</h5>
                  <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto text-gray-800">
{`curl -X POST https://your-domain.com/api/generate-invoice \\
  -H "Content-Type: application/json" \\
  -d '{
    "general": {
      "invoiceNumber": "INV-2024-001",
      "currency": "EUR"
    },
    "seller": {
      "name": "Your Company"
    },
    "buyer": {
      "name": "Client Company"
    },
    "items": [
      {
        "description": "Service",
        "quantity": 1,
        "unitPrice": 100,
        "vatRate": 20
      }
    ]
  }'`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">VAT Calculations</h4>
                    <p className="text-sm text-gray-600">Automatic tax calculations with configurable rates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Multiple Templates</h4>
                    <p className="text-sm text-gray-600">Choose from default and Stripe-inspired designs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Company Branding</h4>
                    <p className="text-sm text-gray-600">Upload logos and customize styling</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Payment Links</h4>
                    <p className="text-sm text-gray-600">Add payment URLs for online transactions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Digital Signatures</h4>
                    <p className="text-sm text-gray-600">Add professional signatures to invoices</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">REST API</h4>
                    <p className="text-sm text-gray-600">Programmatic access for integrations</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              Need help? Check out our <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">documentation</a> or <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">contact support</a>.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
