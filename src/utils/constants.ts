// API URL
export const API_URL = '/api';

// Roller
export const ROLES = {
  ADMIN: 1,
  HOUSE_OWNER: 2,
  TENANT: 3,
};

// Rezervasyon durumları
export const RESERVATION_STATUS = {
  PENDING: 'Beklemede',
  APPROVED: 'Onaylandı',
  CANCELLED: 'İptal Edildi',
  COMPLETED: 'Tamamlandı',
};

// Varsayılan ev resmi
export const DEFAULT_HOUSE_IMAGE = 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg';

// Kullanıcı avatarı için yer tutucu
export const DEFAULT_AVATAR = 'https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg';

// Rotalar
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  HOUSES: '/houses',
  HOUSE_DETAILS: '/houses/:id',
  ADD_HOUSE: '/add-house',
  EDIT_HOUSE: '/edit-house/:id',
  RESERVATIONS: '/reservations',
  ADMIN_RESERVATIONS: '/admin/reservations',
  OWNER_RESERVATIONS: '/owner/reservations',
  PROFILE: '/profile',
  ADD_REVIEW: '/add-review/:houseId',
  MANAGE_AVAILABILITY: '/manage-availability/:houseId',
  ADMIN_USERS: "/admin/users"
  
};



// Form doğrulama mesajları
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Bu alan zorunludur',
  EMAIL: 'Lütfen geçerli bir e-posta adresi girin',
  PASSWORD_MIN: 'Şifre en az 6 karakter olmalıdır',
  PASSWORD_MATCH: 'Şifreler eşleşmiyor',
  PRICE_MIN: 'Fiyat 0\'dan büyük olmalıdır',
  NUMERIC: 'Bu alan sayı olmalıdır',
  DATE_VALID: 'Lütfen geçerli bir tarih girin',
  DATE_FUTURE: 'Tarih gelecekte olmalıdır',
  END_DATE_AFTER_START: 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır',
  RATING_RANGE: 'Puan 1 ile 5 arasında olmalıdır',
};