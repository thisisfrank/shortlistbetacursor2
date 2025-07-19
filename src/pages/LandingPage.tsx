import React from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { 
  Zap, 
  Users, 
  Target, 
  Clock,
  ArrowRight,
  Building,
  UserCheck
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-shadowforce">
      <Header />
      <main className="flex-grow">
        <div className="min-h-screen bg-gradient-to-br from-shadowforce via-shadowforce-dark to-black">
          {/* Hero Section */}
          <section className="pt-20 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              {/* Badge */}
              <Badge variant="warning" className="mb-6">
                <Zap className="w-4 h-4 mr-2" />
                AI-Powered Recruitment Platform
              </Badge>
              
              {/* Main Headline */}
              <h1 className="text-5xl md:text-6xl font-anton text-white-knight mb-6 uppercase tracking-wide leading-tight">
                Get
                <span className="block text-supernova">Candidates</span>
                Fast
              </h1>
              
              {/* Subheadline */}
              <p className="text-xl text-guardian mb-8 max-w-2xl mx-auto font-jakarta leading-relaxed">
                Submit your job requirements and receive qualified candidates within 24-48 hours.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-12">
                <div className="text-center">
                  <div className="text-2xl font-anton text-supernova mb-2">24hr</div>
                  <div className="text-guardian font-jakarta text-sm">Average Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-anton text-supernova mb-2">95%</div>
                  <div className="text-guardian font-jakarta text-sm">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-anton text-supernova mb-2">500+</div>
                  <div className="text-guardian font-jakarta text-sm">Candidates Placed</div>
                </div>
              </div>
            </div>
          </section>

          {/* Login Section */}
          <section className="pb-20">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
              <Card className="p-8">
                <h2 className="text-2xl font-anton text-white-knight mb-6 uppercase tracking-wide text-center">
                  Get Started
                </h2>
                
                <div className="space-y-6">
                  {/* Client Login */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-supernova/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building className="w-8 h-8 text-supernova" />
                    </div>
                    <h3 className="text-xl font-anton text-white-knight mb-2 uppercase tracking-wide">
                      I'm a Client
                    </h3>
                    <p className="text-guardian font-jakarta mb-4">
                      Submit job requirements and get qualified candidates
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        variant="primary"
                        size="lg"
                        className="text-lg px-6 py-3"
                        onClick={() => window.location.href = '/login'}
                      >
                        Sign In
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                      <Button 
                        variant="outline"
                        size="lg"
                        className="text-lg px-6 py-3"
                        onClick={() => window.location.href = '/signup'}
                      >
                        Create Account
                      </Button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-guardian/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-shadowforce text-guardian font-jakarta">or</span>
                    </div>
                  </div>

                  {/* Sourcer Login */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-supernova/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserCheck className="w-8 h-8 text-supernova" />
                    </div>
                    <h3 className="text-xl font-anton text-white-knight mb-2 uppercase tracking-wide">
                      I'm a Sourcer
                    </h3>
                    <p className="text-guardian font-jakarta mb-4">
                      Find and submit candidates for open positions
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        variant="primary"
                        size="lg"
                        className="text-lg px-6 py-3"
                        onClick={() => window.location.href = '/login'}
                      >
                        Sign In
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                      <Button 
                        variant="outline"
                        size="lg"
                        className="text-lg px-6 py-3"
                        onClick={() => window.location.href = '/signup'}
                      >
                        Create Account
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-black/20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-anton text-white-knight mb-4 uppercase tracking-wide">
                  How It Works
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-supernova/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-supernova" />
                  </div>
                  <h3 className="text-lg font-anton text-white-knight mb-2 uppercase tracking-wide">Submit Requirements</h3>
                  <p className="text-guardian font-jakarta text-sm">
                    Tell us about your role and requirements
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-supernova/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-supernova" />
                  </div>
                  <h3 className="text-lg font-anton text-white-knight mb-2 uppercase tracking-wide">AI + Human Sourcing</h3>
                  <p className="text-guardian font-jakarta text-sm">
                    Our AI and expert sourcers find perfect candidates
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-supernova/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-supernova" />
                  </div>
                  <h3 className="text-lg font-anton text-white-knight mb-2 uppercase tracking-wide">Get Results</h3>
                  <p className="text-guardian font-jakarta text-sm">
                    Receive qualified candidates within 24-48 hours
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};