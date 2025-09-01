import { Calendar, Tag, Download, ExternalLink } from 'lucide-react';

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  type: 'feature' | 'bugfix' | 'breaking' | 'improvement';
  changes: string[];
}

const changelogData: ChangelogEntry[] = [
  {
    version: '1.2.0',
    date: '2024-01-15',
    title: 'Enhanced Template System',
    description: 'New Stripe template and improved template customization options',
    type: 'feature',
    changes: [
      'Added new Stripe-inspired template',
      'Enhanced template customization options',
      'Improved PDF generation quality',
      'Added support for custom logos',
      'Fixed template rendering issues'
    ]
  },
  {
    version: '1.1.0',
    date: '2024-01-01',
    title: 'Multi-language Support',
    description: 'Added support for multiple languages and improved internationalization',
    type: 'feature',
    changes: [
      'Added German language support',
      'Added French language support',
      'Added Spanish language support',
      'Improved language switcher UI',
      'Added RTL support for Arabic'
    ]
  },
  {
    version: '1.0.1',
    date: '2023-12-20',
    title: 'Bug Fixes and Improvements',
    description: 'Various bug fixes and performance improvements',
    type: 'bugfix',
    changes: [
      'Fixed VAT calculation issues',
      'Improved form validation',
      'Fixed PDF download problems',
      'Enhanced mobile responsiveness',
      'Optimized database queries'
    ]
  },
  {
    version: '1.0.0',
    date: '2023-12-01',
    title: 'Initial Release',
    description: 'First public release of InvoicePDF',
    type: 'feature',
    changes: [
      'Basic invoice generation',
      'Default template',
      'PDF export functionality',
      'Email sharing',
      'MongoDB integration'
    ]
  }
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'feature':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'bugfix':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'breaking':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'improvement':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'feature':
      return '✨';
    case 'bugfix':
      return '🐛';
    case 'breaking':
      return '💥';
    case 'improvement':
      return '⚡';
    default:
      return '📝';
  }
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Changelog</h1>
            <p className="text-lg text-gray-600">
              Track the latest updates and improvements to InvoicePDF
            </p>
          </div>
        </div>
      </div>

      {/* Changelog Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {changelogData.map((entry, index) => (
            <div key={entry.version} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Version Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-5 w-5 text-gray-400" />
                    <span className="text-lg font-semibold text-gray-900">v{entry.version}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(entry.type)}`}>
                    {getTypeIcon(entry.type)} {entry.type}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(entry.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>

              {/* Title and Description */}
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{entry.title}</h2>
              <p className="text-gray-600 mb-4">{entry.description}</p>

              {/* Changes List */}
              <div className="space-y-2">
                {entry.changes.map((change, changeIndex) => (
                  <div key={changeIndex} className="flex items-start space-x-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span className="text-gray-700">{change}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 mt-6 pt-4 border-t border-gray-100">
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  <Download className="h-4 w-4" />
                  <span>Download v{entry.version}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 text-sm font-medium">
                  <ExternalLink className="h-4 w-4" />
                  <span>Release Notes</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Want to stay updated with the latest releases?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              <Tag className="h-4 w-4" />
              <span>Follow on GitHub</span>
            </button>
            <button className="flex items-center justify-center space-x-2 border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
              <Calendar className="h-4 w-4" />
              <span>Subscribe to Updates</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
