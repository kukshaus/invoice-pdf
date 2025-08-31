export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
}

export interface Seller {
  name: string;
  address: string;
  vatNumber?: string;
  email: string;
  accountNumber?: string;
  swiftBic?: string;
}

export interface Buyer {
  name: string;
  address: string;
  vatNumber?: string;
  email: string;
}

export interface GeneralInfo {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  language: string;
}

export interface InvoiceData {
  general: GeneralInfo;
  seller: Seller;
  buyer: Buyer;
  items: InvoiceItem[];
  template: 'default' | 'stripe';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InvoiceFormData {
  general: GeneralInfo;
  seller: Seller;
  buyer: Buyer;
  items: InvoiceItem[];
  template: 'default' | 'stripe';
}

export interface PDFGenerationOptions {
  template: 'default' | 'stripe';
  includeLogo?: boolean;
  logoUrl?: string;
  watermark?: boolean;
  password?: string;
}

export interface ShareOptions {
  email?: string;
  telegram?: string;
  googleDrive?: boolean;
  publicLink?: boolean;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: ValidationError[];
}
