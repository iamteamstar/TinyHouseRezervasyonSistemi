# Tiny House Rezervasyon ve Yönetim Sistemi — Frontend

Bu proje, Tiny House konseptli evlerin rezervasyon ve yönetimini sağlayan bir web uygulamasının **frontend** (kullanıcı arayüzü) kısmıdır. Kiracılar, ev ilanlarını inceleyip rezervasyon yapabilirken; ev sahipleri ilanlarını yönetebilir. Adminler ise sistemin tamamını kontrol eder.

---

## 🔧 Kullanılan Teknolojiler

- **Framework:** [React.js](https://reactjs.org/)
- **Yapılandırma Aracı:** [Vite](https://vitejs.dev/)
- **Programlama Dili:** TypeScript
- **Stil:** Tailwind CSS
- **Durum Yönetimi:** Context API 
- **Paket Yöneticisi:** npm

---

## 🚀 Kurulum ve Çalıştırma

Projenin klonlanıp çalıştırılması için şu adımları takip edin:

```bash
# 1. Depoyu klonlayın
git clone https://github.com/kullaniciadi/MiniEvFrontEnd.git
cd MiniEvFrontEnd

# 2. Bağımlılıkları yükleyin
npm install

# 3. Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcıdan `http://localhost:5173` adresine giderek uygulamayı görebilirsiniz.

---

## 👥 Kullanıcı Rolleri ve Özellikler

### 🔹 Kiracı
- Ev ilanlarını görüntüleyebilir
- Tarih seçerek rezervasyon yapabilir
- Ödeme işlemlerini gerçekleştirebilir
- Geçmiş rezervasyonlarını görebilir
- Değerlendirme (puan + yorum) ekleyebilir

### 🔹 Ev Sahibi
- Kendi ilanlarını ekleyebilir ve düzenleyebilir
- Rezervasyon taleplerini kabul/red edebilir
- Yorumları görebilir ve cevaplayabilir
- Gelir raporlarını görüntüleyebilir

### 🔹 Admin
- Tüm kullanıcıları ve ilanları yönetebilir
- Rezervasyonları iptal edebilir
- İstatistiksel raporlamaları görebilir

---

## 🗂️ Proje Yapısı

```
MiniEvFrontEnd/
├── public/                 # Statik dosyalar
├── src/
│   ├── components/         # UI bileşenleri
│   ├── pages/              # Sayfalar (kiracı, ev sahibi, admin)
│   ├── services/           # API istekleri
│   ├── hooks/              # Özel React hook'ları
│   ├── context/            # Context API ile yönetilen global durum
│   ├── utils/              # Yardımcı fonksiyonlar
│   └── App.tsx             # Ana uygulama bileşeni
├── tailwind.config.js      # Tailwind yapılandırması
├── vite.config.ts          # Vite yapılandırması
└── package.json            # Bağımlılıklar ve komutlar
```

---

## 🧪 Test ve Geliştirme

- Projeye test frameworkü dahil değilse, önerilen: `Vitest`, `React Testing Library`
- Geliştirme yaparken Tailwind sınıflarını kullanarak stil verilebilir
- Sayfa yönlendirmeleri için `react-router-dom` kullanılabilir

---

## 📄 Notlar

- Bu frontend proje, backend API'ler ile haberleşmektedir. API URL'leri `.env` dosyasından yapılandırılmalıdır.
- Veritabanı, stored procedure ve trigger gibi işlemler backend tarafında yer almaktadır.
- Geliştirme sırasında UI bileşenlerinin her rol için özelleştirildiğinden emin olun.

---

## 📬 İletişim

Geliştirici: [Azad Koçak]  
İletişim: [azadkocak29@gmail.com]  
Proje Sorumlusu: Arş. Gör. Tuğba ÇELİKTEN  

---

## 📝 Lisans

Bu proje MIT lisansı ile lisanslanmıştır.
