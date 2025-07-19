import React from 'react';
import { ClientIntakeForm } from '../forms/ClientIntakeForm';
import { Sparkles, Target, Zap } from 'lucide-react';

export const JobSubmissionView: React.FC = () => {
  return (
    <div className="min-h-screen bg-shadowforce">
      {/* Hero Section */}
      <div className="relative py-20 px-4 overflow-hidden bg-shadowforce">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Zap size={80} className="text-supernova fill-current animate-pulse" />
              <div className="absolute inset-0 bg-supernova/30 blur-2xl rounded-full"></div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-anton text-white-knight mb-6 leading-tight">
            GET YOUR FREE
            <span className="block text-supernova">
              AI-POWERED
            </span>
            CANDIDATE SHORTLIST
          </h1>
          
          <p className="text-xl md:text-2xl text-guardian max-w-3xl mx-auto mb-12 font-jakarta leading-relaxed">
            Transform your hiring process with cutting-edge AI technology. 
            Our expert sourcers deliver premium candidates in 
            <span className="text-supernova font-bold"> 24 hours or less</span>.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="flex flex-col items-center p-6 bg-shadowforce-light/50 rounded-xl border border-guardian/20">
              <Target className="text-supernova mb-4" size={48} />
              <h3 className="font-anton text-xl text-white-knight mb-2">PRECISION TARGETING</h3>
              <p className="text-guardian font-jakarta text-center">AI-driven candidate matching for perfect role alignment</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-shadowforce-light/50 rounded-xl border border-guardian/20">
              <Sparkles className="text-supernova mb-4" size={48} />
              <h3 className="font-anton text-xl text-white-knight mb-2">PREMIUM QUALITY</h3>
              <p className="text-guardian font-jakarta text-center">Hand-curated shortlists from top-tier talent pools</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-shadowforce-light/50 rounded-xl border border-guardian/20">
              <Zap className="text-supernova mb-4" size={48} />
              <h3 className="font-anton text-xl text-white-knight mb-2">LIGHTNING FAST</h3>
              <p className="text-guardian font-jakarta text-center">Rapid delivery without compromising on quality</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Form Section */}
      <div className="pb-20 px-4 bg-shadowforce">
        <ClientIntakeForm />
      </div>
    </div>
  );
};