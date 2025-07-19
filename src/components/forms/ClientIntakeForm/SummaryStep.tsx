import React from 'react';
import { useData } from '../../../context/DataContext';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Users, Clock, CreditCard } from 'lucide-react';

interface SummaryStepProps {
  formData: {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    title: string;
    description: string;
    seniorityLevel: string;
    workArrangement: string;
    location: string;
    salaryRangeMin: string;
    salaryRangeMax: string;
    keySellingPoints: string[];
    candidatesRequested: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({
  formData,
  onChange,
  onSubmit,
  onBack,
  isSubmitting
}) => {
  const { tiers } = useData();
  
  // Get free tier for displaying limits
  const freeTier = tiers.find(tier => tier.name === 'Free');
  const maxCandidates = freeTier?.monthlyCandidateAllotment || 20;
  const candidatesRequested = parseInt(formData.candidatesRequested) || 1;
  
  // Check if request exceeds available credits
  const exceedsCredits = candidatesRequested > maxCandidates;
  
  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-3xl font-anton text-guardian mb-12 uppercase tracking-wide">Review Your Job Request</h2>
      
      <div className="bg-shadowforce border border-guardian/30 p-8 rounded-xl">
        <h3 className="text-xl font-anton text-supernova mb-6 uppercase tracking-wide">Company Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-jakarta font-semibold text-guardian/80 uppercase tracking-wide">Company</p>
              <p className="text-lg text-white-knight font-jakarta font-medium">{formData.companyName}</p>
            </div>
            <div>
              <p className="text-sm font-jakarta font-semibold text-guardian/80 uppercase tracking-wide">Contact</p>
              <p className="text-lg text-white-knight font-jakarta font-medium">{formData.contactName}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-jakarta font-semibold text-guardian/80 uppercase tracking-wide">Email</p>
              <p className="text-lg text-white-knight font-jakarta font-medium">{formData.email}</p>
            </div>
            <div>
              <p className="text-sm font-jakarta font-semibold text-guardian/80 uppercase tracking-wide">Phone</p>
              <p className="text-lg text-white-knight font-jakarta font-medium">{formData.phone}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-shadowforce border border-guardian/30 p-8 rounded-xl">
        <h3 className="text-xl font-anton text-supernova mb-6 uppercase tracking-wide">Job Details</h3>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-jakarta font-semibold text-guardian/80 uppercase tracking-wide">Title</p>
            <p className="text-2xl font-anton text-white-knight">{formData.title}</p>
          </div>
          
          <div>
            <p className="text-sm font-jakarta font-semibold text-guardian/80 uppercase tracking-wide">Description</p>
            <p className="text-white-knight font-jakarta leading-relaxed whitespace-pre-line">{formData.description}</p>
          </div>
          
          <div className="flex gap-3">
            <Badge>{formData.seniorityLevel}</Badge>
            <Badge>{formData.workArrangement}</Badge>
            <Badge>{formData.location}</Badge>
          </div>
          
          <div>
            <p className="text-sm font-jakarta font-semibold text-guardian/80 uppercase tracking-wide">Salary Range</p>
            <p className="text-xl font-jakarta font-bold text-supernova">
              ${parseInt(formData.salaryRangeMin).toLocaleString()} - ${parseInt(formData.salaryRangeMax).toLocaleString()} USD
            </p>
          </div>
          
        </div>
      </div>
      
      <div className="bg-shadowforce border border-guardian/30 p-8 rounded-xl">
        <h3 className="text-xl font-anton text-supernova mb-6 uppercase tracking-wide">Key Selling Points</h3>
        <ul className="space-y-3">
          {formData.keySellingPoints.map((point, index) => (
            <li key={index} className="flex items-start">
              <span className="text-supernova mr-3 font-bold">•</span>
              <span className="text-white-knight font-jakarta">{point}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Candidate Credit System */}
      <div className="bg-gradient-to-br from-supernova/20 to-supernova/10 border border-supernova/30 p-8 rounded-xl">
        <div className="flex items-center mb-6">
          <Users className="text-supernova mr-3" size={32} />
          <h3 className="text-2xl font-anton text-supernova uppercase tracking-wide">Candidate Credits</h3>
        </div>
        
        <div className="bg-shadowforce border border-guardian/20 p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="bg-supernova/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <CreditCard className="text-supernova" size={24} />
              </div>
              <h4 className="font-anton text-white-knight mb-2 uppercase">Free Tier</h4>
              <p className="text-guardian font-jakarta text-sm">1 job submission per month</p>
              <p className="text-supernova font-jakarta font-bold">{maxCandidates} candidate credits</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Users className="text-blue-400" size={24} />
              </div>
              <h4 className="font-anton text-white-knight mb-2 uppercase">What You Get</h4>
              <p className="text-guardian font-jakarta text-sm">Name + LinkedIn URL</p>
              <p className="text-guardian font-jakarta text-sm">+ LinkedIn Info Display Card</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Clock className="text-green-400" size={24} />
              </div>
              <h4 className="font-anton text-white-knight mb-2 uppercase">Reset Period</h4>
              <p className="text-guardian font-jakarta text-sm">Rolling 30 days</p>
              <p className="text-green-400 font-jakarta font-bold">Credits refresh monthly</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <label className="text-lg font-anton text-white-knight uppercase tracking-wide">
              Number of Candidates Requested
            </label>
            <div className="text-right">
              <span className="text-2xl font-anton text-supernova">{candidatesRequested}</span>
              <span className="text-guardian font-jakarta ml-2">/ {maxCandidates} credits</span>
            </div>
          </div>
          
          <div className="relative">
            <input
              type="range"
              name="candidatesRequested"
              min="1"
              max={maxCandidates}
              value={candidatesRequested}
              onChange={onChange}
              className="w-full h-3 bg-shadowforce rounded-lg appearance-none cursor-pointer slider [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-black [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-black"
              style={{
                background: `linear-gradient(to right, #FFCF00 0%, #FFCF00 ${(candidatesRequested / maxCandidates) * 100}%, #1A1A1A ${(candidatesRequested / maxCandidates) * 100}%, #1A1A1A 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-guardian font-jakarta mt-2">
              <span>1</span>
              <span>{Math.floor(maxCandidates / 4)}</span>
              <span>{Math.floor(maxCandidates / 2)}</span>
              <span>{Math.floor((maxCandidates * 3) / 4)}</span>
              <span>{maxCandidates}</span>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-white-knight font-jakarta text-sm bg-white/10 p-3 rounded-lg">
              <strong>How it works:</strong> Each candidate credit gives you a complete profile including their name, 
              LinkedIn URL, and a comprehensive info card with their experience, education, skills, and AI-generated summary.
            </p>
          </div>
          
          {exceedsCredits && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 font-jakarta font-semibold">
                ⚠️ You've requested {candidatesRequested} candidates but only have {maxCandidates} credits available. 
                Please reduce your request or upgrade to a paid tier for more credits.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex pt-8 gap-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          className="flex-1"
          disabled={isSubmitting}
          size="lg"
        >
          BACK
        </Button>
        <Button 
          type="button"
          onClick={onSubmit}
          disabled={exceedsCredits}
          className="flex-1"
          isLoading={isSubmitting}
          size="lg"
        >
          {exceedsCredits ? 'INSUFFICIENT CREDITS' : 'SUBMIT JOB REQUEST'}
        </Button>
      </div>
    </div>
  );
};