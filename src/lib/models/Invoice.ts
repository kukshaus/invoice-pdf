import mongoose from 'mongoose';

// Sanitize input data
const sanitizeString = (str: string | undefined): string => {
  if (!str) return '';
  return str.replace(/[<>]/g, '').trim();
};

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { 
    type: String, 
    required: true, 
    unique: true,
    set: sanitizeString,
    validate: {
      validator: (v: string) => v.length > 0 && v.length <= 50,
      message: 'Invoice number must be between 1 and 50 characters'
    }
  },
  issueDate: { 
    type: Date, 
    required: true
  },
  dueDate: { 
    type: Date, 
    required: true
  },
  currency: { 
    type: String, 
    required: true,
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    default: 'USD'
  },
  language: { 
    type: String, 
    required: true,
    enum: ['en', 'es', 'fr', 'de', 'it'],
    default: 'en'
  },
  seller: {
    name: { 
      type: String, 
      required: true,
      set: sanitizeString,
      maxlength: 100
    },
    address: { 
      type: String, 
      required: true,
      set: sanitizeString,
      maxlength: 200
    },
    vatNumber: { 
      type: String,
      set: sanitizeString,
      maxlength: 20
    },
    email: { 
      type: String, 
      validate: {
        validator: (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: 'Invalid email format'
      }
    },
    accountNumber: { 
      type: String,
      set: sanitizeString,
      maxlength: 34
    },
    swiftBic: { 
      type: String,
      set: sanitizeString,
      maxlength: 11
    },
  },
  buyer: {
    name: { 
      type: String, 
      required: true,
      set: sanitizeString,
      maxlength: 100
    },
    address: { 
      type: String, 
      required: true,
      set: sanitizeString,
      maxlength: 200
    },
    vatNumber: { 
      type: String,
      set: sanitizeString,
      maxlength: 20
    },
    email: { 
      type: String, 
      validate: {
        validator: (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: 'Invalid email format'
      }
    },
  },
  items: [{
    description: { 
      type: String, 
      required: true,
      set: sanitizeString,
      maxlength: 200
    },
    quantity: { 
      type: Number, 
      required: true,
      min: 0.01,
      max: 999999
    },
    unitPrice: { 
      type: Number, 
      required: true,
      min: 0,
      max: 999999
    },
    vatRate: { 
      type: Number, 
      required: true,
      min: 0,
      max: 100
    },
  }],
  template: { 
    type: String, 
    enum: ['default', 'stripe'], 
    default: 'default' 
  },
  shareableLink: {
    id: { 
      type: String, 
      unique: true, 
      sparse: true 
    },
    isActive: { 
      type: Boolean, 
      default: false 
    },
    password: { 
      type: String, 
      default: null 
    },
    createdAt: { 
      type: Date, 
      default: null 
    },
    expiresAt: { 
      type: Date, 
      default: null 
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Add indexes for better performance (avoid duplicates with unique fields)
InvoiceSchema.index({ createdAt: -1 });
InvoiceSchema.index({ 'seller.email': 1 });
InvoiceSchema.index({ 'shareableLink.isActive': 1, 'shareableLink.expiresAt': 1 });

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
