import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const paymentSchema = z.object({
  card_number: z.string().length(16, 'Kart numarası 16 haneli olmalı'),
  card_name: z.string().min(3, 'Kart sahibinin adını girin'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Format: AA/YY'),
  cvv: z.string().length(3, 'CVV 3 haneli olmalı')
});

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateSubscription } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const plan = location.state?.plan;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(paymentSchema)
  });

  if (!plan) {
    return <Navigate to="/pricing" replace />;
  }

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      await axios.post(`${BACKEND_URL}/api/subscriptions/activate`, {
        plan_name: plan.name,
        card_number: data.card_number,
        card_name: data.card_name,
        expiry: data.expiry,
        cvv: data.cvv
      });

      updateSubscription(plan.name);
      setSuccess(true);
      toast.success('Aboneliğiniz aktif hale geldi!');

      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      toast.error('Ödeme başarısız oldu');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="payment-success">
        <Navbar />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass rounded-2xl p-12 max-w-md text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#0f6e32]/20 mb-6">
            <CheckCircle className="text-[#0f6e32]" size={48} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Başarılı!
          </h2>
          <p className="text-gray-400 mb-2">
            Aboneliğiniz aktif hale geldi.
          </p>
          <p className="text-sm text-gray-500">
            Dashboard sayfasına yönlendiriliyorsunuz...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="payment-page">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2" data-testid="payment-title">
                Ödeme Bilgileri
              </h1>
              <p className="text-gray-400">
                Güvenli ödeme işlemi (Demo)
              </p>
            </div>

            {/* Plan Summary */}
            <div className="glass rounded-2xl p-6 mb-8" data-testid="plan-summary">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {plan.name} Plan
                  </h3>
                  <p className="text-sm text-gray-400">Aylık abonelik</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#0f6e32]">
                    {plan.price}₺
                  </div>
                  <div className="text-sm text-gray-400">/ ay</div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="glass rounded-2xl p-8" data-testid="payment-form">
              <div className="flex items-center space-x-2 mb-6 text-gray-400">
                <Lock size={18} />
                <span className="text-sm">Güvenli ödeme (Demo Mod)</span>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Kart Numarası
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      {...register('card_number')}
                      type="text"
                      maxLength={16}
                      data-testid="card-number-input"
                      className="w-full pl-10 pr-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0f6e32] focus:border-transparent transition-colors"
                      placeholder="1234567890123456"
                    />
                  </div>
                  {errors.card_number && (
                    <p className="mt-1 text-sm text-red-500" data-testid="card-number-error">
                      {errors.card_number.message}
                    </p>
                  )}
                </div>

                {/* Card Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Kart Üzerindeki İsim
                  </label>
                  <input
                    {...register('card_name')}
                    type="text"
                    data-testid="card-name-input"
                    className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0f6e32] focus:border-transparent transition-colors"
                    placeholder="AHMET YILMAZ"
                  />
                  {errors.card_name && (
                    <p className="mt-1 text-sm text-red-500" data-testid="card-name-error">
                      {errors.card_name.message}
                    </p>
                  )}
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Son Kullanma
                    </label>
                    <input
                      {...register('expiry')}
                      type="text"
                      maxLength={5}
                      data-testid="expiry-input"
                      className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0f6e32] focus:border-transparent transition-colors"
                      placeholder="12/25"
                    />
                    {errors.expiry && (
                      <p className="mt-1 text-sm text-red-500" data-testid="expiry-error">
                        {errors.expiry.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CVV
                    </label>
                    <input
                      {...register('cvv')}
                      type="text"
                      maxLength={3}
                      data-testid="cvv-input"
                      className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0f6e32] focus:border-transparent transition-colors"
                      placeholder="123"
                    />
                    {errors.cvv && (
                      <p className="mt-1 text-sm text-red-500" data-testid="cvv-error">
                        {errors.cvv.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  data-testid="payment-submit-button"
                  className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Ödeme Yapılıyor...' : `${plan.price}₺ Öde`}
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
                Bu bir demo ödeme sistemidir. Gerçek ödeme alınmayacaktır.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Payment;