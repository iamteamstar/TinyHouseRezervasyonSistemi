import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <Home className="w-6 h-6 text-primary-600" />
              <span className="font-bold text-primary-600 text-xl">MiniEvSistemi</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Dünyanın dört bir yanındaki benzersiz evlerden oluşan özenle seçilmiş koleksiyonumuzla mükemmel kaçışınızı bulun.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Hızlı Bağlantılar</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-slate-600 hover:text-primary-600 text-sm">Ana Sayfa</Link>
              </li>
              <li>
                <Link to="/houses" className="text-slate-600 hover:text-primary-600 text-sm">Evlere Göz At</Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-600 hover:text-primary-600 text-sm">Hakkımızda</Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-600 hover:text-primary-600 text-sm">İletişim</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Yasal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/privacy" className="text-slate-600 hover:text-primary-600 text-sm">Gizlilik Politikası</Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-600 hover:text-primary-600 text-sm">Hizmet Şartları</Link>
              </li>
              <li>
                <Link to="/cancellation" className="text-slate-600 hover:text-primary-600 text-sm">İptal Politikası</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Bize Ulaşın</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="w-4 h-4" />
                <span>destek@minievistemi.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="w-4 h-4" />
                <span>+90 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-4 mt-4">
                <a href="#" className="text-slate-500 hover:text-primary-600">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-500 hover:text-primary-600">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-500 hover:text-primary-600">
                  <Instagram className="w-5 h-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-200">
          <p className="text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} MiniEvSistemi. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;