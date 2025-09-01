'use client';

import React, { useState } from 'react';
import { X, Copy, ExternalLink, Lock, Calendar, Check } from 'lucide-react';

interface GenerateLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: any;
}

export const GenerateLinkModal: React.FC<GenerateLinkModalProps> = ({
  isOpen,
  onClose,
  invoiceData
}) => {
  const [password, setPassword] = useState('');
  const [expiryDays, setExpiryDays] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/invoices/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceData,
          password: password.trim() || null,
          expiryDays
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedLink(data.shareableUrl);
      } else {
        alert('Failed to generate link: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Failed to generate link');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openLink = () => {
    window.open(generatedLink, '_blank');
  };

  const resetModal = () => {
    setPassword('');
    setExpiryDays(30);
    setGeneratedLink('');
    setCopied(false);
    setIsGenerating(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg relative shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Generate Shareable Link</h3>
          <button
            onClick={handleClose}
            className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {!generatedLink ? (
          <div className="space-y-6">
            <div>
              <p className="text-gray-700 mb-4 font-medium">
                Create a shareable link for this invoice. Others can view the invoice without needing access to your account.
              </p>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-800 mb-3">
                <Lock className="h-4 w-4" />
                <span>Password Protection (Optional)</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-500"
                placeholder="Leave empty for no password"
              />
              <p className="text-xs text-gray-600 mt-1 font-medium">
                If set, viewers will need this password to access the invoice
              </p>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-800 mb-3">
                <Calendar className="h-4 w-4" />
                <span>Link Expiration</span>
              </label>
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
                <option value={365}>1 year</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 border-2 border-gray-400 text-gray-800 font-medium rounded-lg hover:bg-gray-100 hover:border-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateLink}
                disabled={isGenerating}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-sm"
              >
                {isGenerating ? 'Generating...' : 'Generate Link'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Link Generated Successfully!</h4>
              <p className="text-gray-700 mb-4 font-medium">
                Your shareable invoice link is ready. Share this link with anyone who needs to view the invoice.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Shareable Link
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={generatedLink}
                  readOnly
                  className="flex-1 px-3 py-2 border-2 border-gray-400 rounded-lg bg-gray-100 text-sm text-gray-900 font-mono"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
                <button
                  onClick={openLink}
                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                  title="Open link"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
              {copied && (
                <p className="text-green-600 text-sm mt-1">Copied to clipboard!</p>
              )}
            </div>

            <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4">
              <h5 className="font-semibold text-gray-900 mb-2">Link Details:</h5>
              <ul className="text-sm text-gray-700 space-y-1 font-medium">
                <li>• Expires in {expiryDays} days</li>
                <li>• {password ? 'Password protected' : 'No password required'}</li>
                <li>• Can be shared with anyone</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={resetModal}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Generate Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
