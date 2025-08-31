import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Consistent date formatting function that works the same on server and client
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  // Use consistent MM/DD/YYYY format to avoid hydration mismatches
  return `${month}/${day}/${year}`;
}

// Format currency with consistent locale
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${year}${month}-${random}`;
}

export function calculateVAT(subtotal: number, vatRate: number): number {
  return subtotal * (vatRate / 100);
}

export function calculateTotal(subtotal: number, vat: number): number {
  return subtotal + vat;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateVATNumber(vatNumber: string): boolean {
  // Basic VAT number validation for EU countries
  const vatRegex = /^[A-Z]{2}[0-9A-Z]+$/;
  return vatRegex.test(vatNumber);
}
