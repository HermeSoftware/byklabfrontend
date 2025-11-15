import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import axios from 'axios';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/subscriptions/plans`);
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    if (!user) {
      navigate('/signup');
      return;
    }
    if (plan.price === 0) {
      return;
    }
    navigate('/payment', { state: { plan } });
  };

  const getPlanColor = (planId) => {
    const colors = {
      free: 'from-gray-600 to-gray-700',
      basic: 'from-blue-600 to-blue-700',
      advanced: 'from-[#0f6e32] to-[#0d5c2a]',
      comprehensive: 'from-purple-600 to-purple-700'
    };
    return colors[planId] || 'from-gray-600 to-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="skeleton w-32 h-32 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="pricing-page">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" data-testid="pricing-title">
              Size Uygun Planı Seçin
            </h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
              İhtiyacınıza en uygun paketi seçin ve hemen başlayın
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative glass rounded-2xl p-8 border-2 ${
                  plan.id === 'advanced' ? 'border-[#0f6e32] neon-glow' : 'border-transparent'
                } hover:border-[#0f6e32] transition-all`}
                data-testid={`pricing-card-${plan.id}`}
              >
                {plan.id === 'advanced' && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#0f6e32] to-[#0d5c2a] text-white px-4 py-1 rounded-full text-xs font-semibold">
                    Popüler
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2" data-testid={`plan-name-${plan.id}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold text-[#0f6e32]" data-testid={`plan-price-${plan.id}`}>
                      {plan.price}₺
                    </span>
                    <span className="text-gray-400 text-sm">/ ay</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3" data-testid={`plan-feature-${plan.id}-${idx}`}>
                      <Check className="text-[#0f6e32] mt-0.5 flex-shrink-0" size={18} />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan)}
                  data-testid={`select-plan-button-${plan.id}`}
                  className={`w-full py-3 rounded-full font-semibold transition-all ${
                    plan.id === 'advanced'
                      ? 'bg-[#0f6e32] text-white hover:bg-[#0d5c2a] neon-glow'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  } ${
                    plan.price === 0 ? 'cursor-default opacity-60' : ''
                  }`}
                  disabled={plan.price === 0}
                >
                  {plan.price === 0 ? 'Mevcut Plan' : 'Abone Ol'}
                </button>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Sorularınız mı var?
            </h2>
            <p className="text-gray-400 mb-6">
              Bizimle iletişime geçmekten çekinmeyin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+905314681333"
                className="inline-block px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                data-testid="contact-phone"
              >
                +90 531 468 13 33
              </a>
              <a
                href="mailto:iletisim@byklab.com"
                className="inline-block px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                data-testid="contact-email"
              >
                iletisim@byklab.com
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;