'use client';

import React, { useState } from 'react';
import { HTMLPreview } from '@/components/HTMLPreview';
import { SellerModal } from '@/components/SellerModal';
import { HowItWorksModal } from '@/components/HowItWorksModal';
import { GenerateLinkModal } from '@/components/GenerateLinkModal';
import { formatDate, formatCurrency } from '@/lib/utils';
import { InvoicePDF } from '@/components/InvoicePDF';
import { getTranslation } from '@/lib/translations';
import { ClientOnly } from '@/components/ClientOnly';
import {
  FileText,
  Share2,
  Settings,
  Globe,
  Star,
  Plus,
  Trash2,
  Euro,
  DollarSign,
  PoundSterling,
  Calendar,
  Mail,
  Building,
  CreditCard,
  ChevronDown,
  User,
  Package
} from 'lucide-react';
import { Toggle } from '@/components/Toggle';
import { CollapsibleSection } from '@/components/CollapsibleSection';

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
    dateFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY';
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

export default function Home() {
  const [collapsedSections, setCollapsedSections] = useState<{[key: string]: boolean}>({
    general: false,
    seller: true,
    buyer: true,
    items: false,
    payment: true,
    notes: true,
    signature: true
  });
  const [showSupportPopup, setShowSupportPopup] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Use useEffect to check localStorage after component mounts
  React.useEffect(() => {
    setIsClient(true);
    const dismissedAt = localStorage.getItem('supportPopupDismissed');
    if (dismissedAt) {
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
      if (now - parseInt(dismissedAt) < fiveMinutes) {
        setShowSupportPopup(false);
      } else {
        setShowSupportPopup(true);
      }
    } else {
      setShowSupportPopup(true);
    }
  }, []);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [showGenerateLinkModal, setShowGenerateLinkModal] = useState(false);

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    general: {
      invoiceNumber: 'INV-2024-001',
      invoiceNumberPrefix: 'Invoice No. of:',
      invoiceNumberValue: '1/08-2025',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      serviceDate: new Date().toISOString().split('T')[0],
      currency: 'EUR',
      language: 'en',
      template: 'stripe',
      dateFormat: 'YYYY-MM-DD',
      paymentLinkUrl: '',
      companyLogo: ''
    },
    seller: {
      name: 'Your Company Name',
      address: '123 Business Street, City, Country',
      vatNumber: 'VAT123456789',
      email: 'contact@company.com',
      accountNumber: 'IBAN123456789',
      swiftBic: 'SWIFT123',
      countryCode: 'DE',
      showVatInPDF: true,
      showAccountInPDF: true,
      showSwiftInPDF: true,
      notes: '',
      showNotesInPDF: true
    },
    buyer: {
      name: 'Client Company',
      address: '456 Client Avenue, Client City, Client Country',
      vatNumber: 'VAT987654321',
      email: 'client@company.com',
      countryCode: 'GB'
    },
    items: [
      {
        id: '1',
        description: 'Web Development Services',
        quantity: 1,
        unitPrice: 1500,
        vatRate: 20
      }
    ],
    payment: {
      method: 'Bank Transfer',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      terms: 'Net 30 days',
      showMethodInPDF: true,
      showDueDateInPDF: true,
      showTermsInPDF: true
    },
    notes: {
      content: 'Thank you for your business!',
      showInPDF: true
    },
    signature: {
      showInPDF: true,
      name: 'John Doe',
      title: 'CEO'
    },
    template: 'stripe'
  });

  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, {
        id: Date.now().toString(),
        description: `Item ${prev.items.length + 1}`,
        quantity: 1,
        unitPrice: 100,
        vatRate: 20
      }]
    }));
  };

  const removeItem = (id: string) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      }));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const updateField = (section: keyof InvoiceData, field: string, value: string | boolean) => {
    setInvoiceData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (3MB limit)
      if (file.size > 3 * 1024 * 1024) {
        alert('File size must be less than 3MB');
        return;
      }
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a JPEG, PNG, or WebP file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateField('general', 'companyLogo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const calculateVAT = () => {
    return invoiceData.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      return sum + (itemTotal * item.vatRate / 100);
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT();
  };

  const handleSaveSeller = (sellerData: any) => {
    setInvoiceData(prev => ({
      ...prev,
      seller: sellerData
    }));
  };



  const isFormValid = () => {
    return (
      invoiceData.general.invoiceNumberValue.trim() !== '' &&
      invoiceData.seller.name.trim() !== '' &&
      invoiceData.seller.address.trim() !== '' &&
      invoiceData.buyer.name.trim() !== '' &&
      invoiceData.buyer.address.trim() !== '' &&
      invoiceData.items.length > 0 &&
      invoiceData.items.every(item => 
        item.description.trim() !== '' && 
        item.quantity > 0 && 
        item.unitPrice > 0
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
              {/* Modern Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">InvoicePDF</h1>
                  <p className="text-sm text-gray-500">Free Invoice Generator with Live PDF Preview</p>
                </div>
                                 <div className="hidden md:flex items-center space-x-4 ml-8 text-sm text-gray-600">
                   <button 
                     onClick={() => setShowHowItWorksModal(true)}
                     className="hover:text-blue-600 transition-colors"
                   >
                     How it works
                   </button>
                   <span>|</span>
                   <a href="#" className="hover:text-blue-600 transition-colors">Share your feedback</a>
                 </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <select className="text-sm border-0 bg-transparent text-gray-700 focus:ring-0">
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
                
                <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span className="hidden sm:inline">Support Project</span>
                </button>
                
                <button 
                  onClick={() => setShowGenerateLinkModal(true)}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="hidden sm:inline">Generate Link</span>
                </button>
                
                <button className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Star className="h-4 w-4" />
                  <span className="hidden sm:inline">Star on GitHub</span>
                </button>
              </div>
            </div>
          </div>
        </header>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-6 h-[calc(100vh-7rem)]">
          {/* Left Column - Form (3/12 on large screens) */}
          <div className="lg:col-span-3 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {/* General Information */}
            <CollapsibleSection
              title="General Information"
              icon={<Settings className="h-5 w-5 text-blue-600 mr-2" />}
              isCollapsed={collapsedSections.general}
              onToggle={() => toggleSection('general')}
              className="p-4"
            >
                {/* Invoice Template */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Template</label>
                  <div className="relative">
                    <select
                      value={invoiceData.general.template}
                      onChange={(e) => updateField('general', 'template', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-gray-900"
                    >
                      <option value="default">Default Template</option>
                      <option value="stripe">Stripe Template</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Select the design template for your invoice.</p>
                </div>

                {/* Invoice PDF Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getTranslation(invoiceData.general.language, 'invoicePDFLanguage')}</label>
                  <div className="relative">
                    <select
                      value={invoiceData.general.language}
                      onChange={(e) => updateField('general', 'language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-gray-900"
                    >
                      <option value="en">English</option>
                      <option value="de">Deutsch</option>
                      <option value="fr">Français</option>
                      <option value="es">Español</option>
                      <option value="it">Italiano</option>
                      <option value="nl">Nederlands</option>
                      <option value="pt">Português</option>
                      <option value="pl">Polski</option>
                      <option value="sv">Svenska</option>
                      <option value="da">Dansk</option>
                      <option value="fi">Suomi</option>
                      <option value="no">Norsk</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{getTranslation(invoiceData.general.language, 'selectLanguage')}</p>
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <div className="relative">
                    <select
                      value={invoiceData.general.currency}
                      onChange={(e) => updateField('general', 'currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-gray-900"
                    >
                      <option value="EUR">EUR € Euro</option>
                      <option value="USD">USD $ US Dollar</option>
                      <option value="CHF">CHF Swiss Franc</option>
                      <option value="GBP">GBP £ British Pound</option>
                      <option value="SEK">SEK Swedish Krona</option>
                      <option value="NOK">NOK Norwegian Krone</option>
                      <option value="DKK">DKK Danish Krone</option>
                      <option value="PLN">PLN zł Polish Złoty</option>
                      <option value="CZK">CZK Kč Czech Koruna</option>
                      <option value="HUF">HUF Ft Hungarian Forint</option>
                      <option value="RON">RON Lei Romanian Leu</option>
                      <option value="BGN">BGN лв Bulgarian Lev</option>
                      <option value="HRK">HRK kn Croatian Kuna</option>
                      <option value="RSD">RSD дин Serbian Dinar</option>
                      <option value="ALL">ALL L Albanian Lek</option>
                      <option value="MKD">MKD ден Macedonian Denar</option>
                      <option value="BAM">BAM KM Bosnia-Herzegovina Convertible Mark</option>
                      <option value="MNT">MNT ₮ Mongolian Tugrik</option>
                      <option value="GEL">GEL ₾ Georgian Lari</option>
                      <option value="AMD">AMD դր Armenian Dram</option>
                      <option value="AZN">AZN ₼ Azerbaijani Manat</option>
                      <option value="BYN">BYN Br Belarusian Ruble</option>
                      <option value="MDL">MDL L Moldovan Leu</option>
                      <option value="UAH">UAH ₴ Ukrainian Hryvnia</option>
                      <option value="RUB">RUB ₽ Russian Ruble</option>
                      <option value="KZT">KZT ₸ Kazakhstani Tenge</option>
                      <option value="UZS">UZS Uzbekistani Som</option>
                      <option value="KGS">KGS с Kyrgyzstani Som</option>
                      <option value="TJS">TJS ЅМ Tajikistani Somoni</option>
                      <option value="TMT">TMT T Turkmenistani Manat</option>
                      <option value="TRY">TRY ₺ Turkish Lira</option>
                      <option value="ILS">ILS ₪ Israeli Shekel</option>
                      <option value="EGP">EGP £ Egyptian Pound</option>
                      <option value="MAD">MAD د.م Moroccan Dirham</option>
                      <option value="TND">TND د.ت Tunisian Dinar</option>
                      <option value="LYD">LYD ل.د Libyan Dinar</option>
                      <option value="DZD">DZD د.ج Algerian Dinar</option>
                      <option value="XOF">XOF CFA West African Franc</option>
                      <option value="XAF">XAF CFA Central African Franc</option>
                      <option value="CDF">CDF FC Congolese Franc</option>
                      <option value="KES">KES KSh Kenyan Shilling</option>
                      <option value="NGN">NGN ₦ Nigerian Naira</option>
                      <option value="GHS">GHS ₵ Ghanaian Cedi</option>
                      <option value="ZAR">ZAR R South African Rand</option>
                      <option value="BWP">BWP P Botswana Pula</option>
                      <option value="NAD">NAD N Namibian Dollar</option>
                      <option value="ZMW">ZMW K Zambian Kwacha</option>
                      <option value="MWK">MWK MK Malawian Kwacha</option>
                      <option value="TZS">TZS TSh Tanzanian Shilling</option>
                      <option value="UGX">UGX USh Ugandan Shilling</option>
                      <option value="ETB">ETB Br Ethiopian Birr</option>
                      <option value="SOS">SOS S Somali Shilling</option>
                      <option value="DJF">DJF Fdj Djiboutian Franc</option>
                      <option value="KMF">KMF CF Comorian Franc</option>
                      <option value="MUR">MUR ₨ Mauritian Rupee</option>
                      <option value="SCR">SCR ₨ Seychellois Rupee</option>
                      <option value="MVR">MVR MVR Maldivian Rufiyaa</option>
                      <option value="LKR">LKR ₨ Sri Lankan Rupee</option>
                      <option value="BDT">BDT ৳ Bangladeshi Taka</option>
                      <option value="NPR">NPR ₨ Nepalese Rupee</option>
                      <option value="PKR">PKR ₨ Pakistani Rupee</option>
                      <option value="INR">INR ₹ Indian Rupee</option>
                      <option value="MMK">MMK K Myanmar Kyat</option>
                      <option value="THB">THB ฿ Thai Baht</option>
                      <option value="LAK">LAK ₭ Lao Kip</option>
                      <option value="KHR">KHR ៛ Cambodian Riel</option>
                      <option value="VND">VND ₫ Vietnamese Dong</option>
                      <option value="PHP">PHP ₱ Philippine Peso</option>
                      <option value="MYR">MYR RM Malaysian Ringgit</option>
                      <option value="SGD">SGD S$ Singapore Dollar</option>
                      <option value="IDR">IDR Rp Indonesian Rupiah</option>
                      <option value="BND">BND B$ Brunei Dollar</option>
                      <option value="JPY">JPY ¥ Japanese Yen</option>
                      <option value="KRW">KRW ₩ South Korean Won</option>
                      <option value="CNY">CNY ¥ Chinese Yuan</option>
                      <option value="HKD">HKD HK$ Hong Kong Dollar</option>
                      <option value="TWD">TWD NT$ Taiwan Dollar</option>
                      <option value="MOP">MOP MOP$ Macanese Pataca</option>
                      <option value="AUD">AUD A$ Australian Dollar</option>
                      <option value="NZD">NZD NZ$ New Zealand Dollar</option>
                      <option value="FJD">FJD FJ$ Fijian Dollar</option>
                      <option value="PGK">PGK K Papua New Guinean Kina</option>
                      <option value="SBD">SBD SI$ Solomon Islands Dollar</option>
                      <option value="VUV">VUV VT Vanuatu Vatu</option>
                      <option value="WST">WST WS$ Samoan Tala</option>
                      <option value="TOP">TOP T$ Tongan Pa'anga</option>
                      <option value="CAD">CAD C$ Canadian Dollar</option>
                      <option value="MXN">MXN $ Mexican Peso</option>
                      <option value="BRL">BRL R$ Brazilian Real</option>
                      <option value="ARS">ARS $ Argentine Peso</option>
                      <option value="CLP">CLP $ Chilean Peso</option>
                      <option value="COP">COP $ Colombian Peso</option>
                      <option value="PEN">PEN S/ Peruvian Sol</option>
                      <option value="BOB">BOB Bs Bolivian Boliviano</option>
                      <option value="PYG">PYG ₲ Paraguayan Guaraní</option>
                      <option value="UYU">UYU $ Uruguayan Peso</option>
                      <option value="VES">VES Bs Venezuelan Bolívar</option>
                      <option value="GYD">GYD GY$ Guyanese Dollar</option>
                      <option value="SRD">SRD $ Surinamese Dollar</option>
                      <option value="BBD">BBD Bds$ Barbadian Dollar</option>
                      <option value="TTD">TTD TT$ Trinidad and Tobago Dollar</option>
                      <option value="JMD">JMD J$ Jamaican Dollar</option>
                      <option value="HTG">HTG G Haitian Gourde</option>
                      <option value="DOP">DOP RD$ Dominican Peso</option>
                      <option value="CUC">CUC $ Cuban Convertible Peso</option>
                      <option value="CUP">CUP $ Cuban Peso</option>
                      <option value="BSD">BSD B$ Bahamian Dollar</option>
                      <option value="KYD">KYD CI$ Cayman Islands Dollar</option>
                      <option value="ANG">ANG ƒ Netherlands Antillean Guilder</option>
                      <option value="AWG">AWG ƒ Aruban Florin</option>
                      <option value="XCD">XCD EC$ East Caribbean Dollar</option>
                      <option value="ECU">ECU Ecu Ecuadorian Sucre</option>
                      <option value="PAB">PAB B/. Panamanian Balboa</option>
                      <option value="CRC">CRC ₡ Costa Rican Colón</option>
                      <option value="NIO">NIO C$ Nicaraguan Córdoba</option>
                      <option value="HNL">HNL L Honduran Lempira</option>
                      <option value="GTQ">GTQ Q Guatemalan Quetzal</option>
                      <option value="BZD">BZD BZ$ Belize Dollar</option>
                      <option value="SVC">SVC ₡ Salvadoran Colón</option>
                      <option value="QAR">QAR ر.ق Qatari Riyal</option>
                      <option value="AED">AED د.إ UAE Dirham</option>
                      <option value="SAR">SAR ر.س Saudi Riyal</option>
                      <option value="OMR">OMR ر.ع Omani Rial</option>
                      <option value="YER">YER ﷼ Yemeni Rial</option>
                      <option value="KWD">KWD د.ك Kuwaiti Dinar</option>
                      <option value="BHD">BHD .د.ب Bahraini Dinar</option>
                      <option value="IQD">IQD ع.د Iraqi Dinar</option>
                      <option value="JOD">JOD د.ا Jordanian Dinar</option>
                      <option value="LBP">LBP ل.ل Lebanese Pound</option>
                      <option value="SYP">SYP £ Syrian Pound</option>
                      <option value="IRR">IRR ﷼ Iranian Rial</option>
                      <option value="AFN">AFN ؋ Afghan Afghani</option>
                      <option value="TJS">TJS ЅМ Tajikistani Somoni</option>
                      <option value="TMT">TMT T Turkmenistani Manat</option>
                      <option value="UZS">UZS Uzbekistani Som</option>
                      <option value="KGS">KGS с Kyrgyzstani Som</option>
                      <option value="KZT">KZT ₸ Kazakhstani Tenge</option>
                      <option value="RUB">RUB ₽ Russian Ruble</option>
                      <option value="UAH">UAH ₴ Ukrainian Hryvnia</option>
                      <option value="MDL">MDL L Moldovan Leu</option>
                      <option value="BYN">BYN Br Belarusian Ruble</option>
                      <option value="AZN">AZN ₼ Azerbaijani Manat</option>
                      <option value="AMD">AMD դր Armenian Dram</option>
                      <option value="GEL">GEL ₾ Georgian Lari</option>
                      <option value="MNT">MNT ₮ Mongolian Tugrik</option>
                      <option value="BAM">BAM KM Bosnia-Herzegovina Convertible Mark</option>
                      <option value="MKD">MKD ден Macedonian Denar</option>
                      <option value="ALL">ALL L Albanian Lek</option>
                      <option value="RSD">RSD дин Serbian Dinar</option>
                      <option value="HRK">HRK kn Croatian Kuna</option>
                      <option value="BGN">BGN лв Bulgarian Lev</option>
                      <option value="RON">RON Lei Romanian Leu</option>
                      <option value="HUF">HUF Ft Hungarian Forint</option>
                      <option value="CZK">CZK Kč Czech Koruna</option>
                      <option value="PLN">PLN zł Polish Złoty</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Select the currency of the invoice.</p>
                </div>

                {/* Date Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                  <div className="relative">
                    <select
                      value={invoiceData.general.dateFormat}
                      onChange={(e) => updateField('general', 'dateFormat', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-gray-900"
                    >
                      <option value="YYYY-MM-DD">YYYY-MM-DD (Preview: 2025-08-30) (default)</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY (Preview: 30/08/2025)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (Preview: 08/30/2025)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Select the date format of the invoice.</p>
                </div>

                {/* Invoice Number */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
                    <input
                      type="text"
                      value={invoiceData.general.invoiceNumberPrefix}
                      onChange={(e) => updateField('general', 'invoiceNumberPrefix', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                      placeholder="Invoice No. of:"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                    <input
                      type="text"
                      value={invoiceData.general.invoiceNumberValue}
                      onChange={(e) => updateField('general', 'invoiceNumberValue', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                      placeholder="1/08-2025"
                    />
                  </div>
                </div>

                {/* Date of Issue */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Issue</label>
                  <input
                    type="date"
                    value={invoiceData.general.issueDate}
                    onChange={(e) => updateField('general', 'issueDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>

                {/* Date of Service */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Service</label>
                  <input
                    type="date"
                    value={invoiceData.general.serviceDate}
                    onChange={(e) => updateField('general', 'serviceDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">Date when the service was provided or goods were delivered.</p>
                </div>

                {/* Stripe Template Specific Fields */}
                {invoiceData.general.template === 'stripe' && (
                  <>
                    {/* Company Logo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo (Optional)</label>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload" className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer block">
                        {invoiceData.general.companyLogo ? (
                          <div className="flex flex-col items-center">
                            <img 
                              src={invoiceData.general.companyLogo} 
                              alt="Company Logo" 
                              className="w-16 h-16 object-contain mb-2 rounded"
                            />
                            <p className="text-sm text-gray-600 mb-1">Click to change logo</p>
                            <p className="text-xs text-gray-500">JPEG, PNG or WebP (max 3MB)</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-sm text-gray-600 mb-1">Click to upload your company logo</p>
                            <p className="text-xs text-gray-500">JPEG, PNG or WebP (max 3MB)</p>
                          </div>
                        )}
                      </label>
                    </div>

                    {/* Payment Link URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payment Link URL (Optional)</label>
                      <input
                        type="url"
                        value={invoiceData.general.paymentLinkUrl || ''}
                        onChange={(e) => updateField('general', 'paymentLinkUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="https://your-payment-link.com"
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter your payment URL. This adds a "Pay Online" button to the PDF invoice.</p>
                    </div>
                  </>
                )}
            </CollapsibleSection>

            {/* Seller Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h2 
                className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors"
                onClick={() => toggleSection('seller')}
              >
                <div className="flex items-center">
                  <User className="h-5 w-5 text-blue-600 mr-2" />
                  Seller Information
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSellerModal(true);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    New Seller +
                  </button>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${collapsedSections.seller ? 'rotate-0' : 'rotate-180'}`} />
                </div>
              </h2>
              
              {!collapsedSections.seller && (
                <div className="space-y-4">
                  {/* Current Seller Info Display */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2">{invoiceData.seller.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{invoiceData.seller.address}</p>
                        <p className="text-sm text-gray-600 mb-1">{invoiceData.seller.email}</p>
                        {invoiceData.seller.vatNumber && (
                          <p className="text-sm text-gray-600">VAT: {invoiceData.seller.vatNumber}</p>
                        )}
                      </div>
                      <button
                        onClick={() => setShowSellerModal(true)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Seller
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Buyer Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h2 
                className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors"
                onClick={() => toggleSection('buyer')}
              >
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-purple-600 mr-2" />
                  Buyer Information
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${collapsedSections.buyer ? 'rotate-0' : 'rotate-180'}`} />
              </h2>
              
              {!collapsedSections.buyer && (
                <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                                      <input
                      type="text"
                      value={invoiceData.buyer.name}
                      onChange={(e) => updateField('buyer', 'name', e.target.value)}
                      placeholder="Client Company"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                      <textarea
                      value={invoiceData.buyer.address}
                      onChange={(e) => updateField('buyer', 'address', e.target.value)}
                      placeholder="Client Address"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">VAT Number</label>
                                          <input
                        type="text"
                        value={invoiceData.buyer.vatNumber}
                        onChange={(e) => updateField('buyer', 'vatNumber', e.target.value)}
                        placeholder="VAT987654321"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                      />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                          <input
                        type="email"
                        value={invoiceData.buyer.email}
                        onChange={(e) => updateField('buyer', 'email', e.target.value)}
                        placeholder="client@company.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                      />
                  </div>
                </div>
                </div>
              )}
            </div>

            {/* Invoice Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 
                  className="text-lg font-semibold text-gray-900 flex items-center cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors"
                  onClick={() => toggleSection('items')}
                >
                  <Package className="h-5 w-5 text-green-600 mr-2" />
                  Invoice Items
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ml-2 ${collapsedSections.items ? 'rotate-0' : 'rotate-180'}`} />
                </h2>
                <button
                  onClick={addItem}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Item</span>
                </button>
              </div>
              
              {!collapsedSections.items && (
                <div className="space-y-4">
                {invoiceData.items.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                      {invoiceData.items.length > 1 && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                                  <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            placeholder="Item description"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                          />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                                  <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                                                  <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">VAT Rate (%)</label>
                                                  <input
                            type="number"
                            value={item.vatRate}
                            onChange={(e) => updateItem(item.id, 'vatRate', parseFloat(e.target.value) || 0)}
                            min="0"
                            max="100"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                        <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h2 
                className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors"
                onClick={() => toggleSection('payment')}
              >
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-purple-600 mr-2" />
                  Payment Information
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${collapsedSections.payment ? 'rotate-0' : 'rotate-180'}`} />
              </h2>
              
              {!collapsedSections.payment && (
                <div className="space-y-4">
                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={invoiceData.payment.method}
                        onChange={(e) => updateField('payment', 'method', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="Bank Transfer, Credit Card, etc."
                      />
                      <Toggle
                        checked={invoiceData.payment.showMethodInPDF}
                        onChange={(checked) => updateField('payment', 'showMethodInPDF', checked)}
                        label="Show in PDF"
                      />
                    </div>
                  </div>

                  {/* Payment Due Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Due Date</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="date"
                        value={invoiceData.payment.dueDate}
                        onChange={(e) => updateField('payment', 'dueDate', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      />
                      <Toggle
                        checked={invoiceData.payment.showDueDateInPDF}
                        onChange={(checked) => updateField('payment', 'showDueDateInPDF', checked)}
                        label="Show in PDF"
                      />
                    </div>
                  </div>

                  {/* Payment Terms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={invoiceData.payment.terms}
                        onChange={(e) => updateField('payment', 'terms', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="Net 30 days, Due on receipt, etc."
                      />
                      <Toggle
                        checked={invoiceData.payment.showTermsInPDF}
                        onChange={(checked) => updateField('payment', 'showTermsInPDF', checked)}
                        label="Show in PDF"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notes Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h2 
                className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors"
                onClick={() => toggleSection('notes')}
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-orange-600 mr-2" />
                  Notes
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${collapsedSections.notes ? 'rotate-0' : 'rotate-180'}`} />
              </h2>
              
              {!collapsedSections.notes && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Invoice Notes</label>
                      <Toggle
                        checked={invoiceData.notes.showInPDF}
                        onChange={(checked) => updateField('notes', 'showInPDF', checked)}
                        label="Show in PDF"
                      />
                    </div>
                    <textarea
                      value={invoiceData.notes.content}
                      onChange={(e) => updateField('notes', 'content', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 resize-none"
                      placeholder="Additional notes, terms, or thank you message..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Signature Field */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h2 
                className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors"
                onClick={() => toggleSection('signature')}
              >
                <div className="flex items-center">
                  <User className="h-5 w-5 text-green-600 mr-2" />
                  Signature
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${collapsedSections.signature ? 'rotate-0' : 'rotate-180'}`} />
              </h2>
              
              {!collapsedSections.signature && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Show Signature in PDF</label>
                      <Toggle
                        checked={invoiceData.signature.showInPDF}
                        onChange={(checked) => updateField('signature', 'showInPDF', checked)}
                        label="Show in PDF"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Signature Name</label>
                      <input
                        type="text"
                        value={invoiceData.signature.name}
                        onChange={(e) => updateField('signature', 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Signature Title</label>
                      <input
                        type="text"
                        value={invoiceData.signature.title}
                        onChange={(e) => updateField('signature', 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="CEO"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom padding to ensure all content is scrollable */}
            <div className="h-8"></div>
          </div>

                                  {/* Right Column - Preview (9/12 on large screens) */}
            <div className="lg:col-span-9 sticky top-8 h-fit">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              
              {/* HTML Preview */}
              <HTMLPreview data={invoiceData} isFormValid={isFormValid()} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">InvoicePDF</h3>
                  <p className="text-sm text-gray-500">Professional Invoice Generator</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                Create professional invoices in seconds with our easy-to-use online invoice generator. 
                Support for multiple currencies, European VAT compliance, and beautiful templates.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    API
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-gray-500">
                <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-gray-900 transition-colors">Cookie Policy</a>
                <a href="#" className="hover:text-gray-900 transition-colors">GDPR</a>
              </div>
              <div className="mt-4 md:mt-0 text-sm text-gray-500">
                © 2024 InvoicePDF. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Support Popup */}
      {isClient && showSupportPopup && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 max-w-sm">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Support My Work</h3>
              <button 
                onClick={() => {
                  setShowSupportPopup(false);
                  // Save dismissal timestamp to localStorage
                  localStorage.setItem('supportPopupDismissed', Date.now().toString());
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          <p className="text-sm text-gray-600 mb-4">
            Your contribution helps me maintain and improve this project for everyone! 🚀
          </p>
          <div className="flex gap-2">
            <button className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              Star on GitHub
            </button>
            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Share Feedback
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Seller Modal */}
      <SellerModal
        isOpen={showSellerModal}
        onClose={() => setShowSellerModal(false)}
        sellerData={invoiceData.seller}
        onSave={handleSaveSeller}
      />

      {/* How It Works Modal */}
      <HowItWorksModal
        isOpen={showHowItWorksModal}
        onClose={() => setShowHowItWorksModal(false)}
      />

      {/* Generate Link Modal */}
      <GenerateLinkModal
        isOpen={showGenerateLinkModal}
        onClose={() => setShowGenerateLinkModal(false)}
        invoiceData={invoiceData}
      />
    </div>
  );
}
