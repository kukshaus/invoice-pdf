// European Invoice Standards Guide
// Based on EU VAT Directive 2006/112/EC and local country requirements

export interface EuropeanInvoiceStandards {
  // Required Fields for EU Invoices
  requiredFields: {
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    supplierDetails: {
      name: string;
      address: string;
      vatNumber: string;
      countryCode: string;
    };
    customerDetails: {
      name: string;
      address: string;
      vatNumber?: string;
      countryCode: string;
    };
    lineItems: {
      description: string;
      quantity: number;
      unitPrice: number;
      vatRate: number;
      totalExcludingVAT: number;
      totalIncludingVAT: number;
    }[];
    totals: {
      subtotalExcludingVAT: number;
      totalVAT: number;
      totalIncludingVAT: number;
    };
  };

  // VAT Requirements by Country
  vatRates: {
    [countryCode: string]: {
      standardRate: number;
      reducedRates: number[];
      zeroRate: boolean;
      exempt: boolean;
    };
  };

  // Currency Requirements
  currencies: {
    EUR: { symbol: '€', name: 'Euro', countries: ['AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES'] };
    GBP: { symbol: '£', name: 'British Pound', countries: ['GB'] };
    CHF: { symbol: 'CHF', name: 'Swiss Franc', countries: ['CH'] };
    SEK: { symbol: 'SEK', name: 'Swedish Krona', countries: ['SE'] };
    NOK: { symbol: 'NOK', name: 'Norwegian Krone', countries: ['NO'] };
    DKK: { symbol: 'DKK', name: 'Danish Krone', countries: ['DK'] };
  };

  // Date Format Requirements
  dateFormats: {
    [countryCode: string]: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY';
  };

  // Language Requirements
  languages: {
    [countryCode: string]: string[];
  };
}

// European VAT Rates (2024)
export const EUROPEAN_VAT_RATES: EuropeanInvoiceStandards['vatRates'] = {
  // Eurozone Countries
  AT: { standardRate: 20, reducedRates: [10, 13], zeroRate: true, exempt: true }, // Austria
  BE: { standardRate: 21, reducedRates: [6, 12], zeroRate: true, exempt: true }, // Belgium
  CY: { standardRate: 19, reducedRates: [5, 9], zeroRate: true, exempt: true }, // Cyprus
  EE: { standardRate: 20, reducedRates: [9], zeroRate: true, exempt: true }, // Estonia
  FI: { standardRate: 24, reducedRates: [10, 14], zeroRate: true, exempt: true }, // Finland
  FR: { standardRate: 20, reducedRates: [2.1, 5.5, 10], zeroRate: true, exempt: true }, // France
  DE: { standardRate: 19, reducedRates: [7], zeroRate: true, exempt: true }, // Germany
  GR: { standardRate: 24, reducedRates: [6, 13], zeroRate: true, exempt: true }, // Greece
  IE: { standardRate: 23, reducedRates: [9, 13.5], zeroRate: true, exempt: true }, // Ireland
  IT: { standardRate: 22, reducedRates: [5, 10], zeroRate: true, exempt: true }, // Italy
  LV: { standardRate: 21, reducedRates: [5, 12], zeroRate: true, exempt: true }, // Latvia
  LT: { standardRate: 21, reducedRates: [5, 9], zeroRate: true, exempt: true }, // Lithuania
  LU: { standardRate: 17, reducedRates: [3, 8, 14], zeroRate: true, exempt: true }, // Luxembourg
  MT: { standardRate: 18, reducedRates: [5, 7], zeroRate: true, exempt: true }, // Malta
  NL: { standardRate: 21, reducedRates: [9], zeroRate: true, exempt: true }, // Netherlands
  PT: { standardRate: 23, reducedRates: [6, 13], zeroRate: true, exempt: true }, // Portugal
  SK: { standardRate: 20, reducedRates: [10], zeroRate: true, exempt: true }, // Slovakia
  SI: { standardRate: 22, reducedRates: [9.5], zeroRate: true, exempt: true }, // Slovenia
  ES: { standardRate: 21, reducedRates: [10], zeroRate: true, exempt: true }, // Spain

  // Non-Eurozone EU Countries
  BG: { standardRate: 20, reducedRates: [9], zeroRate: true, exempt: true }, // Bulgaria
  HR: { standardRate: 25, reducedRates: [5, 13], zeroRate: true, exempt: true }, // Croatia
  CZ: { standardRate: 21, reducedRates: [10, 15], zeroRate: true, exempt: true }, // Czech Republic
  HU: { standardRate: 27, reducedRates: [5, 18], zeroRate: true, exempt: true }, // Hungary
  PL: { standardRate: 23, reducedRates: [5, 8], zeroRate: true, exempt: true }, // Poland
  RO: { standardRate: 19, reducedRates: [5, 9], zeroRate: true, exempt: true }, // Romania

  // Non-EU European Countries
  GB: { standardRate: 20, reducedRates: [5], zeroRate: true, exempt: true }, // United Kingdom
  CH: { standardRate: 7.7, reducedRates: [2.5, 3.7], zeroRate: true, exempt: true }, // Switzerland
  NO: { standardRate: 25, reducedRates: [12, 15], zeroRate: true, exempt: true }, // Norway
  SE: { standardRate: 25, reducedRates: [6, 12], zeroRate: true, exempt: true }, // Sweden
  DK: { standardRate: 25, reducedRates: [], zeroRate: true, exempt: true }, // Denmark
};

// Date Format Preferences by Country
export const COUNTRY_DATE_FORMATS: { [countryCode: string]: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY' } = {
  // Most European countries use DD/MM/YYYY
  AT: 'DD/MM/YYYY', BE: 'DD/MM/YYYY', CY: 'DD/MM/YYYY', EE: 'DD/MM/YYYY',
  FI: 'DD/MM/YYYY', FR: 'DD/MM/YYYY', DE: 'DD/MM/YYYY', GR: 'DD/MM/YYYY',
  IE: 'DD/MM/YYYY', IT: 'DD/MM/YYYY', LV: 'DD/MM/YYYY', LT: 'DD/MM/YYYY',
  LU: 'DD/MM/YYYY', MT: 'DD/MM/YYYY', NL: 'DD/MM/YYYY', PT: 'DD/MM/YYYY',
  SK: 'DD/MM/YYYY', SI: 'DD/MM/YYYY', ES: 'DD/MM/YYYY', BG: 'DD/MM/YYYY',
  HR: 'DD/MM/YYYY', CZ: 'DD/MM/YYYY', HU: 'DD/MM/YYYY', PL: 'DD/MM/YYYY',
  RO: 'DD/MM/YYYY', GB: 'DD/MM/YYYY', CH: 'DD/MM/YYYY', NO: 'DD/MM/YYYY',
  SE: 'DD/MM/YYYY', DK: 'DD/MM/YYYY',
  
  // US uses MM/DD/YYYY
  US: 'MM/DD/YYYY',
  
  // ISO format for international standards
  ISO: 'YYYY-MM-DD',
};

// Language Preferences by Country
export const COUNTRY_LANGUAGES: { [countryCode: string]: string[] } = {
  AT: ['de', 'en'], // Austria
  BE: ['nl', 'fr', 'de', 'en'], // Belgium
  CY: ['el', 'en'], // Cyprus
  EE: ['et', 'en'], // Estonia
  FI: ['fi', 'sv', 'en'], // Finland
  FR: ['fr', 'en'], // France
  DE: ['de', 'en'], // Germany
  GR: ['el', 'en'], // Greece
  IE: ['en', 'ga'], // Ireland
  IT: ['it', 'en'], // Italy
  LV: ['lv', 'en'], // Latvia
  LT: ['lt', 'en'], // Lithuania
  LU: ['fr', 'de', 'lb', 'en'], // Luxembourg
  MT: ['mt', 'en'], // Malta
  NL: ['nl', 'en'], // Netherlands
  PT: ['pt', 'en'], // Portugal
  SK: ['sk', 'en'], // Slovakia
  SI: ['sl', 'en'], // Slovenia
  ES: ['es', 'ca', 'eu', 'gl', 'en'], // Spain
  GB: ['en'], // United Kingdom
  CH: ['de', 'fr', 'it', 'rm', 'en'], // Switzerland
  NO: ['no', 'en'], // Norway
  SE: ['sv', 'en'], // Sweden
  DK: ['da', 'en'], // Denmark
};

// Validation Functions
export const validateEuropeanInvoice = (invoiceData: any) => {
  const errors: string[] = [];

  // Check required fields
  if (!invoiceData.general.invoiceNumber) {
    errors.push('Invoice number is required');
  }

  if (!invoiceData.general.issueDate) {
    errors.push('Issue date is required');
  }

  if (!invoiceData.seller.vatNumber && invoiceData.seller.countryCode) {
    const country = invoiceData.seller.countryCode.toUpperCase();
    if (EUROPEAN_VAT_RATES[country]) {
      errors.push('VAT number is required for EU businesses');
    }
  }

  if (!invoiceData.items || invoiceData.items.length === 0) {
    errors.push('At least one line item is required');
  }

  // Check VAT rates
  invoiceData.items?.forEach((item: any, index: number) => {
    const country = invoiceData.seller.countryCode?.toUpperCase();
    if (country && EUROPEAN_VAT_RATES[country]) {
      const validRates = [
        EUROPEAN_VAT_RATES[country].standardRate,
        ...EUROPEAN_VAT_RATES[country].reducedRates,
        0 // Zero rate
      ];
      if (!validRates.includes(item.vatRate)) {
        errors.push(`Invalid VAT rate ${item.vatRate}% for ${country}. Valid rates: ${validRates.join(', ')}%`);
      }
    }
  });

  return errors;
};

// Format currency according to European standards
export const formatEuropeanCurrency = (amount: number, currency: string, countryCode?: string) => {
  const currencyMap: { [key: string]: { symbol: string; locale: string } } = {
    EUR: { symbol: '€', locale: 'de-DE' },
    GBP: { symbol: '£', locale: 'en-GB' },
    CHF: { symbol: 'CHF', locale: 'de-CH' },
    SEK: { symbol: 'SEK', locale: 'sv-SE' },
    NOK: { symbol: 'NOK', locale: 'nb-NO' },
    DKK: { symbol: 'DKK', locale: 'da-DK' },
    USD: { symbol: '$', locale: 'en-US' },
  };

  const currencyInfo = currencyMap[currency];
  if (!currencyInfo) return `${amount.toFixed(2)} ${currency}`;

  return new Intl.NumberFormat(currencyInfo.locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date according to country preferences
export const formatEuropeanDate = (date: string, countryCode?: string) => {
  const format = countryCode ? COUNTRY_DATE_FORMATS[countryCode] : 'DD/MM/YYYY';
  const d = new Date(date);
  
  switch (format) {
    case 'DD/MM/YYYY':
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    case 'MM/DD/YYYY':
      return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
    case 'YYYY-MM-DD':
    default:
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
};
