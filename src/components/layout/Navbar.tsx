import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/constants';
import { 
  Home, 
  User, 
  LogOut, 
  Calendar, 
  PlusCircle, 
  List,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout, isAdmin, isHouseOwner, isTenant } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinkClasses = (path: string) => {
    return `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
      isActive(path)
        ? 'bg-primary-500 text-white font-medium'
        : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700'
    }`;
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={ROUTES.HOME} className="flex items-center gap-2">
              <Home className="w-6 h-6 text-primary-600" />
              <span className="font-bold text-primary-600 text-xl">MiniEvSistemi</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link to={ROUTES.DASHBOARD} className={navLinkClasses(ROUTES.DASHBOARD)}>
                  Kontrol Paneli
                </Link>
                <Link to={ROUTES.HOUSES} className={navLinkClasses(ROUTES.HOUSES)}>
                  Evler
                </Link>
                {(isHouseOwner || isAdmin) && (
                  <Link to={ROUTES.ADD_HOUSE} className={navLinkClasses(ROUTES.ADD_HOUSE)}>
                    <PlusCircle className="w-4 h-4" />
                    <span>Ev Ekle</span>
                  </Link>
                )}
                {isTenant && (
                  <Link to={ROUTES.RESERVATIONS} className={navLinkClasses(ROUTES.RESERVATIONS)}>
                    <Calendar className="w-4 h-4" />
                    <span>Rezervasyonlarım</span>
                  </Link>
                )}
                {isHouseOwner && (
                  <Link to={ROUTES.OWNER_RESERVATIONS} className={navLinkClasses(ROUTES.OWNER_RESERVATIONS)}>
                    <Calendar className="w-4 h-4" />
                    <span>Rezervasyonlar</span>
                  </Link>
                )}
                {isAdmin && (
                  <Link to={ROUTES.ADMIN_RESERVATIONS} className={navLinkClasses(ROUTES.ADMIN_RESERVATIONS)}>
                    <List className="w-4 h-4" />
                    <span>Tüm Rezervasyonlar</span>
                  </Link>
                )}
                {isAdmin && (
           <Link to={ROUTES.ADMIN_USERS} className={navLinkClasses(ROUTES.ADMIN_USERS)}>
                 <User className="w-4 h-4" />
                               <span>Kullanıcılar</span>
                                    </Link>
                )}

                <div className="relative ml-4 flex items-center">
                  <div className="flex items-center gap-3">
                    <Link to={ROUTES.PROFILE} className="flex items-center gap-2">
                      <User className="w-5 h-5 text-slate-600" />
                      <span className="text-slate-600">{currentUser.fullName}</span>
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-1 text-error-600 hover:text-error-800 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Çıkış</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className={navLinkClasses(ROUTES.LOGIN)}>
                  Giriş Yap
                </Link>
                <Link to={ROUTES.REGISTER} className="btn btn-primary">
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-primary-600 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {currentUser ? (
              <>
                <Link
                  to={ROUTES.DASHBOARD}
                  className={`${navLinkClasses(ROUTES.DASHBOARD)} block`}
                  onClick={closeMenu}
                >
                  Kontrol Paneli
                </Link>
                <Link
                  to={ROUTES.HOUSES}
                  className={`${navLinkClasses(ROUTES.HOUSES)} block`}
                  onClick={closeMenu}
                >
                  Evler
                </Link>
                {(isHouseOwner || isAdmin) && (
                  <Link
                    to={ROUTES.ADD_HOUSE}
                    className={`${navLinkClasses(ROUTES.ADD_HOUSE)} block`}
                    onClick={closeMenu}
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Ev Ekle</span>
                  </Link>
                )}
                {isTenant && (
                  <Link
                    to={ROUTES.RESERVATIONS}
                    className={`${navLinkClasses(ROUTES.RESERVATIONS)} block`}
                    onClick={closeMenu}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Rezervasyonlarım</span>
                  </Link>
                )}
                {isHouseOwner && (
                  <Link
                    to={ROUTES.OWNER_RESERVATIONS}
                    className={`${navLinkClasses(ROUTES.OWNER_RESERVATIONS)} block`}
                    onClick={closeMenu}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Rezervasyonlar</span>
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to={ROUTES.ADMIN_RESERVATIONS}
                    className={`${navLinkClasses(ROUTES.ADMIN_RESERVATIONS)} block`}
                    onClick={closeMenu}
                  >
                    <List className="w-4 h-4" />
                    <span>Tüm Rezervasyonlar</span>
                  </Link>
                )}
                <Link
                  to={ROUTES.PROFILE}
                  className={`${navLinkClasses(ROUTES.PROFILE)} block`}
                  onClick={closeMenu}
                >
                  <User className="w-4 h-4" />
                  <span>Profil</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 rounded-md text-error-600 hover:bg-error-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Çıkış</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className={`${navLinkClasses(ROUTES.LOGIN)} block`}
                  onClick={closeMenu}
                >
                  Giriş Yap
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                  onClick={closeMenu}
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;