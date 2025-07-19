import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../ui/Button';

export const AnonymousMenu: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="text-center space-y-3">
      <Button 
        onClick={() => navigate('/login')}
        size="lg"
        className="glow-supernova w-full"
      >
        SIGN IN
      </Button>
      
      <Button 
        onClick={() => navigate('/signup')}
        variant="outline"
        size="lg"
        className="w-full"
      >
        SIGN UP
      </Button>
      
      <Button 
        onClick={handleSignOut}
        variant="ghost"
        size="sm"
        className="w-full text-xs"
      >
        SIGN OUT (DEBUG)
      </Button>
    </div>
  );
};