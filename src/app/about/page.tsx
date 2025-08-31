import { FileText, Download, Share2, Globe, Star, CheckCircle, Users, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">EasyInvoicePDF</h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create professional invoices with ease. Generate beautiful PDF invoices, 
              manage templates, and share with your clients in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Start Creating Invoices
              </Link>
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose EasyInvoicePDF?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional invoice generation made simple and efficient
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Generate professional invoices in seconds with our optimized templates and streamlined workflow.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Templates</h3>
              <p className="text-gray-600">
                Choose from multiple professional templates designed to impress your clients and maintain brand consistency.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi-Language</h3>
              <p className="text-gray-600">
                Support for multiple languages and currencies to serve clients worldwide.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">PDF Export</h3>
              <p className="text-gray-600">
                Export invoices as high-quality PDFs that look professional on any device.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Sharing</h3>
              <p className="text-gray-600">
                Share invoices via email, Google Drive, or generate shareable links for your clients.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Registration</h3>
              <p className="text-gray-600">
                Start creating invoices immediately without any registration or setup required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Professional Invoice Templates
            </h2>
            <p className="text-lg text-gray-600">
              Choose from our collection of beautiful, professional templates
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Default Template</h3>
              <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Clean & Professional Design</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Stripe Template</h3>
              <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Modern & Minimal Design</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600">
              Trusted by freelancers and businesses worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "EasyInvoicePDF has streamlined our invoicing process completely. 
                The templates are professional and the PDF quality is excellent."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">Freelance Designer</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Perfect for our small business. No registration required and 
                the invoices look exactly like what we need."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">Mike Chen</p>
                  <p className="text-sm text-gray-600">Startup Founder</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The multi-language support is fantastic. We can easily create 
                invoices for our international clients."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">Maria Rodriguez</p>
                  <p className="text-sm text-gray-600">Consultant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Professional Invoices?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start generating beautiful invoices in minutes, completely free.
          </p>
          <Link 
            href="/"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
