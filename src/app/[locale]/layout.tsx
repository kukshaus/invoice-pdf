import { ReactNode } from 'react';

interface LocaleLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params;

  return (
    <div className="min-h-screen bg-white">
      {/* Language indicator */}
      <div className="bg-blue-50 border-b border-blue-200 py-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-blue-700">Language:</span>
              <span className="text-sm font-medium text-blue-900 capitalize">
                {locale === 'en' ? 'English' : 
                 locale === 'de' ? 'Deutsch' : 
                 locale === 'fr' ? 'Français' : 
                 locale === 'es' ? 'Español' : 
                 locale === 'it' ? 'Italiano' : 'English'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/en/about" className={`text-sm ${locale === 'en' ? 'text-blue-900 font-medium' : 'text-blue-600 hover:text-blue-700'}`}>
                EN
              </a>
              <a href="/de/about" className={`text-sm ${locale === 'de' ? 'text-blue-900 font-medium' : 'text-blue-600 hover:text-blue-700'}`}>
                DE
              </a>
              <a href="/fr/about" className={`text-sm ${locale === 'fr' ? 'text-blue-900 font-medium' : 'text-blue-600 hover:text-blue-700'}`}>
                FR
              </a>
              <a href="/es/about" className={`text-sm ${locale === 'es' ? 'text-blue-900 font-medium' : 'text-blue-600 hover:text-blue-700'}`}>
                ES
              </a>
              <a href="/it/about" className={`text-sm ${locale === 'it' ? 'text-blue-900 font-medium' : 'text-blue-600 hover:text-blue-700'}`}>
                IT
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      {children}
    </div>
  );
}
