import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ChevronUp, ChevronDown, Play, Clock, TrendingUp } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Anatomy = () => {
  const [gender, setGender] = useState('male');
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const { hasAccess } = useAuth();

  const muscleGroups = [
    { id: 'Göğüs', name: 'Göğüs', x: 45, y: 25, width: 10, height: 8 },
    { id: 'Sırt', name: 'Sırt', x: 45, y: 35, width: 10, height: 12 },
    { id: 'Omuz', name: 'Omuz', x: 35, y: 22, width: 8, height: 8 },
    { id: 'Kol', name: 'Kol', x: 30, y: 30, width: 5, height: 12 },
    { id: 'Karın', name: 'Karın', x: 45, y: 34, width: 10, height: 10 },
    { id: 'Bacak', name: 'Bacak', x: 42, y: 50, width: 16, height: 25 }
  ];

  useEffect(() => {
    if (selectedMuscle) {
      fetchExercises(selectedMuscle);
    }
  }, [selectedMuscle]);

  const fetchExercises = async (muscleGroup) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/exercises/by-muscle/${muscleGroup}`);
      setExercises(response.data);
      setCurrentVideoIndex(0);
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
      toast.error('Egzersizler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleMuscleClick = (muscle) => {
    if (!hasAccess('anatomy')) {
      toast.error('Bu özelliğe erişmek için abonelik gerekiyor');
      return;
    }
    setSelectedMuscle(muscle);
  };

  const handleVideoSwipe = (direction) => {
    if (!hasAccess('video-swipe')) {
      toast.error('Video swipe için gelişmiş plan gerekiyor');
      return;
    }

    if (direction === 'up' && currentVideoIndex < exercises.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else if (direction === 'down' && currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const currentExercise = exercises[currentVideoIndex];

  return (
    <div className="min-h-screen" data-testid="anatomy-page">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" data-testid="anatomy-title">
              Egzersiz Modülü
            </h1>
            <p className="text-base sm:text-lg text-gray-400">
              Kas grup seçin ve egzersizleri keşfedin
            </p>
          </motion.div>

          {/* Gender Toggle */}
          <div className="flex justify-center mb-8" data-testid="gender-toggle">
            <div className="glass rounded-full p-1 flex items-center space-x-2">
              <button
                onClick={() => setGender('male')}
                data-testid="gender-male-button"
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  gender === 'male'
                    ? 'bg-[#0f6e32] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ♂ Erkek
              </button>
              <button
                onClick={() => setGender('female')}
                data-testid="gender-female-button"
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  gender === 'female'
                    ? 'bg-[#0f6e32] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ♀ Kadın
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Anatomy Visualization */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl p-8"
              data-testid="anatomy-visualization"
            >
              <h3 className="text-xl font-semibold text-white mb-6 text-center">
                Kas Grubu Seçin
              </h3>
              
              <div className="relative mx-auto" style={{ maxWidth: '400px' }}>
                {/* Anatomy Image */}
                <img
                  src={gender === 'male' 
                    ? 'https://customer-assets.emergentagent.com/job_1d4b7ef8-6e29-408d-bb4a-e182899bb9e0/artifacts/4ozuyxiz_male.png'
                    : 'https://customer-assets.emergentagent.com/job_1d4b7ef8-6e29-408d-bb4a-e182899bb9e0/artifacts/jxfse2vy_female.png'
                  }
                  alt={`${gender} anatomy`}
                  className="w-full h-auto"
                />

                {/* Interactive Muscle Areas - Simplified Clickable Buttons */}
                <div className="absolute inset-0">
                  {muscleGroups.map((muscle) => (
                    <button
                      key={muscle.id}
                      onClick={() => handleMuscleClick(muscle.id)}
                      data-testid={`muscle-button-${muscle.id}`}
                      style={{
                        position: 'absolute',
                        left: `${muscle.x}%`,
                        top: `${muscle.y}%`,
                        width: `${muscle.width}%`,
                        height: `${muscle.height}%`,
                      }}
                      className={`rounded-lg border-2 transition-all ${
                        selectedMuscle === muscle.id
                          ? 'bg-[#0f6e32]/40 border-[#0f6e32] neon-glow'
                          : 'bg-transparent border-white/20 hover:bg-[#0f6e32]/20 hover:border-[#0f6e32]/50'
                      }`}
                    >
                      <span className="sr-only">{muscle.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Muscle Group List */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {muscleGroups.map((muscle) => (
                  <button
                    key={muscle.id}
                    onClick={() => handleMuscleClick(muscle.id)}
                    data-testid={`muscle-list-${muscle.id}`}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      selectedMuscle === muscle.id
                        ? 'bg-[#0f6e32] text-white neon-glow'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {muscle.name}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Video Swipe Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl overflow-hidden"
              data-testid="video-swipe-section"
            >
              {!selectedMuscle ? (
                <div className="h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <Play className="mx-auto mb-4 text-gray-500" size={64} />
                    <p className="text-gray-400">Kas grubu seçerek başlayın</p>
                  </div>
                </div>
              ) : loading ? (
                <div className="h-[600px] flex items-center justify-center">
                  <div className="skeleton w-full h-full"></div>
                </div>
              ) : exercises.length === 0 ? (
                <div className="h-[600px] flex items-center justify-center">
                  <p className="text-gray-400">Bu kas grubu için egzersiz bulunamadı</p>
                </div>
              ) : (
                <div className="relative h-[600px] bg-black">
                  {/* Video Container */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentVideoIndex}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <video
                        src={currentExercise.video_url}
                        poster={currentExercise.thumbnail}
                        controls
                        autoPlay
                        loop
                        className="w-full h-full object-cover"
                        data-testid="exercise-video"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Video Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6">
                    <h3 className="text-2xl font-bold text-white mb-2" data-testid="exercise-name">
                      {currentExercise.name}
                    </h3>
                    <p className="text-sm text-gray-300 mb-4" data-testid="exercise-description">
                      {currentExercise.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center space-x-1 text-gray-400">
                        <TrendingUp size={16} />
                        <span data-testid="exercise-difficulty">{currentExercise.difficulty}</span>
                      </span>
                      <span className="flex items-center space-x-1 text-gray-400">
                        <Clock size={16} />
                        <span data-testid="exercise-duration">{currentExercise.duration}</span>
                      </span>
                    </div>
                  </div>

                  {/* Swipe Controls */}
                  {hasAccess('video-swipe') && exercises.length > 1 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-4">
                      <button
                        onClick={() => handleVideoSwipe('up')}
                        disabled={currentVideoIndex >= exercises.length - 1}
                        data-testid="video-swipe-up"
                        className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronUp size={24} />
                      </button>
                      <button
                        onClick={() => handleVideoSwipe('down')}
                        disabled={currentVideoIndex <= 0}
                        data-testid="video-swipe-down"
                        className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronDown size={24} />
                      </button>
                    </div>
                  )}

                  {/* Video Counter */}
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white" data-testid="video-counter">
                    {currentVideoIndex + 1} / {exercises.length}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Anatomy;