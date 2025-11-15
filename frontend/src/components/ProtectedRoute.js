import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute = ({ children, requireFeature = null }) => {
  const { user, loading, hasAccess } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="skeleton w-32 h-32 rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireFeature && !hasAccess(requireFeature)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Erişim Kısıtlı</h2>
          <p className="text-gray-400 mb-6">
            Bu alana erişmek için üst düzey bir abonelik planına sahip olmanız gerekiyor.
          </p>
          <a
            href="/pricing"
            className="inline-block btn-primary"
            data-testid="upgrade-plan-button"
          >
            Planı Yükselt
          </a>
        </div>
      </div>
    );
  }

  return children;
};