import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginRequest } from '../../types';
import { ROUTES, VALIDATION_MESSAGES } from '../../utils/constants';

const LoginForm = () => {
  const { login, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    await login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md">
      <div>
        <label htmlFor="email" className="form-label">
          E-posta
        </label>
        <input
          id="email"
          type="email"
          className={`form-input ${errors.email ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
          {...register('email', {
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
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="form-label">
            Şifre
          </label>
        </div>
        <input
          id="password"
          type="password"
          className={`form-input ${errors.password ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
          {...register('password', {
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
        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-primary py-2.5 relative"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
              Giriş yapılıyor...
            </span>
          ) : (
            'Giriş Yap'
          )}
        </button>
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-slate-600">
          Hesabınız yok mu?{' '}
          <Link to={ROUTES.REGISTER} className="text-primary-600 font-medium hover:text-primary-500">
            Buradan kayıt olun
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;