import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Zap, Award } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const About = () => {
  const values = [
    {
      icon: <Target size={32} />,
      title: 'Misyon',
      description: 'Bilimsel metodolojiler ile herkesin performansını optimize etmek ve sağlıklı bir yaşam sürmesine yardımcı olmak.'
    },
    {
      icon: <Users size={32} />,
      title: 'Vizyon',
      description: 'Türkiye\'nin en gelişmiş dijital spor bilimi platformu olmak ve uluslararası alanda öncü bir konum elde etmek.'
    },
    {
      icon: <Zap size={32} />,
      title: 'Teknoloji',
      description: 'En son teknolojileri kullanarak, veri odaklı ve kişiselleştirilmiş antrenman çözümleri sunmak.'
    },
    {
      icon: <Award size={32} />,
      title: 'Kalite',
      description: 'Her zaman bilimsel kanıtlara dayalı, güvenilir ve etkili çözümler üretmek.'
    }
  ];

  const team = [
    {
      name: 'Dr. Ahmet Yılmaz',
      role: 'Kurucu & Spor Bilimci',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'
    },
    {
      name: 'Prof. Ayşe Demir',
      role: 'Biyomekanik Uzmanı',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400'
    },
    {
      name: 'Ft. Mehmet Kaya',
      role: 'Fizyoterapist',
      image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400'
    },
    {
      name: 'Dr. Zeynep Öztürk',
      role: 'Performans Koçu',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400'
    }
  ];

  return (
    <div className="min-h-screen" data-testid="about-page">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6" data-testid="about-title">
              Hakkımızda
            </h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
              BYK LAB, spor bilimi, biyomekanik analiz ve fizyoterapi temelleri üzerine inşa edilmiş 
              dijital bir performans laboratuvarıdır. Amacımız, bilimsel yöntemler kullanarak 
              herkesin potansiyelini maksimize etmesine yardımcı olmaktır.
            </p>
          </motion.div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="dashboard-card text-center"
                data-testid={`value-card-${index}`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0f6e32]/10 text-[#0f6e32] mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Story Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 sm:p-12 mb-20"
            data-testid="story-section"
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Hikayemiz
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  BYK LAB, 2024 yılında spor bilimi ve teknoloji tutkunu bir ekip tarafından kuruldu. 
                  Kuruluş fikri, modern spor biliminin ve dijital teknolojilerin birleştirilmesiyle 
                  herkese erişilebilir, kişiselleştirilmiş antrenman çözümleri sunma vizyonundan doğdu.
                </p>
                <p>
                  Bugün 10.000'den fazla kullanıcıya hizmet veren BYK LAB, biyomekanik analiz, 
                  EMG tabanlı kas aktivasyon takibi, kişiselleştirilmiş egzersiz programları ve 
                  fizyoterapi destekli rehabilitasyon hizmetleri sunmaktadır.
                </p>
                <p>
                  Misyonumuz, bilimi herkesin anlayabileceği ve uygulayabileceği bir şekilde sunarak, 
                  toplumun sağlık ve performans seviyesini yükseltmektir.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Ekibimiz
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="dashboard-card text-center"
                  data-testid={`team-member-${index}`}
                >
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-400">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 text-center neon-glow"
            data-testid="cta-section"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Bize Katılın
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Performansınızı bilimsel yöntemlerle optimize etmeye hazır mısınız?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                data-testid="cta-signup"
                className="btn-primary neon-glow"
              >
                Hemen Başla
              </a>
              <a
                href="/pricing"
                data-testid="cta-pricing"
                className="px-8 py-3 rounded-full border-2 border-[#0f6e32] text-white hover:bg-[#0f6e32]/10 transition-colors"
              >
                Planları İncele
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;