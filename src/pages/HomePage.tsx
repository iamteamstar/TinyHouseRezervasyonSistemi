import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { House } from '../types';
import HouseCard from '../components/common/HouseCard';
import { Search, ArrowRight, Home, Calendar } from 'lucide-react';
import { ROUTES } from '../utils/constants';

const HomePage: React.FC = () => {
  const [featuredHouses, setFeaturedHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHouses = async () => {
      setLoading(true);
      try {
        // Axios ile GET isteği
        const response = await axios.get('https://localhost:7069/api/House');
        const housesData = response.data;
        
        // API'den gelen veriyi dönüştür: houseId -> id
        const houses = housesData.map((house: any) => ({
          ...house,
          id: house.houseId // houseId'yi id olarak kullan
        }));
        
        // DEBUG: Dönüştürülmüş veriyi kontrol et
        console.log('Transformed houses:', houses);
        console.log('First house ID:', houses[0]?.id);
        
        // Öne çıkan bölüm için en fazla 3 ev al
        setFeaturedHouses(houses.slice(0, 3));
      } catch (error) {
        console.error('Evler yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHouses();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Bölümü */}
      <section className="relative bg-gradient-to-r from-primary-900 to-primary-700 text-white">
        <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg)',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40 z-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight animate-fade-in">
              Mükemmel Evinizi Evden Uzakta Bulun
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Rahat kulübelerden lüks villalara kadar benzersiz konaklama yerlerini keşfedin.
            </p>
            <div className="bg-white rounded-lg p-2 shadow-lg md:max-w-2xl animate-slide-up flex flex-col sm:flex-row" style={{ animationDelay: '0.2s' }}>
              <div className="relative flex-grow p-2">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Nerede kalmak istiyorsunuz?"
                  className="w-full pl-10 pr-4 py-3 rounded-md border-0 focus:ring-2 focus:ring-primary-500 text-slate-900"
                />
              </div>
              <Link
                to={ROUTES.HOUSES}
                className="mt-2 sm:mt-0 sm:ml-2 btn btn-primary py-3 px-6 whitespace-nowrap"
              >
                Ev Bul
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Öne Çıkan Evler */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Öne Çıkan Mülkler</h2>
          <Link
            to={ROUTES.HOUSES}
            className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <span>Tümünü gör</span>
            <ArrowRight className="ml-1 w-5 h-5" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : featuredHouses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHouses.map((house) => {
              // DEBUG: Her ev için ID'yi kontrol et
              console.log('House ID:', house.id, 'House:', house);
              return <HouseCard key={house.id} house={house} />;
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-slate-100 inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
              <Home className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Henüz Mülk Yok</h3>
            <p className="text-slate-600 max-w-md mx-auto mb-6">
              Platformumuza mülk ekleyen ilk kişi olun. Alanınızı listeleyerek başlayın.
            </p>
            <Link to={ROUTES.ADD_HOUSE} className="btn btn-primary">
              Mülkünüzü Ekleyin
            </Link>
          </div>
        )}
      </section>

      {/* Nasıl Çalışır */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-12">
            MiniEvSistemi Nasıl Çalışır
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-100 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <Search className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Mükemmel Yeri Bulun</h3>
              <p className="text-slate-600">
                Özenle seçilmiş mülk listemize göz atın ve ideal kaçış noktanızı bulun.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-100 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <Calendar className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Anında Rezervasyon</h3>
              <p className="text-slate-600">
                Müsaitliği kontrol edin, tarihlerinizi seçin ve sadece birkaç tıkla konaklamanızı rezerve edin.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-100 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <Home className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Konaklamanızın Tadını Çıkarın</h3>
              <p className="text-slate-600">
                Geçici evinizin anahtarlarını alın ve rahat, sorunsuz bir konaklama deneyimi yaşayın.
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link to={ROUTES.REGISTER} className="btn btn-primary px-8 py-3">
              Başlayın
            </Link>
          </div>
        </div>
      </section>
      {/* CTA Bölümü */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary-600 rounded-xl overflow-hidden shadow-xl">
            <div className="relative px-6 py-10 sm:px-12 sm:py-16 md:py-20 md:px-16 text-white">
              <div className="relative max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  MiniEvSistemi ile Ev Sahibi Olun
                </h2>
                <p className="text-lg md:text-xl mb-8 text-primary-100">
                  Ekstra alanınızı ekstra gelire dönüştürün. Evlerini paylaşarak kazanan binlerce ev sahibine katılın.
                </p>
                <Link
                  to={ROUTES.REGISTER}
                  className="inline-block bg-white text-primary-700 font-semibold px-6 py-3 rounded-md shadow-sm hover:bg-primary-50 transition-colors"
                >
                  Bugün Ev Sahibi Olmaya Başlayın
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;