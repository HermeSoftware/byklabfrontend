import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const signupSchema = z.object({
  full_name: z.string().min(2, 'İsim en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir email adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
  confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirm_password']
});

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/signup`, {
        full_name: data.full_name,
        email: data.email,
        password: data.password
      });
      login(response.data);
      toast.success('Hesabınız oluşturuldu!');
      navigate('/pricing');
    } catch (err) {
      setError(err.response?.data?.detail || 'Kayıt başarısız oldu');
      toast.error('Kayıt başarısız');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" data-testid="signup-page">
      <div className="absolute inset-0 hero-gradient grid-overlay"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-2">
            <img 
              src="https://customer-assets.emergentagent.com/job_1d4b7ef8-6e29-408d-bb4a-e182899bb9e0/artifacts/yl97fd2i_logo.png" 
              alt="BYK LAB" 
              className="h-12 w-12"
            />
            <span className="text-2xl font-bold text-white">BYK LAB</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-4">Kayıt Ol</h1>
          <p className="text-sm text-gray-400 mt-2">Yeni hesap oluşturun</p>
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-8" data-testid="signup-form">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start space-x-3" data-testid="signup-error">
              <AlertCircle className="text-red-500 mt-0.5" size={18} />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ad Soyad
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  {...register('full_name')}
                  type="text"
                  data-testid="fullname-input"
                  className="w-full pl-10 pr-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0f6e32] focus:border-transparent transition-colors"
                  placeholder="Ahmet Yılmaz"
                />
              </div>
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-500" data-testid="fullname-error">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  {...register('email')}
                  type="email"
                  data-testid="email-input"
                  className="w-full pl-10 pr-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0f6e32] focus:border-transparent transition-colors"
                  placeholder="ornek@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500" data-testid="email-error">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  {...register('password')}
                  type="password"
                  data-testid="password-input"
                  className="w-full pl-10 pr-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0f6e32] focus:border-transparent transition-colors"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500" data-testid="password-error">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Şifre Tekrar
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  {...register('confirm_password')}
                  type="password"
                  data-testid="confirm-password-input"
                  className="w-full pl-10 pr-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0f6e32] focus:border-transparent transition-colors"
                  placeholder="••••••••"
                />
              </div>
              {errors.confirm_password && (
                <p className="mt-1 text-sm text-red-500" data-testid="confirm-password-error">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              data-testid="signup-submit-button"
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Hesap Oluşturuluyor...' : 'Kayıt Ol'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Zaten hesabınız var mı?{' '}
              <Link to="/login" className="text-[#0f6e32] hover:underline" data-testid="login-link">
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;