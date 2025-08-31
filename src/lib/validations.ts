import { z } from "zod";
import { validateEuropeanInvoice } from "./european-standards";

export const invoiceSchema = z.object({
  general: z.object({
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    invoiceNumberPrefix: z.string().optional(),
    invoiceNumberValue: z.string().optional(),
    issueDate: z.string().min(1, "Issue date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    serviceDate: z.string().optional(),
    currency: z.string().min(1, "Currency is required"),
    language: z.string().min(1, "Language is required"),
    template: z.enum(['default', 'stripe']),
    dateFormat: z.enum(['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY']),
  }),
  seller: z.object({
    name: z.string().min(1, "Seller name is required"),
    address: z.string().min(1, "Seller address is required"),
    vatNumber: z.string().optional(),
    email: z.string().email("Invalid email format"),
    accountNumber: z.string().optional(),
    swiftBic: z.string().optional(),
    countryCode: z.string().optional(),
    showVatInPDF: z.boolean().optional(),
    showAccountInPDF: z.boolean().optional(),
    showSwiftInPDF: z.boolean().optional(),
    notes: z.string().optional(),
    showNotesInPDF: z.boolean().optional(),
  }),
  buyer: z.object({
    name: z.string().min(1, "Buyer name is required"),
    address: z.string().min(1, "Buyer address is required"),
    vatNumber: z.string().optional(),
    email: z.string().email("Invalid email format"),
    countryCode: z.string().optional(),
  }),
  items: z.array(z.object({
    id: z.string(),
    description: z.string().min(1, "Description is required"),
    quantity: z.number().positive("Quantity must be positive"),
    unitPrice: z.number().positive("Unit price must be positive"),
    vatRate: z.number().min(0).max(100, "VAT rate must be between 0 and 100"),
  })).min(1, "At least one item is required"),
  template: z.enum(['default', 'stripe']),
}).refine((data) => {
  // European standards validation
  const errors = validateEuropeanInvoice(data);
  if (errors.length > 0) {
    throw new Error(errors.join('; '));
  }
  return true;
}, {
  message: "Invoice does not meet European standards",
});

export const emailSchema = z.object({
  email: z.string().email("Invalid email format"),
});

// Helper function to get full invoice number
export const getFullInvoiceNumber = (data: any) => {
  const prefix = data.general.invoiceNumberPrefix || '';
  const value = data.general.invoiceNumberValue || data.general.invoiceNumber || '';
  return prefix && value ? `${prefix} ${value}` : value;
};

export const subscriptionSchema = z.object({
  email: z.string().email("Invalid email format"),
  confirmToken: z.string().optional(),
});
