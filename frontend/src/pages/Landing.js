import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Target, TrendingUp, Zap } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const Landing = () => {
  const features = [
    {
      icon: <Activity className="w-8 h-8" />,
      title: 'Biyomekanik Analiz',
      description: 'Hareket paternlerinizi bilimsel metodlarla analiz edin'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Kas Aktivasyonu',
      description: 'EMG teknolojisi ile kas aktivasyonunu ölçün ve optimize edin'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Performans Takibi',
      description: 'Gelişiminizi data-driven yöntemlerle takip edin'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Kişisel Plan',
      description: 'Size özel egzersiz ve beslenme programları'
    }
  ];

  const stats = [
    { value: '10.000+', label: 'Aktif Kullanıcı' },
    { value: '500+', label: 'Egzersiz Video' },
    { value: '%95', label: 'Memnuniyet' },
    { value: '24/7', label: 'Destek' }
  ];

  return (
    <div className="min-h-screen" data-testid="landing-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
        {/* Background Effects */}
        <div className="absolute inset-0 hero-gradient grid-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6" data-testid="hero-title">
              Bilimsel Performans
              <span className="block text-[#0f6e32] mt-2">Laboratuvarı</span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-8" data-testid="hero-subtitle">
              Spor bilimi, biyomekanik analiz ve fizyoterapi temelleri üzerine inşa edilmiş 
              dijital performans platformu. Performansınızı ölçün, bilimi hissedin.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/signup"
                data-testid="hero-cta-button"
                className="btn-primary neon-glow inline-flex items-center space-x-2"
              >
                <span>Hazırsan Başlayalım</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/pricing"
                data-testid="hero-pricing-button"
                className="px-8 py-3 rounded-full border-2 border-[#0f6e32] text-white hover:bg-[#0f6e32]/10 transition-colors"
              >
                Planları Gör
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 glass" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
                data-testid={`stat-${index}`}
              >
                <div className="text-3xl sm:text-4xl font-bold text-[#0f6e32] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Neden BYK LAB?
            </h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
              Teknoloji ve bilim bir araya geldiğinde ortaya çıkan güç
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="dashboard-card text-center"
                data-testid={`feature-card-${index}`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0f6e32]/10 text-[#0f6e32] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 text-center neon-glow"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Gelişimin Burada Başlıyor
            </h2>
            <p className="text-base sm:text-lg text-gray-400 mb-8">
              Bilimsel yöntemlerle hedeflerinize ulaşmanın zamanı geldi
            </p>
            <Link
              to="/signup"
              data-testid="cta-signup-button"
              className="btn-primary neon-glow"
            >
              Ücretsiz Dene
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;