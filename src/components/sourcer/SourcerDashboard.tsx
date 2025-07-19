import React, { useState } from 'react';
import { Job, Client } from '../../types';
import { JobCard } from './JobCard';
import { JobDetailModal } from './JobDetailModal';
import { useData } from '../../context/DataContext';
import { Button } from '../ui/Button';
import { Search, ClipboardList, Check, Clock, Zap, Target, Users } from 'lucide-react';

export const SourcerDashboard: React.FC = () => {
  const { jobs, getClientById, updateJob } = useData();
  const [filter, setFilter] = useState<'all' | 'unclaimed' | 'claimed' | 'completed'>('all');
  const [search, setSearch] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [sourcerName, setSourcerName] = useState(() => {
    return localStorage.getItem('sourcerName') || '';
  });
  const [savedSourcers] = useState<string[]>(() => {
    const saved = localStorage.getItem('savedSourcers');
    return saved ? JSON.parse(saved) : [];
  });

  // Get the selected job and its client
  const selectedJob = selectedJobId ? jobs.find(job => job.id === selectedJobId) || null : null;
  const client = selectedJob ? getClientById(selectedJob.clientId) : null;

  // Filter jobs based on the filter and search
  const filteredJobs = jobs.filter(job => {
    // Filter based on status
    if (filter === 'unclaimed' && job.status !== 'Unclaimed') return false;
    if (filter === 'claimed' && job.status !== 'Claimed') return false;
    if (filter === 'completed' && job.status !== 'Completed') return false;
    
    // Filter based on search
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Sort jobs: Unclaimed first, then Claimed, then Completed
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const statusOrder = { 'Unclaimed': 0, 'Claimed': 1, 'Completed': 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  // Get job counts for stats
  const unclaimedCount = jobs.filter(job => job.status === 'Unclaimed').length;
  const claimedCount = jobs.filter(job => job.status === 'Claimed').length;
  const completedCount = jobs.filter(job => job.status === 'Completed').length;
  const myJobsCount = jobs.filter(job => job.sourcerName === sourcerName).length;

  // Close job detail modal
  const handleCloseModal = () => {
    setSelectedJobId(null);
  };

  // Claim a job
  const handleClaimJob = (jobId: string, name: string) => {
    // Store sourcer name in localStorage for future use
    localStorage.setItem('sourcerName', name);
    
    // Add to saved sourcers list if not already there
    const currentSaved = JSON.parse(localStorage.getItem('savedSourcers') || '[]');
    const updatedSourcers = [...new Set([...currentSaved, name])];
    localStorage.setItem('savedSourcers', JSON.stringify(updatedSourcers));
    
    setSourcerName(name);
    
    // Update job status to claimed
    updateJob(jobId, {
      status: 'Claimed',
      sourcerName: name
    });
  };

  // Complete a job
  const handleCompleteJob = (jobId: string) => {
    updateJob(jobId, {
      status: 'Completed',
      completionLink: 'Candidates submitted via structured form'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-shadowforce via-shadowforce-light to-shadowforce">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Zap size={60} className="text-supernova fill-current animate-pulse" />
              <div className="absolute inset-0 bg-supernova/30 blur-xl rounded-full"></div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-anton text-white-knight mb-4 text-center uppercase tracking-wide">
            SOURCER HUB
          </h1>
          <p className="text-xl text-guardian text-center font-jakarta max-w-2xl mx-auto">
            Claim jobs, source top candidates, and deliver exceptional results with AI-powered tools
          </p>
        </header>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-supernova/20 to-supernova/10 border border-supernova/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-anton text-lg text-supernova uppercase tracking-wide">Available</h3>
                <p className="text-3xl font-anton text-white-knight">{unclaimedCount}</p>
              </div>
              <Clock className="text-supernova" size={32} />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-anton text-lg text-blue-400 uppercase tracking-wide">In Progress</h3>
                <p className="text-3xl font-anton text-white-knight">{claimedCount}</p>
              </div>
              <Target className="text-blue-400" size={32} />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-anton text-lg text-green-400 uppercase tracking-wide">Completed</h3>
                <p className="text-3xl font-anton text-white-knight">{completedCount}</p>
              </div>
              <Check className="text-green-400" size={32} />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-anton text-lg text-purple-400 uppercase tracking-wide">My Jobs</h3>
                <p className="text-3xl font-anton text-white-knight">{myJobsCount}</p>
              </div>
              <Users className="text-purple-400" size={32} />
            </div>
          </div>
        </div>
        
        {/* Search and Filter Section */}
        <div className="bg-shadowforce-light border border-guardian/20 rounded-xl shadow-2xl p-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-guardian" />
              </div>
              <input
                type="text"
                placeholder="Search jobs by title, description, or location"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 block w-full rounded-lg border-guardian/30 bg-shadowforce text-white-knight placeholder-guardian/60 focus:ring-supernova focus:border-supernova font-jakarta text-lg py-4"
              />
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                size="md"
                onClick={() => setFilter('all')}
                className="flex items-center gap-2"
              >
                <ClipboardList size={18} />
                ALL
              </Button>
              <Button
                variant={filter === 'unclaimed' ? 'primary' : 'outline'}
                size="md"
                onClick={() => setFilter('unclaimed')}
                className="flex items-center gap-2"
              >
                <Clock size={18} />
                AVAILABLE
              </Button>
              <Button
                variant={filter === 'claimed' ? 'primary' : 'outline'}
                size="md"
                onClick={() => setFilter('claimed')}
                className="flex items-center gap-2"
              >
                <Target size={18} />
                IN PROGRESS
              </Button>
              <Button
                variant={filter === 'completed' ? 'primary' : 'outline'}
                size="md"
                onClick={() => setFilter('completed')}
                className="flex items-center gap-2"
              >
                <Check size={18} />
                COMPLETED
              </Button>
            </div>
          </div>
          
          {sourcerName && (
            <div className="bg-supernova/10 border border-supernova/30 p-4 rounded-lg mb-6">
              <p className="text-supernova font-jakarta font-semibold">
                Sourcing as: <span className="font-anton text-white-knight text-lg">{sourcerName.toUpperCase()}</span>
              </p>
              {savedSourcers.length > 1 && (
                <p className="text-guardian font-jakarta text-sm mt-1">
                  {savedSourcers.length - 1} other saved sourcer name{savedSourcers.length > 2 ? 's' : ''} available
                </p>
              )}
            </div>
          )}
          
          {sortedJobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-6">
                <ClipboardList size={64} className="text-guardian/40 mx-auto" />
              </div>
              <h3 className="font-anton text-2xl text-guardian mb-2">NO JOBS FOUND</h3>
              <p className="text-guardian/80 font-jakarta">No jobs match your current search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {sortedJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onView={(jobId) => setSelectedJobId(jobId)}
                  onClaim={job.status === 'Unclaimed' ? (jobId) => setSelectedJobId(jobId) : undefined}
                  onComplete={
                    job.status === 'Claimed' && job.sourcerName === sourcerName 
                      ? (jobId) => setSelectedJobId(jobId) 
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
        
        {selectedJob && client && (
          <JobDetailModal
            job={selectedJob}
            client={client}
            onClose={handleCloseModal}
            onClaim={handleClaimJob}
            onComplete={handleCompleteJob}
          />
        )}
      </div>
    </div>
  );
};