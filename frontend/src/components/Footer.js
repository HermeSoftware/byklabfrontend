import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="glass border-t border-gray-800 mt-20" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="https://customer-assets.emergentagent.com/job_1d4b7ef8-6e29-408d-bb4a-e182899bb9e0/artifacts/yl97fd2i_logo.png" 
                alt="BYK LAB" 
                className="h-10 w-10"
              />
              <span className="text-xl font-bold text-white">BYK LAB</span>
            </div>
            <p className="text-sm text-gray-400">
              Bilimsel performans platformu
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link to="/anatomy" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Egzersizler
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Fiyatlandırma
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold mb-4">Özellikler</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-400">Biyomekanik Analiz</li>
              <li className="text-sm text-gray-400">Kas Aktivasyonu</li>
              <li className="text-sm text-gray-400">Fizyoterapi</li>
              <li className="text-sm text-gray-400">Performans Takibi</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-gray-400">
                <Phone size={16} />
                <a href="tel:+905314681333" className="hover:text-white transition-colors">
                  +90 531 468 13 33
                </a>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-400">
                <Mail size={16} />
                <a href="mailto:iletisim@byklab.com" className="hover:text-white transition-colors">
                  iletisim@byklab.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2025 BYK LAB. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};