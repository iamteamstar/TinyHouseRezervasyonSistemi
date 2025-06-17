import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterRequest } from '../../types';
import { ROUTES, VALIDATION_MESSAGES } from '../../utils/constants';

const RegisterForm = () => {
  const { register, loading } = useAuth();
  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterRequest & { confirmPassword: string }>();
  
  const password = watch('password', '');

  const onSubmit = async (data: RegisterRequest & { confirmPassword: string }) => {
    const { confirmPassword, ...registerData } = data;
    await register(registerData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md">
      <div>
        <label htmlFor="fullName" className="form-label">
          Ad Soyad
        </label>
        <input
          id="fullName"
          type="text"
          className={`form-input ${errors.fullName ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
          {...registerField('fullName', {
            required: VALIDATION_MESSAGES.REQUIRED,
          })}
        />
        {errors.fullName && (
          <p className="form-error">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="form-label">
          E-posta
        </label>
        <input
          id="email"
          type="email"
          className={`form-input ${errors.email ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
          {...registerField('email', {
            required: VALIDATION_MESSAGES.REQUIRED,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: VALIDATION_MESSAGES.EMAIL,
            },
          })}
        />
        {errors.email && (
          <p className="form-error">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="form-label">
          Şifre
        </label>
        <input
          id="password"
          type="password"
          className={`form-input ${errors.password ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
          {...registerField('password', {
            required: VALIDATION_MESSAGES.REQUIRED,
            minLength: {
              value: 6,
              message: VALIDATION_MESSAGES.PASSWORD_MIN,
            },
          })}
        />
        {errors.password && (
          <p className="form-error">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="form-label">
          Şifre Tekrar
        </label>
        <input
          id="confirmPassword"
          type="password"
          className={`form-input ${errors.confirmPassword ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
          {...registerField('confirmPassword', {
            required: VALIDATION_MESSAGES.REQUIRED,
            validate: value => value === password || VALIDATION_MESSAGES.PASSWORD_MATCH,
          })}
        />
        {errors.confirmPassword && (
          <p className="form-error">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="roleId" className="form-label">
          Hesap Türü
        </label>
        <select
          id="roleId"
          className={`form-input ${errors.roleId ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
          {...registerField('roleId', {
            required: VALIDATION_MESSAGES.REQUIRED,
            valueAsNumber: true,
          })}
        >
          <option value="">Hesap türünü seçin</option>
          <option value="2">Ev Sahibi</option>
          <option value="3">Kiracı</option>
        </select>
        {errors.roleId && (
          <p className="form-error">{errors.roleId.message}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-primary py-2.5 relative"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
              Kayıt olunuyor...
            </span>
          ) : (
            'Kayıt Ol'
          )}
        </button>
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-slate-600">
          Zaten hesabınız var mı?{' '}
          <Link to={ROUTES.LOGIN} className="text-primary-600 font-medium hover:text-primary-500">
            Buradan giriş yapın
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;