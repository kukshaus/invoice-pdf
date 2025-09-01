'use client';

import React, { useState } from 'react';
import { Eye, Download, Lock } from 'lucide-react';
import { PDFComponents } from '@/components/PDFComponents';
import { getTranslation } from '@/lib/translations';

interface SharedInvoiceViewProps {
  invoice: any;
  linkId: string;
}

export default function SharedInvoiceView({ invoice, linkId }: SharedInvoiceViewProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!invoice.shareableLink.password);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');

    try {
      const response = await fetch('/api/invoices/verify-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId, password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
      } else {
        setError('Invalid password');
      }
    } catch (error) {
      setError('Failed to verify password');
    } finally {
      setIsVerifying(false);
    }
  };

  // Convert invoice data to the format expected by components
  const invoiceData = {
    general: {
      companyName: invoice.seller.name,
      companyAddress: invoice.seller.address,
      companyPhone: invoice.seller.phone,
      companyEmail: invoice.seller.email,
      companyVatNumber: invoice.seller.vatNumber,
      invoiceNumberPrefix: invoice.invoiceNumber.split(/\d/)[0] || '',
      invoiceNumberValue: invoice.invoiceNumber.match(/\d+/)?.[0] || invoice.invoiceNumber,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      currency: invoice.currency,
      language: invoice.language,
    },
    client: {
      name: invoice.buyer.name,
      address: invoice.buyer.address,
      phone: invoice.buyer.phone,
      email: invoice.buyer.email,
      vatNumber: invoice.buyer.vatNumber,
    },
    items: invoice.items,
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Protected Invoice</h1>
            <p className="text-gray-600">This invoice is password protected. Please enter the password to view it.</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              {isVerifying ? 'Verifying...' : 'Access Invoice'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Shared Invoice</h1>
              <span className="text-sm text-gray-500">
                Invoice #{invoiceData.general.invoiceNumberPrefix}{invoiceData.general.invoiceNumberValue}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowPDFModal(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>View PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Invoice Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {getTranslation(invoiceData.general.language, 'invoice')}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {invoiceData.general.invoiceNumberPrefix} {invoiceData.general.invoiceNumberValue}
                  </p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-semibold text-gray-900">{invoiceData.general.companyName}</h2>
                </div>
              </div>

              {/* Company Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{invoiceData.general.companyName}</h3>
                  <div className="text-gray-600 space-y-1">
                    <p>{invoiceData.general.companyAddress}</p>
                    <p>{invoiceData.general.companyEmail}</p>
                    <p>{invoiceData.general.companyPhone}</p>
                    {invoiceData.general.companyVatNumber && (
                      <p>VAT: {invoiceData.general.companyVatNumber}</p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">BILL TO</h4>
                      <div className="text-gray-600 space-y-1">
                        <p className="font-medium">{invoiceData.client.name}</p>
                        <p>{invoiceData.client.address}</p>
                        <p>{invoiceData.client.email}</p>
                        {invoiceData.client.vatNumber && (
                          <p>VAT: {invoiceData.client.vatNumber}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">DATE OF ISSUE</p>
                          <p className="font-medium">{new Date(invoiceData.general.issueDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">DATE DUE</p>
                          <p className="font-medium">{new Date(invoiceData.general.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">CURRENCY</p>
                          <p className="font-medium">{invoiceData.general.currency}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="text-right py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="text-right py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="text-right py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Tax
                      </th>
                      <th className="text-right py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoiceData.items.map((item: any, index: number) => {
                      const amount = item.quantity * item.unitPrice;
                      return (
                        <tr key={index}>
                          <td className="py-4 text-sm text-gray-900">{item.description}</td>
                          <td className="py-4 text-sm text-gray-900 text-right">{item.quantity}</td>
                          <td className="py-4 text-sm text-gray-900 text-right">
                            {invoiceData.general.currency === 'EUR' ? '€' : '$'}{item.unitPrice.toFixed(2)}
                          </td>
                          <td className="py-4 text-sm text-gray-900 text-right">{item.vatRate}%</td>
                          <td className="py-4 text-sm text-gray-900 text-right font-medium">
                            {invoiceData.general.currency === 'EUR' ? '€' : '$'}{amount.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-72">
                  {(() => {
                    const subtotal = invoiceData.items.reduce((sum: number, item: any) => 
                      sum + (item.quantity * item.unitPrice), 0
                    );
                    const totalTax = invoiceData.items.reduce((sum: number, item: any) => 
                      sum + (item.quantity * item.unitPrice * item.vatRate / 100), 0
                    );
                    const total = subtotal + totalTax;
                    const currencySymbol = invoiceData.general.currency === 'EUR' ? '€' : '$';

                    return (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">VAT</span>
                          <span className="font-medium">{currencySymbol}{totalTax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                          <span>Total</span>
                          <span>{currencySymbol}{total.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Modal */}
      {showPDFModal && (
        <PDFComponents 
          data={invoiceData} 
          showPreview={true} 
          onClosePreview={() => setShowPDFModal(false)} 
        />
      )}
    </div>
  );
}
