import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../ui/Button';
import { Briefcase, LogOut } from 'lucide-react';

export const SourcerMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <div className="mb-6 pb-4 border-b border-guardian/20">
        <h3 className="font-anton text-lg text-white-knight uppercase tracking-wide">
          Sourcer Portal
        </h3>
        <p className="text-guardian font-jakarta text-sm">{user?.email}</p>
      </div>
      
      <div className="space-y-3">
        <Link
          to="/sourcer"
          className="flex items-center justify-center w-full px-4 py-3 bg-supernova text-shadowforce font-jakarta font-bold rounded-lg hover:bg-supernova-light transition-colors duration-200"
        >
          <Briefcase className="mr-2" size={16} />
          MY SOURCER HUB
        </Link>
        
        <Button 
          onClick={handleSignOut}
          variant="ghost"
          size="lg"
          fullWidth
          className="flex items-center gap-2"
        >
          <LogOut className="mr-2" size={16} />
          SIGN OUT
        </Button>
      </div>
    </>
  );
};