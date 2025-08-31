'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Globe, Star, Calendar } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">EasyInvoicePDF</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                href="/"
                className={`text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Invoice Generator
              </Link>
              <Link 
                href="/about"
                className={`text-sm font-medium transition-colors ${
                  isActive('/about') 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                About
              </Link>
              <Link 
                href="/changelog"
                className={`text-sm font-medium transition-colors ${
                  isActive('/changelog') 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Changelog
              </Link>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-500" />
              <select className="text-sm border border-gray-300 rounded px-2 py-1 bg-white">
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </div>
            
            <button className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Star className="h-4 w-4" />
              <span>Star on GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
