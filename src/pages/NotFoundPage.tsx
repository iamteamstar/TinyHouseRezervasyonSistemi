import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto w-24 h-24 bg-slate-100 flex items-center justify-center rounded-full mb-6">
          <span className="text-5xl font-bold text-primary-600">404</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Sayfa Bulunamadı</h1>
        <p className="text-slate-600 max-w-md mx-auto mb-8">
          Aradığınız sayfa kaldırılmış olabilir veya geçici olarak kullanılamıyor olabilir.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn btn-primary">
            <Home className="w-4 h-4 mr-2" />
            Ana Sayfaya Git
          </Link>
          <button onClick={() => window.history.back()} className="btn btn-outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;