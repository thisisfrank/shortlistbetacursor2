import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Users, Clock, Briefcase, Calendar, CreditCard, LogOut, Crown } from 'lucide-react';

export const ClientMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const { clients, tiers, getTierById, jobs, getCandidatesByClient } = useData();
  const navigate = useNavigate();
  
  // Get current client based on authenticated user
  const currentClient = user ? clients.find(client => client.email === user.email) : clients[0];
  const currentTier = currentClient ? getTierById(currentClient.tierId) : null;
  
  // Get real-time data for the current client
  const clientJobs = currentClient ? jobs.filter(job => job.clientId === currentClient.id) : [];
  const clientCandidates = currentClient ? getCandidatesByClient(currentClient.id) : [];
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <>
      {/* User Info */}
      <div className="mb-6 pb-4 border-b border-guardian/20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-anton text-lg text-white-knight uppercase tracking-wide">
            {currentClient?.contactName || user?.email || 'Client'}
          </h3>
          <Badge variant="outline" className="text-xs">
            FREE
          </Badge>
        </div>
        {currentClient && (
          <>
            <p className="text-guardian font-jakarta text-sm">{currentClient.companyName}</p>
            <p className="text-guardian/80 font-jakarta text-xs">{currentClient.email}</p>
          </>
        )}
      </div>
      
      {/* Subscription Status */}
      <div className="mb-6">
        <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <CreditCard className="text-orange-400 mr-2" size={16} />
              <span className="text-sm font-jakarta font-semibold text-orange-400">Free Plan</span>
            </div>
          </div>
          <p className="text-guardian font-jakarta text-sm">Upgrade to unlock premium features</p>
        </div>
      </div>

      {/* Credits & Usage - Only show if client exists */}
      {currentClient && currentTier && (
        <div className="space-y-4 mb-6">
          <div className="bg-supernova/10 border border-supernova/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Users className="text-supernova mr-2" size={16} />
                <span className="text-sm font-jakarta font-semibold text-supernova">Available Credits</span>
              </div>
              <span className="text-lg font-anton text-white-knight">
                {currentClient.availableCredits}
              </span>
            </div>
            <div className="w-full bg-shadowforce rounded-full h-2">
              <div 
                className="bg-supernova h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min((currentClient.availableCredits / currentTier.monthlyCandidateAllotment) * 100, 100)}%` 
                }}
              ></div>
            </div>
            <p className="text-xs text-guardian mt-1">
              of {currentTier.monthlyCandidateAllotment} monthly credits
            </p>
            <p className="text-xs text-guardian/60 mt-1">
              Used: {clientCandidates.length} candidates
            </p>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Briefcase className="text-blue-400 mr-2" size={16} />
                <span className="text-sm font-jakarta font-semibold text-blue-400">Job Submissions</span>
              </div>
              <span className="text-lg font-anton text-white-knight">
                {currentClient.jobsRemaining}
              </span>
            </div>
            <div className="w-full bg-shadowforce rounded-full h-2">
              <div 
                className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min((currentClient.jobsRemaining / currentTier.monthlyJobAllotment) * 100, 100)}%` 
                }}
              ></div>
            </div>
            <p className="text-xs text-guardian mt-1">
              of {currentTier.monthlyJobAllotment} monthly jobs
            </p>
            <p className="text-xs text-guardian/60 mt-1">
              Submitted: {clientJobs.length} jobs
            </p>
          </div>
          
          <div className="flex items-center text-sm text-guardian">
            <Calendar className="mr-2" size={14} />
            <span className="font-jakarta">
              Credits reset: {formatDate(currentClient.creditsResetDate)}
            </span>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="space-y-3">
        <Link
          to="/candidates"
          className="flex items-center justify-center w-full px-4 py-3 bg-supernova text-shadowforce font-jakarta font-bold rounded-lg hover:bg-supernova-light transition-colors duration-200"
        >
          <Users className="mr-2" size={16} />
          VIEW MY CANDIDATES
        </Link>
        
        <Button 
          onClick={() => navigate('/subscription')}
          variant="outline"
          size="lg"
          fullWidth
          className="flex items-center gap-2"
        >
          <Crown className="mr-2" size={16} />
          UPGRADE PLAN
        </Button>
        
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