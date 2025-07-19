import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserMenu } from './UserMenu';
import { Zap, User, LogIn } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  
  // Get the role-appropriate home path
  const getRoleHomePath = (role: string): string => {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'sourcer':
        return '/sourcer';
      case 'client':
      default:
        return '/';
    }
  };
  
  const isActive = (path: string) => {
    if (!userProfile) return location.pathname === path;
    
    // Special handling for role-based home pages
    const roleHomePath = getRoleHomePath(userProfile.role);
    
    // If we're checking the role's home path and we're currently on it
    if (path === roleHomePath && location.pathname === roleHomePath) {
      return true;
    }
    
    // For other paths, use exact match
    return location.pathname === path;
  };
  
  const getNavItems = () => {
    if (!userProfile) {
      // Anonymous users only see the main landing page
      return [
        { path: '/', label: 'GET CANDIDATES', key: 'home' }
      ];
    }

    switch (userProfile.role) {
      case 'client':
        return [
          { path: '/', label: 'GET CANDIDATES', key: 'submit' },
          { path: '/candidates', label: 'MY CANDIDATES', key: 'candidates' }
        ];
      case 'sourcer':
        return [
          { path: '/sourcer', label: 'SOURCER HUB', key: 'sourcer' }
        ];
      case 'admin':
        return [
          { path: '/admin', label: 'ADMIN CONTROL', key: 'admin' }
        ];
      default:
        return [
          { path: '/', label: 'GET CANDIDATES', key: 'home' }
        ];
    }
  };

  const navItems = getNavItems();
  
  // Auto-navigate to role home when role changes
  React.useEffect(() => {
    if (userProfile) {
      const roleHomePath = getRoleHomePath(userProfile.role);
      // Only navigate if we're not already on a valid path for this role
      if (location.pathname !== roleHomePath && !navItems.some(item => item.path === location.pathname)) {
        navigate(roleHomePath);
      }
    }
  }, [userProfile?.role, navigate, location.pathname]);
  
  return (
    <header className="bg-shadowforce border-b border-guardian/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center h-20 relative">
          {/* Logo - positioned absolutely to the left */}
          <div className="absolute left-0 flex items-center">
            <Link to="/" className="flex items-center text-supernova hover:text-supernova-light transition-colors">
              <div className="relative">
                <Zap size={32} className="mr-3 fill-current" />
                <div className="absolute inset-0 bg-supernova/20 blur-lg rounded-full"></div>
              </div>
              <div className="sr-logo">
                <span className="text-supernova">SUPER</span>
                <span className="text-white-knight ml-1">RECRUITER</span>
              </div>
            </Link>
          </div>
          
          {/* Navigation - centered */}
          <nav className="flex space-x-1 bg-shadowforce-light/50 rounded-xl px-2 py-2 border border-guardian/20">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`px-6 py-3 rounded-lg text-sm font-jakarta font-semibold transition-all duration-200 ${
                  isActive(item.path) 
                    ? 'bg-supernova text-shadowforce shadow-lg glow-supernova' 
                    : 'text-guardian hover:bg-shadowforce-light hover:text-supernova'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* User Menu - positioned absolutely to the right */}
          <div className="absolute right-0">
            <button
              onClick={() => setShowUserMenu(true)}
              className="flex items-center justify-center w-12 h-12 bg-supernova/20 border border-supernova/30 rounded-full hover:bg-supernova/30 transition-all duration-200 hover:scale-110"
              title={userProfile ? "User Menu" : "Sign In"}
            >
              {userProfile ? (
                <User size={20} className="text-supernova" />
              ) : (
                <LogIn size={20} className="text-supernova" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      <UserMenu 
        isOpen={showUserMenu}
        onClose={() => setShowUserMenu(false)}
      />
    </header>
  );
};