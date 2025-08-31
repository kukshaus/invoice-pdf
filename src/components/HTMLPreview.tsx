'use client';

import React, { useState } from 'react';
import { PDFComponents } from './PDFComponents';
import { Eye, Download, Share2 } from 'lucide-react';
import { ClientOnly } from './ClientOnly';
import { pdf } from '@react-pdf/renderer';
import { InvoicePDF } from './InvoicePDF';
import { getTranslation, formatDateLocalized } from '@/lib/translations';

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

interface HTMLPreviewProps {
  data: InvoiceData;
  isFormValid: boolean;
}

const formatDate = (date: string | Date, language: string = 'en'): string => {
  return formatDateLocalized(date, language);
};

const formatCurrency = (amount: number, currency: string) => {
  const currencySymbols: { [key: string]: string } = {
    'EUR': '€',
    'USD': '$',
    'GBP': '£',
    'CHF': 'CHF',
    'SEK': 'SEK',
    'NOK': 'NOK',
    'DKK': 'DKK',
    'PLN': 'zł',
    'CZK': 'Kč',
    'HUF': 'Ft',
    'RON': 'Lei',
    'BGN': 'лв',
    'HRK': 'kn',
    'RSD': 'дин',
    'ALL': 'L',
    'MKD': 'ден',
    'BAM': 'KM',
    'MNT': '₮',
    'GEL': '₾',
    'AMD': 'դր',
    'AZN': '₼',
    'BYN': 'Br',
    'MDL': 'L',
    'UAH': '₴',
    'RUB': '₽',
    'KZT': '₸',
    'UZS': '',
    'KGS': 'с',
    'TJS': 'ЅМ',
    'TMT': 'T',
    'TRY': '₺',
    'ILS': '₪',
    'EGP': '£',
    'MAD': 'د.م',
    'TND': 'د.ت',
    'LYD': 'ل.د',
    'DZD': 'د.ج',
    'XOF': 'CFA',
    'XAF': 'CFA',
    'CDF': 'FC',
    'KES': 'KSh',
    'NGN': '₦',
    'GHS': '₵',
    'ZAR': 'R',
    'BWP': 'P',
    'NAD': 'N',
    'ZMW': 'K',
    'MWK': 'MK',
    'TZS': 'TSh',
    'UGX': 'USh',
    'ETB': 'Br',
    'SOS': 'S',
    'DJF': 'Fdj',
    'KMF': 'CF',
    'MUR': '₨',
    'SCR': '₨',
    'MVR': 'MVR',
    'LKR': '₨',
    'BDT': '৳',
    'NPR': '₨',
    'PKR': '₨',
    'INR': '₹',
    'MMK': 'K',
    'THB': '฿',
    'LAK': '₭',
    'KHR': '៛',
    'VND': '₫',
    'PHP': '₱',
    'MYR': 'RM',
    'SGD': 'S$',
    'IDR': 'Rp',
    'BND': 'B$',
    'JPY': '¥',
    'KRW': '₩',
    'CNY': '¥',
    'HKD': 'HK$',
    'TWD': 'NT$',
    'MOP': 'MOP$',
    'AUD': 'A$',
    'NZD': 'NZ$',
    'FJD': 'FJ$',
    'PGK': 'K',
    'SBD': 'SI$',
    'VUV': 'VT',
    'WST': 'WS$',
    'TOP': 'T$',
    'CAD': 'C$',
    'MXN': '$',
    'BRL': 'R$',
    'ARS': '$',
    'CLP': '$',
    'COP': '$',
    'PEN': 'S/',
    'BOB': 'Bs',
    'PYG': '₲',
    'UYU': '$',
    'VES': 'Bs',
    'GYD': 'GY$',
    'SRD': '$',
    'BBD': 'Bds$',
    'TTD': 'TT$',
    'JMD': 'J$',
    'HTG': 'G',
    'DOP': 'RD$',
    'CUC': '$',
    'CUP': '$',
    'BSD': 'B$',
    'KYD': 'CI$',
    'ANG': 'ƒ',
    'AWG': 'ƒ',
    'XCD': 'EC$',
    'ECU': 'Ecu',
    'PAB': 'B/.',
    'CRC': '₡',
    'NIO': 'C$',
    'HNL': 'L',
    'GTQ': 'Q',
    'BZD': 'BZ$',
    'SVC': '₡',
    'QAR': 'ر.ق',
    'AED': 'د.إ',
    'SAR': 'ر.س',
    'OMR': 'ر.ع',
    'YER': '﷼',
    'KWD': 'د.ك',
    'BHD': '.د.ب',
    'IQD': 'ع.د',
    'JOD': 'د.ا',
    'LBP': 'ل.ل',
    'SYP': '£',
    'IRR': '﷼',
    'AFN': '؋'
  };
  
  const symbol = currencySymbols[currency] || currency;
  return `${symbol}${amount.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
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

export const HTMLPreview: React.FC<HTMLPreviewProps> = ({ data, isFormValid }) => {
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const subtotal = calculateSubtotal(data.items);
  const vat = calculateVAT(data.items);
  const total = calculateTotal(data.items);

  const handleDownloadPDF = async () => {
    if (!isFormValid) return;
    
    setIsDownloading(true);
    try {
      const blob = await pdf(<InvoicePDF data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${data.general.invoiceNumberValue}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
         <ClientOnly fallback={
       <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
         <div className="text-center">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
           <p className="text-gray-500">{getTranslation(data.general.language, 'loadingPreview')}</p>
         </div>
       </div>
     }>
      {isFormValid ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Action Buttons */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                                 <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                   <Share2 className="h-4 w-4" />
                   <span>{getTranslation(data.general.language, 'shareLink')}</span>
                 </button>
                 <button 
                   onClick={() => setShowPDFModal(true)}
                   className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                 >
                   <Eye className="h-4 w-4" />
                   <span>{getTranslation(data.general.language, 'viewPDF')}</span>
                 </button>
                 <button 
                   onClick={handleDownloadPDF}
                   disabled={isDownloading}
                   className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                 >
                   <Download className="h-4 w-4" />
                   <span>{isDownloading ? getTranslation(data.general.language, 'generating') : getTranslation(data.general.language, 'downloadPDF')}</span>
                 </button>
              </div>
            </div>
          </div>

          {/* HTML Invoice Preview */}
          <div className="p-8 max-h-[calc(100vh-12rem)] overflow-y-auto">
            <div className="max-w-4xl mx-auto bg-white">
              {/* Header */}
                             <div className="flex justify-between items-start mb-8">
                 <div>
                   <h1 className="text-3xl font-bold text-gray-900 mb-2">{getTranslation(data.general.language, 'invoice')}</h1>
                   <p className="text-sm text-gray-600">{data.general.invoiceNumberPrefix} {data.general.invoiceNumberValue}</p>
                 </div>
                <div className="text-right">
                  {data.general.companyLogo && (
                    <img 
                      src={data.general.companyLogo} 
                      alt="Company Logo" 
                      className="w-16 h-16 object-contain mb-3 mx-auto"
                    />
                  )}
                  <h2 className="text-lg font-bold text-gray-900">{data.seller.name}</h2>
                </div>
              </div>

              {/* Invoice Details and Bill To/Ship To */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">{data.seller.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{data.seller.address}</p>
                  <p className="text-sm text-gray-600 mb-1">{data.seller.email}</p>
                  <p className="text-sm text-gray-600 mb-1">+44 20 456 7890</p>
                  {data.seller.showVatInPDF && (
                    <p className="text-sm text-gray-600 font-bold">GB VAT {data.seller.vatNumber}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="space-y-4">
                    {/* Invoice Details */}
                                         <div className="space-y-2">
                       <div>
                         <p className="text-xs font-bold text-gray-600 uppercase">{getTranslation(data.general.language, 'dateOfIssue')}</p>
                         <p className="text-sm text-gray-900">{formatDate(data.general.issueDate, data.general.language)}</p>
                       </div>
                       <div>
                         <p className="text-xs font-bold text-gray-600 uppercase">{getTranslation(data.general.language, 'dateDue')}</p>
                         <p className="text-sm text-gray-900">{formatDate(data.general.dueDate, data.general.language)}</p>
                       </div>
                       <div>
                         <p className="text-xs font-bold text-gray-600 uppercase">{getTranslation(data.general.language, 'currency')}</p>
                         <p className="text-sm text-gray-900">{data.general.currency}</p>
                       </div>
                     </div>
                    
                    {/* Bill To and Ship To */}
                                         <div className="grid grid-cols-2 gap-4 mt-4">
                       <div>
                         <h3 className="text-xs font-bold text-gray-600 uppercase mb-2">{getTranslation(data.general.language, 'billTo')}</h3>
                         <div className="bg-gray-50 p-3 rounded-lg">
                           <h4 className="text-xs font-bold text-gray-900 mb-1">{data.buyer.name}</h4>
                           <p className="text-xs text-gray-600 mb-1">{data.buyer.address}</p>
                           <p className="text-xs text-gray-600 mb-1">{data.buyer.email}</p>
                           <p className="text-xs text-gray-600 font-bold">GB VAT {data.buyer.vatNumber}</p>
                         </div>
                       </div>
                       <div>
                         <h3 className="text-xs font-bold text-gray-600 uppercase mb-2">{getTranslation(data.general.language, 'shipTo')}</h3>
                         <div className="bg-gray-50 p-3 rounded-lg">
                           <h4 className="text-xs font-bold text-gray-900 mb-1">{data.buyer.name}</h4>
                           <p className="text-xs text-gray-600">{data.buyer.address}</p>
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
                       <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase">{getTranslation(data.general.language, 'description')}</th>
                       <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase">{getTranslation(data.general.language, 'quantity')}</th>
                       <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase">{getTranslation(data.general.language, 'unitPrice')}</th>
                       <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase">{getTranslation(data.general.language, 'tax')}</th>
                       <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase">{getTranslation(data.general.language, 'amount')}</th>
                     </tr>
                   </thead>
                  <tbody>
                    {data.items.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-900">{item.description || `Item ${index + 1}`}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 text-right">{item.quantity}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 text-right">
                          {formatCurrency(item.unitPrice, data.general.currency)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 text-right">{item.vatRate}%</td>
                        <td className="py-3 px-4 text-sm font-bold text-gray-900 text-right">
                          {formatCurrency(item.quantity * item.unitPrice, data.general.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                                 <div className="w-64">
                   <div className="flex justify-between py-2">
                     <span className="text-sm text-gray-600">{getTranslation(data.general.language, 'subtotal')}</span>
                     <span className="text-sm font-bold text-gray-900">{formatCurrency(subtotal, data.general.currency)}</span>
                   </div>
                   <div className="flex justify-between py-2">
                     <span className="text-sm text-gray-600">{getTranslation(data.general.language, 'vat')} - {data.buyer.countryCode} ({data.items[0]?.vatRate || 20}%)</span>
                     <span className="text-sm font-bold text-gray-900">{formatCurrency(vat, data.general.currency)}</span>
                   </div>
                   <div className="flex justify-between py-3 border-t border-gray-200">
                     <span className="text-lg font-bold text-gray-900">{getTranslation(data.general.language, 'total')}</span>
                     <span className="text-lg font-bold text-gray-900">{formatCurrency(total, data.general.currency)}</span>
                   </div>
                 </div>
              </div>

              {/* Payment Information */}
                             {(data.payment?.showMethodInPDF || data.payment?.showDueDateInPDF || data.payment?.showTermsInPDF) && (
                 <div className="mb-8">
                   <h3 className="text-sm font-bold text-gray-900 uppercase mb-3">{getTranslation(data.general.language, 'paymentInformation')}</h3>
                   <div className="bg-gray-50 p-4 rounded-lg">
                     {data.payment?.showMethodInPDF && (
                       <div className="flex justify-between mb-2">
                         <span className="text-sm text-gray-600">{getTranslation(data.general.language, 'paymentMethod')}:</span>
                         <span className="text-sm font-bold text-gray-900">{data.payment.method}</span>
                       </div>
                     )}
                     {data.payment?.showDueDateInPDF && (
                       <div className="flex justify-between mb-2">
                         <span className="text-sm text-gray-600">{getTranslation(data.general.language, 'dueDate')}:</span>
                         <span className="text-sm font-bold text-gray-900">{formatDate(data.payment.dueDate, data.general.language)}</span>
                       </div>
                     )}
                     {data.payment?.showTermsInPDF && (
                       <div className="flex justify-between">
                         <span className="text-sm text-gray-600">{getTranslation(data.general.language, 'paymentTerms')}:</span>
                         <span className="text-sm font-bold text-gray-900">{data.payment.terms}</span>
                       </div>
                     )}
                   </div>
                 </div>
               )}

              {/* Notes */}
                             {data.notes?.showInPDF && data.notes.content && (
                 <div className="mb-8">
                   <h3 className="text-sm font-bold text-gray-900 uppercase mb-3">{getTranslation(data.general.language, 'notes')}</h3>
                   <div className="bg-gray-50 p-4 rounded-lg">
                     <p className="text-sm text-gray-900">{data.notes.content}</p>
                   </div>
                 </div>
               )}

               {/* Signature */}
               {data.signature?.showInPDF && (
                 <div className="flex justify-end">
                   <div className="text-center">
                     <div className="w-32 h-px bg-gray-300 mb-2"></div>
                     <p className="text-sm font-bold text-gray-900">{data.signature.name}</p>
                     <p className="text-xs text-gray-600">{data.signature.title}</p>
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>
             ) : (
         <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
           <div className="text-center">
             <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
               <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
             </div>
             <p className="text-gray-500 mb-2">{getTranslation(data.general.language, 'completeFormToSeePreview')}</p>
             <p className="text-xs text-gray-400">{getTranslation(data.general.language, 'fillRequiredFields')}</p>
           </div>
         </div>
       )}

      {/* PDF Modal */}
      {showPDFModal && (
        <PDFComponents 
          data={data} 
          showPreview={true} 
          onClosePreview={() => setShowPDFModal(false)} 
        />
      )}
    </ClientOnly>
  );
};
