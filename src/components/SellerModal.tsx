'use client';

import React, { useState } from 'react';
import { X, Save, User } from 'lucide-react';
import { Toggle } from './Toggle';

interface SellerData {
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
}

interface SellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerData: SellerData;
  onSave: (data: SellerData) => void;
}

export const SellerModal: React.FC<SellerModalProps> = ({
  isOpen,
  onClose,
  sellerData,
  onSave
}) => {
  const [formData, setFormData] = useState<SellerData>(sellerData);

  const updateField = (field: keyof SellerData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    setFormData(sellerData); // Reset to original data
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Seller Information</h2>
              <p className="text-sm text-gray-500">Add or edit seller details</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <textarea
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 resize-none"
              placeholder="Enter company name"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 resize-none"
              placeholder="Enter full address"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="contact@company.com"
            />
          </div>

          {/* VAT Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              VAT Number
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.vatNumber}
                onChange={(e) => updateField('vatNumber', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="VAT123456789"
              />
              <Toggle
                checked={formData.showVatInPDF}
                onChange={(checked) => updateField('showVatInPDF', checked)}
                label="Show in PDF"
              />
            </div>
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <div className="flex items-center gap-3">
              <textarea
                value={formData.accountNumber}
                onChange={(e) => updateField('accountNumber', e.target.value)}
                rows={2}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 resize-none"
                placeholder="Bank account number"
              />
              <Toggle
                checked={formData.showAccountInPDF}
                onChange={(checked) => updateField('showAccountInPDF', checked)}
                label="Show in PDF"
              />
            </div>
          </div>

          {/* SWIFT/BIC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SWIFT/BIC
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.swiftBic}
                onChange={(e) => updateField('swiftBic', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="SWIFT code"
              />
              <Toggle
                checked={formData.showSwiftInPDF}
                onChange={(checked) => updateField('showSwiftInPDF', checked)}
                label="Show in PDF"
              />
            </div>
          </div>

          {/* Country Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country Code
            </label>
            <input
              type="text"
              value={formData.countryCode}
              onChange={(e) => updateField('countryCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="GB"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <div className="flex items-start gap-3">
              <textarea
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                rows={3}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 resize-none"
                placeholder="Additional notes"
              />
              <Toggle
                checked={formData.showNotesInPDF}
                onChange={(checked) => updateField('showNotesInPDF', checked)}
                label="Show in PDF"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Seller
          </button>
        </div>
      </div>
    </div>
  );
};
