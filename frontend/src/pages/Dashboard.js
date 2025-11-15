import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Activity, TrendingUp, Clock, Target, Settings, User as UserIcon, LogOut } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/dashboard/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const radialData = [
    {
      name: 'Kas Dengesi',
      value: stats?.muscle_balance || 0,
      fill: '#0f6e32'
    }
  ];

  const statCards = [
    {
      icon: <Activity size={24} />,
      label: 'Toplam Antrenman',
      value: stats?.total_workouts || 0,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Clock size={24} />,
      label: 'Toplam Süre',
      value: stats?.total_duration || '0 saat',
      color: 'from-[#0f6e32] to-[#0d5c2a]'
    },
    {
      icon: <TrendingUp size={24} />,
      label: 'Kalori',
      value: stats?.calories_burned || 0,
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: <Target size={24} />,
      label: 'Kas Dengesi',
      value: `${stats?.muscle_balance || 0}%`,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="skeleton w-32 h-32 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="dashboard-page">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2" data-testid="dashboard-title">
              Hoş geldin, {user?.full_name}
            </h1>
            <p className="text-gray-400">
              Abonelik: <span className="text-[#0f6e32] font-semibold">{user?.subscription_plan}</span>
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="dashboard-card"
                data-testid={`stat-card-${index}`}
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${card.color} mb-4`}>
                  <div className="text-white">{card.icon}</div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {card.value}
                </div>
                <div className="text-sm text-gray-400">{card.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Weekly Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 dashboard-card"
              data-testid="weekly-progress-chart"
            >
              <h3 className="text-xl font-semibold text-white mb-6">
                Haftalık İlerleme
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats?.weekly_progress || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="#a0a0a0" />
                  <YAxis stroke="#a0a0a0" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.9)', 
                      border: '1px solid rgba(15,110,50,0.3)',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" fill="#0f6e32" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Muscle Balance Radial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="dashboard-card"
              data-testid="muscle-balance-chart"
            >
              <h3 className="text-xl font-semibold text-white mb-6">
                Kas Dengesi
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="60%" 
                  outerRadius="90%" 
                  data={radialData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    minAngle={15}
                    background
                    clockWise
                    dataKey="value"
                    cornerRadius={10}
                  />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-4xl font-bold"
                    fill="#fff"
                  >
                    {stats?.muscle_balance || 0}%
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            <button
              onClick={() => navigate('/anatomy')}
              data-testid="quick-action-exercises"
              className="dashboard-card text-left hover:scale-105 transition-transform"
            >
              <Activity className="text-[#0f6e32] mb-3" size={28} />
              <h3 className="text-lg font-semibold text-white mb-1">
                Egzersizler
              </h3>
              <p className="text-sm text-gray-400">
                Antrenmanınıza başlayın
              </p>
            </button>

            <button
              onClick={() => navigate('/pricing')}
              data-testid="quick-action-upgrade"
              className="dashboard-card text-left hover:scale-105 transition-transform"
            >
              <TrendingUp className="text-[#0f6e32] mb-3" size={28} />
              <h3 className="text-lg font-semibold text-white mb-1">
                Plan Yükselt
              </h3>
              <p className="text-sm text-gray-400">
                Daha fazla özelliğe erişin
              </p>
            </button>

            <button
              onClick={() => navigate('/blog')}
              data-testid="quick-action-blog"
              className="dashboard-card text-left hover:scale-105 transition-transform"
            >
              <Target className="text-[#0f6e32] mb-3" size={28} />
              <h3 className="text-lg font-semibold text-white mb-1">
                Blog
              </h3>
              <p className="text-sm text-gray-400">
                Eğitim içeriklerini keşfedin
              </p>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;