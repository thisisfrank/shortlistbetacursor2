import React from 'react';
import { useNavigate } from 'react-router-dom';
import { stripeProducts } from '../../../stripe-config';
import { Button } from '../../ui/Button';
import { X, Crown, Star, Zap, CheckCircle } from 'lucide-react';

interface UpgradePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradePromptModal: React.FC<UpgradePromptModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    navigate('/subscription');
  };

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case 'Top Shelf':
        return <Crown className="text-supernova" size={24} />;
      case 'Premium':
        return <Star className="text-blue-400" size={24} />;
      case 'Basic':
        return <Zap className="text-green-400" size={24} />;
      default:
        return <Zap className="text-guardian" size={24} />;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName) {
      case 'Top Shelf':
        return 'from-supernova/20 to-supernova/10 border-supernova/30';
      case 'Premium':
        return 'from-blue-500/20 to-blue-500/10 border-blue-500/30';
      case 'Basic':
        return 'from-green-500/20 to-green-500/10 border-green-500/30';
      default:
        return 'from-guardian/20 to-guardian/10 border-guardian/30';
    }
  };

  const getPlanFeatures = (planName: string) => {
    switch (planName) {
      case 'Top Shelf':
        return [
          'Unlimited job submissions',
          'Unlimited candidate credits',
          'Priority support',
          'Dedicated account manager',
          'Custom integrations',
          'Advanced analytics'
        ];
      case 'Premium':
        return [
          '10 job submissions/month',
          '500 candidate credits/month',
          'Priority support',
          'Advanced filtering',
          'Team collaboration',
          'Custom reports'
        ];
      case 'Basic':
        return [
          '3 job submissions/month',
          '100 candidate credits/month',
          'Standard support',
          'Basic filtering',
          'Email notifications'
        ];
      default:
        return [];
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-shadowforce-light rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-guardian/20">
        <div className="flex justify-between items-center border-b border-guardian/20 p-6">
          <div>
            <h2 className="text-2xl font-anton text-white-knight uppercase tracking-wide">Welcome Back!</h2>
            <p className="text-guardian font-jakarta mt-1">We see you've already used your free shortlist</p>
          </div>
          <button 
            onClick={onClose}
            className="text-guardian hover:text-supernova transition-colors"
            aria-label="Close"
          >
            <X size={28} />
          </button>
        </div>
        
        <div className="p-8 max-h-[calc(90vh-80px)] overflow-y-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Crown size={48} className="text-supernova fill-current animate-pulse" />
                <div className="absolute inset-0 bg-supernova/30 blur-xl rounded-full"></div>
              </div>
            </div>
            <h3 className="text-3xl font-anton text-white-knight mb-4 uppercase tracking-wide">
              Ready to Supercharge Your Hiring?
            </h3>
            <p className="text-xl text-guardian font-jakarta max-w-2xl mx-auto leading-relaxed">
              You've experienced the power of our AI-driven recruitment. Now unlock unlimited access 
              with our premium plans designed for serious hiring managers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stripeProducts.map((product) => (
              <div 
                key={product.id} 
                className={`relative hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br ${getPlanColor(product.name)} rounded-xl border p-6`}
              >
                {product.name === 'Premium' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-supernova text-shadowforce px-3 py-1 rounded-full text-xs font-jakarta font-bold uppercase tracking-wide">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <div className="flex justify-center mb-3">
                    {getPlanIcon(product.name)}
                  </div>
                  <h4 className="text-xl font-anton text-white-knight uppercase tracking-wide mb-2">
                    {product.name}
                  </h4>
                  <div className="mb-3">
                    <span className="text-3xl font-anton text-supernova">${product.price}</span>
                    <span className="text-guardian font-jakarta">/month</span>
                  </div>
                  <p className="text-guardian font-jakarta text-sm">
                    {product.description}
                  </p>
                </div>

                <div className="space-y-2 mb-6">
                  {getPlanFeatures(product.name).slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="text-supernova mr-2 flex-shrink-0" size={14} />
                      <span className="text-white-knight font-jakarta text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                  {getPlanFeatures(product.name).length > 4 && (
                    <div className="text-center">
                      <span className="text-xs text-guardian/60 font-jakarta">
                        +{getPlanFeatures(product.name).length - 4} more features
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-supernova/10 border border-supernova/30 p-6 rounded-xl mb-8">
            <div className="flex items-center justify-center mb-4">
              <Zap className="text-supernova mr-3" size={24} />
              <h4 className="font-anton text-lg text-supernova uppercase tracking-wide">Why Upgrade?</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <h5 className="font-jakarta font-bold text-white-knight mb-2">Unlimited Access</h5>
                <p className="text-guardian font-jakarta text-sm">No more limits on job submissions or candidate searches</p>
              </div>
              <div>
                <h5 className="font-jakarta font-bold text-white-knight mb-2">Priority Support</h5>
                <p className="text-guardian font-jakarta text-sm">Get faster responses and dedicated assistance</p>
              </div>
              <div>
                <h5 className="font-jakarta font-bold text-white-knight mb-2">Advanced Features</h5>
                <p className="text-guardian font-jakarta text-sm">Access premium tools and analytics</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleUpgrade}
              size="lg"
              className="glow-supernova flex-1 sm:flex-none"
            >
              VIEW ALL PLANS & UPGRADE
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              size="lg"
              className="flex-1 sm:flex-none"
            >
              MAYBE LATER
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};