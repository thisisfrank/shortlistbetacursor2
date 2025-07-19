import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Users, Briefcase, Crown, X } from 'lucide-react';

interface RoleSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ isOpen, onClose }) => {
  const { userProfile } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'client' | 'sourcer' | 'admin'>(userProfile?.role || 'client');

  if (!isOpen) return null;

  const handleRoleSwitch = (role: 'client' | 'sourcer' | 'admin') => {
    // Update the user profile in localStorage for testing
    const currentProfile = JSON.parse(localStorage.getItem('testUserProfile') || 'null') || userProfile;
    const updatedProfile = {
      ...currentProfile,
      role: role
    };
    
    localStorage.setItem('testUserProfile', JSON.stringify(updatedProfile));
    
    // Navigate to the appropriate role page without reloading
    const roleHomePage = getRoleHomePage(role);
    window.location.href = roleHomePage;
  };
  
  const getRoleHomePage = (role: string): string => {
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'client':
        return <Users size={20} />;
      case 'sourcer':
        return <Briefcase size={20} />;
      case 'admin':
        return <Crown size={20} />;
      default:
        return <Users size={20} />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'client':
        return 'from-supernova/20 to-supernova/10 border-supernova/30';
      case 'sourcer':
        return 'from-blue-500/20 to-blue-500/10 border-blue-500/30';
      case 'admin':
        return 'from-purple-500/20 to-purple-500/10 border-purple-500/30';
      default:
        return 'from-guardian/20 to-guardian/10 border-guardian/30';
    }
  };

  const getCurrentRoleDisplay = () => {
    return userProfile?.role?.toUpperCase() || 'CLIENT';
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-supernova rounded-full flex items-center justify-center mr-3">
                  <div className="w-4 h-4 bg-shadowforce rounded-full"></div>
                </div>
                <div>
                  <h2 className="text-2xl font-anton text-white-knight uppercase tracking-wide">
                    ROLE SWITCHER
                  </h2>
                  <p className="text-supernova font-jakarta font-semibold">(TESTING)</p>
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <div className="bg-supernova/20 border border-supernova/30 px-4 py-2 rounded-full flex items-center">
                  {getRoleIcon(userProfile?.role || 'client')}
                  <span className="ml-2 font-jakarta font-bold text-supernova">
                    {getCurrentRoleDisplay()}
                  </span>
                </div>
              </div>
              
              <p className="text-guardian font-jakarta max-w-md">
                Switch between different user roles to test the application features
              </p>
            </div>
            
            <button 
              onClick={onClose}
              className="text-guardian hover:text-supernova transition-colors"
              aria-label="Close"
            >
              <X size={28} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Client Role */}
            <div 
              className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 bg-gradient-to-br ${getRoleColor('client')} rounded-xl border p-6 ${
                selectedRole === 'client' ? 'ring-2 ring-supernova' : ''
              }`}
              onClick={() => setSelectedRole('client')}
            >
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <Users className="text-supernova" size={32} />
                </div>
                <h3 className="text-lg font-anton text-white-knight uppercase tracking-wide mb-2">
                  CLIENT
                </h3>
                <p className="text-guardian font-jakarta text-sm">
                  Submit jobs and view candidates
                </p>
              </div>
            </div>

            {/* Sourcer Role */}
            <div 
              className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 bg-gradient-to-br ${getRoleColor('sourcer')} rounded-xl border p-6 ${
                selectedRole === 'sourcer' ? 'ring-2 ring-blue-400' : ''
              }`}
              onClick={() => setSelectedRole('sourcer')}
            >
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <Briefcase className="text-blue-400" size={32} />
                </div>
                <h3 className="text-lg font-anton text-white-knight uppercase tracking-wide mb-2">
                  SOURCER
                </h3>
                <p className="text-guardian font-jakarta text-sm">
                  Claim jobs and submit candidates
                </p>
              </div>
            </div>

            {/* Admin Role */}
            <div 
              className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 bg-gradient-to-br ${getRoleColor('admin')} rounded-xl border p-6 ${
                selectedRole === 'admin' ? 'ring-2 ring-purple-400' : ''
              }`}
              onClick={() => setSelectedRole('admin')}
            >
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <Crown className="text-purple-400" size={32} />
                </div>
                <h3 className="text-lg font-anton text-white-knight uppercase tracking-wide mb-2">
                  ADMIN
                </h3>
                <p className="text-guardian font-jakarta text-sm">
                  Manage system and users
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-lg mb-6">
            <p className="text-orange-400 font-jakarta font-semibold text-sm">
              ⚠️ Testing Mode: This will reload the page to apply the new role. 
              All data is stored locally and will persist until cleared.
            </p>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={() => handleRoleSwitch(selectedRole)}
              size="lg"
              className="flex-1 glow-supernova"
              disabled={selectedRole === userProfile?.role}
            >
              {selectedRole === userProfile?.role ? 'CURRENT ROLE' : `SWITCH TO ${selectedRole.toUpperCase()}`}
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              CANCEL
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};