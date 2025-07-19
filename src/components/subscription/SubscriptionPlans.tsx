import React, { useState } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { useSubscription } from '../../hooks/useSubscription';
import { stripeProducts } from '../../stripe-config';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CheckCircle, Zap, Crown, Star } from 'lucide-react';

export const SubscriptionPlans: React.FC = () => {
  // const { user } = useAuth();
  // const { subscription, getSubscriptionPlan, isActive } = useSubscription();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // const currentPlan = getSubscriptionPlan();
  const currentPlan = null; // Temporarily disabled for testing

  const handleSubscribe = async (priceId: string) => {
    setLoadingPlan(priceId);

    try {
      // Get the current user session
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          mode: 'subscription',
          success_url: `${window.location.origin}/subscription/success`,
          cancel_url: `${window.location.origin}/subscription`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      if (url) {
        window.open(url, '_blank'); // Open Stripe checkout in new tab
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to open checkout'}`);
    } finally {
      setLoadingPlan(null);
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case 'Top Shelf':
        return <Crown className="text-supernova" size={32} />;
      case 'Premium':
        return <Star className="text-blue-400" size={32} />;
      case 'Basic':
        return <Zap className="text-green-400" size={32} />;
      default:
        return <Zap className="text-guardian" size={32} />;
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

  const isCurrentPlan = (priceId: string) => {
    return false; // currentPlan?.priceId === priceId && isActive();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-shadowforce via-shadowforce-light to-shadowforce">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Crown size={60} className="text-supernova fill-current animate-pulse" />
              <div className="absolute inset-0 bg-supernova/30 blur-xl rounded-full"></div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-anton text-white-knight mb-4 uppercase tracking-wide">
            SUBSCRIPTION PLANS
          </h1>
          <p className="text-xl text-guardian font-jakarta max-w-2xl mx-auto">
            Choose the perfect plan to supercharge your recruitment process
          </p>
        </header>

        {/* Current Subscription Status */}
        {currentPlan && (
          <div className="mb-12">
            <Card className="bg-gradient-to-r from-supernova/20 to-supernova/10 border-supernova/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="text-supernova mr-3" size={24} />
                    <div>
                      <h3 className="font-anton text-lg text-supernova uppercase tracking-wide">
                        Current Plan: {currentPlan.name}
                      </h3>
                      <p className="text-guardian font-jakarta">
                        Your subscription is active and ready to use
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">ACTIVE</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stripeProducts.map((product) => (
            <Card 
              key={product.id} 
              className={`relative hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br ${getPlanColor(product.name)}`}
            >
              {product.name === 'Premium' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge variant="default" className="px-4 py-1">
                    MOST POPULAR
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {getPlanIcon(product.name)}
                </div>
                <h3 className="text-2xl font-anton text-white-knight uppercase tracking-wide mb-2">
                  {product.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-anton text-supernova">${product.price}</span>
                  <span className="text-guardian font-jakarta">/month</span>
                </div>
                <p className="text-guardian font-jakarta text-sm">
                  {product.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3 mb-8">
                  <div className="flex items-center">
                    <CheckCircle className="text-supernova mr-3 flex-shrink-0" size={16} />
                    <span className="text-white-knight font-jakarta text-sm">
                      {product.name === 'Basic' ? '3 job submissions/month' : 
                       product.name === 'Premium' ? '10 job submissions/month' : 
                       'Unlimited job submissions'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-supernova mr-3 flex-shrink-0" size={16} />
                    <span className="text-white-knight font-jakarta text-sm">
                      {product.name === 'Basic' ? '100 candidate credits/month' : 
                       product.name === 'Premium' ? '500 candidate credits/month' : 
                       'Unlimited candidate credits'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-supernova mr-3 flex-shrink-0" size={16} />
                    <span className="text-white-knight font-jakarta text-sm">
                      AI-powered candidate sourcing
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-supernova mr-3 flex-shrink-0" size={16} />
                    <span className="text-white-knight font-jakarta text-sm">
                      LinkedIn profile scraping
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-supernova mr-3 flex-shrink-0" size={16} />
                    <span className="text-white-knight font-jakarta text-sm">
                      {product.name === 'Basic' ? 'Standard support' : 
                       product.name === 'Premium' ? 'Priority support' : 
                       'Dedicated account manager'}
                    </span>
                  </div>
                  {product.name === 'Top Shelf' && (
                    <div className="flex items-center">
                      <CheckCircle className="text-supernova mr-3 flex-shrink-0" size={16} />
                      <span className="text-white-knight font-jakarta text-sm">
                        Custom integrations & analytics
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  fullWidth
                  size="lg"
                  variant={isCurrentPlan(product.priceId) ? 'outline' : 'primary'}
                  onClick={() => handleSubscribe(product.priceId)}
                  disabled={isCurrentPlan(product.priceId) || loadingPlan === product.priceId}
                  isLoading={loadingPlan === product.priceId}
                >
                  {isCurrentPlan(product.priceId) 
                    ? 'CURRENT PLAN' 
                    : `SUBSCRIBE TO ${product.name.toUpperCase()}`
                  }
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl font-anton text-white-knight mb-4 uppercase tracking-wide">
                Need Help Choosing?
              </h3>
              <p className="text-guardian font-jakarta mb-6">
                All plans include our core AI-powered recruitment features. 
                Upgrade anytime to access advanced features and priority support.
              </p>
              <Button variant="outline" size="md">
                CONTACT SALES
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};