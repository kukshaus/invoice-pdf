import { FileText, Download, Share2, Globe, Star, CheckCircle, Users, Zap } from 'lucide-react';
import Link from 'next/link';

interface LocaleContent {
  title: string;
  subtitle: string;
  features: {
    title: string;
    description: string;
  }[];
  templates: {
    title: string;
    subtitle: string;
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: {
      text: string;
      author: string;
      role: string;
    }[];
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
}

const content: Record<string, LocaleContent> = {
  en: {
    title: "InvoicePDF",
    subtitle: "Create professional invoices with ease. Generate beautiful PDF invoices, manage templates, and share with your clients in seconds.",
    features: [
      {
        title: "Lightning Fast",
        description: "Generate professional invoices in seconds with our optimized templates and streamlined workflow."
      },
      {
        title: "Professional Templates",
        description: "Choose from multiple professional templates designed to impress your clients and maintain brand consistency."
      },
      {
        title: "Multi-Language",
        description: "Support for multiple languages and currencies to serve clients worldwide."
      },
      {
        title: "PDF Export",
        description: "Export invoices as high-quality PDFs that look professional on any device."
      },
      {
        title: "Easy Sharing",
        description: "Share invoices via email, Google Drive, or generate shareable links for your clients."
      },
      {
        title: "No Registration",
        description: "Start creating invoices immediately without any registration or setup required."
      }
    ],
    templates: {
      title: "Professional Invoice Templates",
      subtitle: "Choose from our collection of beautiful, professional templates"
    },
    testimonials: {
      title: "What Our Users Say",
      subtitle: "Trusted by freelancers and businesses worldwide",
      items: [
        {
          text: "InvoicePDF has streamlined our invoicing process completely. The templates are professional and the PDF quality is excellent.",
          author: "Sarah Johnson",
          role: "Freelance Designer"
        },
        {
          text: "Perfect for our small business. No registration required and the invoices look exactly like what we need.",
          author: "Mike Chen",
          role: "Startup Founder"
        },
        {
          text: "The multi-language support is fantastic. We can easily create invoices for our international clients.",
          author: "Maria Rodriguez",
          role: "Consultant"
        }
      ]
    },
    cta: {
      title: "Ready to Create Professional Invoices?",
      subtitle: "Start generating beautiful invoices in minutes, completely free.",
      button: "Get Started Now"
    }
  },
  de: {
    title: "InvoicePDF",
    subtitle: "Erstellen Sie professionelle Rechnungen mit Leichtigkeit. Generieren Sie schöne PDF-Rechnungen, verwalten Sie Vorlagen und teilen Sie sie in Sekunden mit Ihren Kunden.",
    features: [
      {
        title: "Blitzschnell",
        description: "Generieren Sie professionelle Rechnungen in Sekunden mit unseren optimierten Vorlagen und optimierten Workflow."
      },
      {
        title: "Professionelle Vorlagen",
        description: "Wählen Sie aus mehreren professionellen Vorlagen, die entwickelt wurden, um Ihre Kunden zu beeindrucken und die Markenkonsistenz zu wahren."
      },
      {
        title: "Mehrsprachig",
        description: "Unterstützung für mehrere Sprachen und Währungen, um Kunden weltweit zu bedienen."
      },
      {
        title: "PDF-Export",
        description: "Exportieren Sie Rechnungen als hochwertige PDFs, die auf jedem Gerät professionell aussehen."
      },
      {
        title: "Einfaches Teilen",
        description: "Teilen Sie Rechnungen per E-Mail, Google Drive oder generieren Sie teilbare Links für Ihre Kunden."
      },
      {
        title: "Keine Registrierung",
        description: "Beginnen Sie sofort mit der Erstellung von Rechnungen ohne Registrierung oder Einrichtung."
      }
    ],
    templates: {
      title: "Professionelle Rechnungsvorlagen",
      subtitle: "Wählen Sie aus unserer Sammlung schöner, professioneller Vorlagen"
    },
    testimonials: {
      title: "Was unsere Nutzer sagen",
      subtitle: "Vertraut von Freiberuflern und Unternehmen weltweit",
      items: [
        {
          text: "InvoicePDF hat unseren Rechnungsprozess vollständig optimiert. Die Vorlagen sind professionell und die PDF-Qualität ist ausgezeichnet.",
          author: "Sarah Johnson",
          role: "Freiberufliche Designerin"
        },
        {
          text: "Perfekt für unser kleines Unternehmen. Keine Registrierung erforderlich und die Rechnungen sehen genau so aus, wie wir es brauchen.",
          author: "Mike Chen",
          role: "Startup-Gründer"
        },
        {
          text: "Die mehrsprachige Unterstützung ist fantastisch. Wir können leicht Rechnungen für unsere internationalen Kunden erstellen.",
          author: "Maria Rodriguez",
          role: "Beraterin"
        }
      ]
    },
    cta: {
      title: "Bereit, professionelle Rechnungen zu erstellen?",
      subtitle: "Beginnen Sie mit der Generierung schöner Rechnungen in Minuten, völlig kostenlos.",
      button: "Jetzt starten"
    }
  },
  fr: {
    title: "InvoicePDF",
    subtitle: "Créez des factures professionnelles facilement. Générez de belles factures PDF, gérez les modèles et partagez avec vos clients en quelques secondes.",
    features: [
      {
        title: "Ultra Rapide",
        description: "Générez des factures professionnelles en quelques secondes avec nos modèles optimisés et notre flux de travail rationalisé."
      },
      {
        title: "Modèles Professionnels",
        description: "Choisissez parmi plusieurs modèles professionnels conçus pour impressionner vos clients et maintenir la cohérence de la marque."
      },
      {
        title: "Multilingue",
        description: "Support pour plusieurs langues et devises pour servir les clients du monde entier."
      },
      {
        title: "Export PDF",
        description: "Exportez les factures en PDF haute qualité qui ont l'air professionnel sur n'importe quel appareil."
      },
      {
        title: "Partage Facile",
        description: "Partagez les factures par e-mail, Google Drive ou générez des liens partageables pour vos clients."
      },
      {
        title: "Aucune Inscription",
        description: "Commencez à créer des factures immédiatement sans inscription ni configuration requise."
      }
    ],
    templates: {
      title: "Modèles de Factures Professionnels",
      subtitle: "Choisissez parmi notre collection de beaux modèles professionnels"
    },
    testimonials: {
      title: "Ce que disent nos utilisateurs",
      subtitle: "Fait confiance par les freelances et les entreprises du monde entier",
      items: [
        {
          text: "InvoicePDF a complètement rationalisé notre processus de facturation. Les modèles sont professionnels et la qualité PDF est excellente.",
          author: "Sarah Johnson",
          role: "Designer Freelance"
        },
        {
          text: "Parfait pour notre petite entreprise. Aucune inscription requise et les factures ressemblent exactement à ce dont nous avons besoin.",
          author: "Mike Chen",
          role: "Fondateur de Startup"
        },
        {
          text: "Le support multilingue est fantastique. Nous pouvons facilement créer des factures pour nos clients internationaux.",
          author: "Maria Rodriguez",
          role: "Consultante"
        }
      ]
    },
    cta: {
      title: "Prêt à créer des factures professionnelles ?",
      subtitle: "Commencez à générer de belles factures en quelques minutes, complètement gratuitement.",
      button: "Commencer maintenant"
    }
  }
};

export default function LocaleAboutPage({ params }: { params: { locale: string } }) {
  const locale = params.locale || 'en';
  const contentData = content[locale] || content.en;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">{contentData.title}</h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {contentData.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                {contentData.cta.button}
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
              Why Choose InvoicePDF?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional invoice generation made simple and efficient
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contentData.features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {contentData.templates.title}
            </h2>
            <p className="text-lg text-gray-600">
              {contentData.templates.subtitle}
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
              {contentData.testimonials.title}
            </h2>
            <p className="text-lg text-gray-600">
              {contentData.testimonials.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {contentData.testimonials.items.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {contentData.cta.title}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {contentData.cta.subtitle}
          </p>
          <Link 
            href="/"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            {contentData.cta.button}
          </Link>
        </div>
      </section>
    </div>
  );
}
