import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { 
  User, 
  LogOut, 
  LogIn, 
  Settings, 
  Users, 
  Briefcase, 
  Crown,
  ChevronDown,
  X 
} from 'lucide-react';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose }) => {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (!isOpen) return null;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      onClose();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'client':
        return <Users size={20} />;
      case 'sourcer':
        return <Briefcase size={20} />;
      case 'admin':
        return <Crown size={20} />;
      default:
        return <User size={20} />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'client':
        return 'text-supernova';
      case 'sourcer':
        return 'text-blue-400';
      case 'admin':
        return 'text-purple-400';
      default:
        return 'text-guardian';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'client':
        return 'Client';
      case 'sourcer':
        return 'Sourcer';
      case 'admin':
        return 'Admin';
      default:
        return 'User';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-anton text-white-knight uppercase tracking-wide">
                {user ? 'USER MENU' : 'SIGN IN'}
              </h2>
            </div>
            
            <button 
              onClick={onClose}
              className="text-guardian hover:text-supernova transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          {user && userProfile ? (
            // Authenticated user view
            <div className="space-y-4">
              {/* User Info */}
              <div className="bg-shadowforce-light/50 border border-guardian/20 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-supernova/20 border border-supernova/30 rounded-full flex items-center justify-center mr-3">
                    {getRoleIcon(userProfile.role)}
                  </div>
                  <div>
                    <p className="text-white-knight font-jakarta font-semibold">
                      {userProfile.email}
                    </p>
                    <div className="flex items-center">
                      <span className={`text-sm font-jakarta font-medium ${getRoleColor(userProfile.role)}`}>
                        {getRoleDisplayName(userProfile.role)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role-specific actions */}
              <div className="space-y-2">
                {userProfile.role === 'client' && (
                  <Link
                    to="/candidates"
                    onClick={onClose}
                    className="block w-full text-left px-4 py-3 bg-supernova/10 border border-supernova/30 rounded-lg text-supernova hover:bg-supernova/20 transition-colors"
                  >
                    View My Candidates
                  </Link>
                )}
                
                {userProfile.role === 'sourcer' && (
                  <Link
                    to="/sourcer"
                    onClick={onClose}
                    className="block w-full text-left px-4 py-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    Sourcer Dashboard
                  </Link>
                )}
                
                {userProfile.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={onClose}
                    className="block w-full text-left px-4 py-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/20 transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </div>

              {/* Sign Out Button */}
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="lg"
                fullWidth
                isLoading={isSigningOut}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <LogOut size={18} className="mr-2" />
                SIGN OUT
              </Button>
            </div>
          ) : (
            // Unauthenticated user view
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-guardian/20 border border-guardian/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} className="text-guardian" />
                </div>
                <p className="text-guardian font-jakarta mb-6">
                  Sign in to access your Super Recruiter account
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="block w-full"
                >
                  <Button
                    size="lg"
                    fullWidth
                    className="glow-supernova"
                  >
                    <LogIn size={18} className="mr-2" />
                    SIGN IN
                  </Button>
                </Link>

                <Link
                  to="/signup"
                  onClick={onClose}
                  className="block w-full"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                  >
                    CREATE ACCOUNT
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};