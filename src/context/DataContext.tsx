import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Client, Job, Candidate, Tier } from '../types';
// import { scrapeLinkedInProfiles } from '../services/apifyService';
import { generateJobMatchScore } from '../services/anthropicService';

// Temporary fallback function until apifyService is properly configured
const scrapeLinkedInProfiles = async (linkedinUrls: string[]): Promise<any> => {
  console.warn('Apify service not configured - using fallback');
  return {
    success: false,
    profiles: [],
    error: 'Apify service not configured'
  };
};

interface DataContextType {
  clients: Client[];
  jobs: Job[];
  candidates: Candidate[];
  tiers: Tier[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client;
  addJob: (job: Omit<Job, 'id' | 'status' | 'sourcerName' | 'completionLink' | 'createdAt' | 'updatedAt'>) => Job;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'submittedAt'>) => Candidate;
  addCandidatesFromLinkedIn: (jobId: string, linkedinUrls: string[]) => Promise<{ 
    success: boolean; 
    acceptedCount: number; 
    rejectedCount: number; 
    error?: string 
  }>;
  updateJob: (jobId: string, updates: Partial<Job>) => Job | null;
  updateClient: (clientId: string, updates: Partial<Client>) => Client | null;
  deleteJob: (jobId: string) => void;
  deleteClient: (clientId: string) => void;
  getCandidatesByJob: (jobId: string) => Candidate[];
  getCandidatesByClient: (clientId: string) => Candidate[];
  getJobsByStatus: (status: Job['status']) => Job[];
  getClientById: (clientId: string) => Client | null;
  getJobById: (jobId: string) => Job | null;
  getJobsByClient: (clientId: string) => Job[];
  getTierById: (tierId: string) => Tier | null;
  checkDuplicateEmail: (email: string) => boolean;
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

// Create dummy data for demonstration
const createDummyData = () => {
  const dummyTiers: Tier[] = [
    {
      id: 'tier-free',
      name: 'Free',
      monthlyJobAllotment: 1,
      monthlyCandidateAllotment: 20,
      includesCompanyEmails: false,
      createdAt: new Date('2024-01-01')
    },
    {
      id: 'tier-1',
      name: 'Tier 1',
      monthlyJobAllotment: 1,
      monthlyCandidateAllotment: 50,
      includesCompanyEmails: true,
      createdAt: new Date('2024-01-01')
    },
    {
      id: 'tier-2',
      name: 'Tier 2',
      monthlyJobAllotment: 3,
      monthlyCandidateAllotment: 150,
      includesCompanyEmails: true,
      createdAt: new Date('2024-01-01')
    },
    {
      id: 'tier-3',
      name: 'Tier 3',
      monthlyJobAllotment: 10,
      monthlyCandidateAllotment: 400,
      includesCompanyEmails: true,
      createdAt: new Date('2024-01-01')
    }
  ];

  const dummyClients: Client[] = [
    {
      id: 'client-1',
      companyName: 'TechCorp AI Solutions',
      contactName: 'Sarah Johnson',
      email: 'sarah.johnson@techcorp.ai',
      phone: '+1 (555) 123-4567',
      hasReceivedFreeShortlist: false,
      tierId: 'tier-free',
      availableCredits: 20,
      jobsRemaining: 1,
      creditsResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      createdAt: new Date('2024-01-15')
    }
  ];

  const dummyJobs: Job[] = [
    {
      id: 'job-1',
      clientId: 'client-1',
      title: 'Senior AI Engineer',
      description: `We are seeking a highly skilled Senior AI Engineer to join our cutting-edge AI development team. The ideal candidate will have extensive experience in machine learning, deep learning, and AI model development.

Key Responsibilities:
• Design and implement advanced AI/ML algorithms and models
• Develop and optimize neural networks for various applications
• Work with large datasets and implement data preprocessing pipelines
• Collaborate with cross-functional teams to integrate AI solutions
• Research and implement state-of-the-art AI techniques
• Mentor junior engineers and contribute to technical documentation

Required Skills:
• 5+ years of experience in AI/ML development
• Proficiency in Python, TensorFlow, PyTorch, and scikit-learn
• Strong background in mathematics, statistics, and computer science
• Experience with cloud platforms (AWS, GCP, or Azure)
• Knowledge of MLOps practices and model deployment`,
      seniorityLevel: 'Senior',
      workArrangement: 'Hybrid',
      location: 'San Francisco, CA',
      salaryRangeMin: 150000,
      salaryRangeMax: 220000,
      keySellingPoints: [
        'Competitive salary with equity package',
        'Work on cutting-edge AI projects',
        'Flexible hybrid work arrangement',
        'Comprehensive health and dental coverage',
        'Annual learning and development budget',
        'Stock options and performance bonuses',
        'Collaborative and innovative team environment'
      ],
      status: 'Unclaimed',
      sourcerName: null,
      completionLink: null,
      candidatesRequested: 15,
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16')
    }
  ];

  const dummyCandidates: Candidate[] = [
    // No dummy candidates - start fresh
  ];

  return {
    tiers: dummyTiers,
    clients: dummyClients,
    jobs: dummyJobs,
    candidates: dummyCandidates
  };
};

// Load data from localStorage if available, otherwise use dummy data
const loadInitialData = () => {
  try {
    const savedTiers = localStorage.getItem('tiers');
    const savedClients = localStorage.getItem('clients');
    const savedJobs = localStorage.getItem('jobs');
    const savedCandidates = localStorage.getItem('candidates');
    
    // If we have saved data, use it
    if (savedTiers && savedClients && savedJobs && savedCandidates) {
      return {
        tiers: JSON.parse(savedTiers).map((tier: any) => ({
          ...tier,
          createdAt: new Date(tier.createdAt)
        })),
        clients: JSON.parse(savedClients).map((client: any) => ({
          ...client,
          createdAt: new Date(client.createdAt),
          creditsResetDate: new Date(client.creditsResetDate)
        })),
        jobs: JSON.parse(savedJobs).map((job: any) => ({
          ...job,
          createdAt: new Date(job.createdAt),
          updatedAt: new Date(job.updatedAt)
        })),
        candidates: JSON.parse(savedCandidates).map((candidate: any) => ({
          ...candidate,
          submittedAt: new Date(candidate.submittedAt)
        }))
      };
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
  
  // Fallback to dummy data if no saved data or error
  return createDummyData();
};

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState(() => loadInitialData());

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('tiers', JSON.stringify(data.tiers));
      localStorage.setItem('clients', JSON.stringify(data.clients));
      localStorage.setItem('jobs', JSON.stringify(data.jobs));
      localStorage.setItem('candidates', JSON.stringify(data.candidates));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [data]);

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'tierId' | 'availableCredits' | 'jobsRemaining' | 'creditsResetDate'>) => {
    const freeTier = data.tiers.find(tier => tier.name === 'Free');
    if (!freeTier) {
      throw new Error('Free tier not found');
    }

    const now = new Date();
    const creditsResetDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    const newClient: Client = {
      id: crypto.randomUUID(),
      ...clientData,
      tierId: freeTier.id,
      availableCredits: freeTier.monthlyCandidateAllotment,
      jobsRemaining: freeTier.monthlyJobAllotment,
      creditsResetDate,
      createdAt: new Date()
    };
    
    setData(prev => ({
      ...prev,
      clients: [...prev.clients, newClient]
    }));
    
    return newClient;
  };

  const addJob = (jobData: Omit<Job, 'id' | 'status' | 'sourcerName' | 'completionLink' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newJob: Job = {
      id: crypto.randomUUID(),
      ...jobData,
      status: 'Unclaimed',
      sourcerName: null,
      completionLink: null,
      createdAt: now,
      updatedAt: now
    };
    
    setData(prev => {
      // Check if client has jobs remaining
      const client = prev.clients.find(c => c.id === jobData.clientId);
      if (!client) {
        throw new Error('Client not found');
      }

      if (client.jobsRemaining <= 0) {
        throw new Error('No job submissions remaining for this billing period');
      }

      return {
        ...prev,
        jobs: [...prev.jobs, newJob],
        clients: prev.clients.map(c => 
          c.id === jobData.clientId 
            ? { ...c, jobsRemaining: c.jobsRemaining - 1 }
            : c
        )
      };
    });
    
    return newJob;
  };

  const addCandidate = (candidateData: Omit<Candidate, 'id' | 'submittedAt'>) => {
    const newCandidate: Candidate = {
      id: crypto.randomUUID(),
      ...candidateData,
      submittedAt: new Date()
    };
    
    setData(prev => ({
      ...prev,
      candidates: [...prev.candidates, newCandidate]
    }));
    
    return newCandidate;
  };

  const addCandidatesFromLinkedIn = async (jobId: string, linkedinUrls: string[]): Promise<{ 
    success: boolean; 
    acceptedCount: number; 
    rejectedCount: number; 
    error?: string 
  }> => {
    try {
      // Enforce 50-candidate limit per submission
      if (linkedinUrls.length > 50) {
        return {
          success: false,
          acceptedCount: 0,
          rejectedCount: 0,
          error: 'Cannot submit more than 50 candidates per job submission'
        };
      }

      // Get the job and client to check available credits
      const job = data.jobs.find(j => j.id === jobId);
      if (!job) {
        return {
          success: false,
          acceptedCount: 0,
          rejectedCount: 0,
          error: 'Job not found'
        };
      }

      const client = data.clients.find(c => c.id === job.clientId);
      if (!client) {
        return {
          success: false,
          acceptedCount: 0,
          rejectedCount: 0,
          error: 'Client not found'
        };
      }

      // Check if client has enough credits
      if (client.availableCredits < linkedinUrls.length) {
        return {
          success: false,
          acceptedCount: 0,
          rejectedCount: 0,
          error: `Insufficient credits. Available: ${client.availableCredits}, Required: ${linkedinUrls.length}`
        };
      }

      // Get current accepted candidates for this job to calculate progress
      const currentCandidates = data.candidates.filter(c => c.jobId === jobId);
      const currentAcceptedCount = currentCandidates.length;
      
      // Check for duplicates across all existing candidates
      const existingLinkedInUrls = new Set(
        data.candidates.map(c => c.linkedinUrl.toLowerCase().trim())
      );
      
      const duplicateUrls: string[] = [];
      const uniqueUrls: string[] = [];
      
      linkedinUrls.forEach(url => {
        const normalizedUrl = url.toLowerCase().trim();
        if (existingLinkedInUrls.has(normalizedUrl)) {
          duplicateUrls.push(url);
        } else {
          uniqueUrls.push(url);
        }
      });
      // Use the actual Apify scraping service
      const scrapingResult = await scrapeLinkedInProfiles(uniqueUrls);
      
      if (!scrapingResult.success) {
        return {
          success: false,
          acceptedCount: 0,
          rejectedCount: 0,
          error: scrapingResult.error || 'Failed to scrape LinkedIn profiles'
        };
      }
      
      // Filter candidates based on AI score threshold (60%)
      const acceptedCandidates: Candidate[] = [];
      const rejectedCandidates: any[] = [];
      
      for (const profile of scrapingResult.profiles) {
        // Prepare candidate data for AI scoring
        const candidateData = {
          firstName: profile.firstName || 'N/A',
          lastName: profile.lastName || 'N/A',
          headline: profile.headline,
          location: profile.location,
          experience: profile.experience && profile.experience.length > 0 ? profile.experience : undefined,
          education: profile.education && profile.education.length > 0 ? profile.education : undefined,
          skills: profile.skills && profile.skills.length > 0 ? profile.skills : undefined,
          about: profile.summary
        };
        
        // Generate AI match score
        const matchData = {
          jobTitle: job.title,
          jobDescription: job.description,
          seniorityLevel: job.seniorityLevel,
          keySkills: job.keySellingPoints, // Using selling points as key skills
          candidateData
        };
        
        try {
          const scoreResult = await generateJobMatchScore(matchData);
          
          if (scoreResult.score >= 60) {
            // Accept candidate - meets threshold
            const candidate: Candidate = {
              id: crypto.randomUUID(),
              jobId,
              firstName: candidateData.firstName,
              lastName: candidateData.lastName,
              linkedinUrl: profile.profileUrl || linkedinUrls[scrapingResult.profiles.indexOf(profile)] || '',
              headline: candidateData.headline,
              location: candidateData.location,
              experience: candidateData.experience,
              education: candidateData.education,
              skills: candidateData.skills,
              summary: profile.summary,
              submittedAt: new Date()
            };
            acceptedCandidates.push(candidate);
          } else {
            // Reject candidate - below threshold
            rejectedCandidates.push({
              name: `${candidateData.firstName} ${candidateData.lastName}`,
              score: scoreResult.score,
              reasoning: scoreResult.reasoning
            });
          }
        } catch (error) {
          console.error('Error calculating match score for candidate:', error);
          // On scoring error, reject the candidate to be safe
          rejectedCandidates.push({
            name: `${candidateData.firstName} ${candidateData.lastName}`,
            score: 0,
            reasoning: 'Unable to calculate match score'
          });
        }
      }

      // Only add accepted candidates to the system
      if (acceptedCandidates.length > 0) {
        setData(prev => ({
          ...prev,
          candidates: [...prev.candidates, ...acceptedCandidates]
        }));
      }

      // Deduct credits only for accepted candidates
      if (acceptedCandidates.length > 0) {
        setData(prev => ({
          ...prev,
          clients: prev.clients.map(c => 
            c.id === client.id 
              ? { ...c, availableCredits: c.availableCredits - acceptedCandidates.length }
              : c
          )
        }));
      }

      // Calculate new totals after this submission
      const newTotalAccepted = currentAcceptedCount + acceptedCandidates.length;
      const stillNeeded = Math.max(0, job.candidatesRequested - newTotalAccepted);
      const progressPercentage = Math.round((newTotalAccepted / job.candidatesRequested) * 100);

      // Check if job is now complete
      const isJobComplete = newTotalAccepted >= job.candidatesRequested;

      // Build detailed results message
      let resultMessage = `SUBMISSION RESULTS:\n✅ ${acceptedCandidates.length} candidates ACCEPTED this submission\n`;
      
      if (duplicateUrls.length > 0) {
        resultMessage += `🔄 ${duplicateUrls.length} candidates SKIPPED (duplicates already in system)\n`;
      }
      
      if (rejectedCandidates.length > 0) {
        resultMessage += `❌ ${rejectedCandidates.length} candidates REJECTED (below 60% AI match)\n`;
        const rejectedNames = rejectedCandidates.map(r => `${r.name} (${r.score}%)`).join(', ');
        resultMessage += `\nREJECTED: ${rejectedNames}\n`;
      }
      
      if (duplicateUrls.length > 0) {
        resultMessage += `\nDUPLICATES: ${duplicateUrls.join(', ')}\n`;
      }
      
      resultMessage += `\n📊 JOB PROGRESS: ${newTotalAccepted}/${job.candidatesRequested} candidates (${progressPercentage}% complete)\n\n`;
      resultMessage += isJobComplete 
        ? '🎉 JOB COMPLETED! All required candidates have been submitted.' 
        : `🎯 NEXT STEPS: Submit ${stillNeeded} more quality candidate${stillNeeded !== 1 ? 's' : ''} to complete this job.`;
      
      // Return results with detailed information
      return {
        success: isJobComplete,
        acceptedCount: acceptedCandidates.length,
        rejectedCount: rejectedCandidates.length + duplicateUrls.length,
        error: resultMessage
      };
    } catch (error) {
      console.error('Error adding candidates from LinkedIn:', error);
      return { 
        success: false, 
        acceptedCount: 0,
        rejectedCount: 0,
        error: error instanceof Error ? error.message : 'Failed to scrape LinkedIn profiles' 
      };
    }
  };

  const updateJob = (jobId: string, updates: Partial<Job>) => {
    let updatedJob: Job | null = null;
    let shouldDecrementJobs = false;
    
    setData(prev => {
      const existingJob = prev.jobs.find(job => job.id === jobId);
      
      // Check if job status is changing from 'Unclaimed' to 'Claimed'
      if (existingJob && existingJob.status === 'Unclaimed' && updates.status === 'Claimed') {
        shouldDecrementJobs = true;
      }
      
      const updatedJobs = prev.jobs.map(job => {
        if (job.id === jobId) {
          updatedJob = {
            ...job,
            ...updates,
            updatedAt: new Date()
          };
          return updatedJob;
        }
        return job;
      });
      
      // Update client's jobsRemaining if needed
      const updatedClients = shouldDecrementJobs && updatedJob
        ? prev.clients.map(client => 
            client.id === updatedJob.clientId 
              ? { ...client, jobsRemaining: Math.max(0, client.jobsRemaining - 1) }
              : client
          )
        : prev.clients;
      
      return {
        ...prev,
        jobs: updatedJobs,
        clients: updatedClients
      };
    });
    
    return updatedJob;
  };

  const updateClient = (clientId: string, updates: Partial<Client>) => {
    let updatedClient: Client | null = null;
    
    setData(prev => ({
      ...prev,
      clients: prev.clients.map(client => {
        if (client.id === clientId) {
          updatedClient = { ...client, ...updates };
          return updatedClient;
        }
        return client;
      })
    }));
    
    return updatedClient;
  };

  const deleteJob = (jobId: string) => {
    setData(prev => ({
      ...prev,
      jobs: prev.jobs.filter(job => job.id !== jobId)
    }));
  };

  const deleteClient = (clientId: string) => {
    setData(prev => ({
      ...prev,
      clients: prev.clients.filter(client => client.id !== clientId),
      jobs: prev.jobs.filter(job => job.clientId !== clientId),
      candidates: prev.candidates.filter(candidate => {
        const job = prev.jobs.find(j => j.id === candidate.jobId);
        return job ? job.clientId !== clientId : true;
      })
    }));
  };

  const getCandidatesByJob = (jobId: string) => {
    return data.candidates.filter(candidate => candidate.jobId === jobId);
  };

  const getCandidatesByClient = (clientId: string) => {
    const clientJobs = data.jobs.filter(job => job.clientId === clientId);
    const jobIds = clientJobs.map(job => job.id);
    return data.candidates.filter(candidate => jobIds.includes(candidate.jobId));
  };

  const getJobsByStatus = (status: Job['status']) => {
    return data.jobs.filter(job => job.status === status);
  };

  const getClientById = (clientId: string) => {
    return data.clients.find(client => client.id === clientId) || null;
  };

  const getJobById = (jobId: string) => {
    return data.jobs.find(job => job.id === jobId) || null;
  };

  const getJobsByClient = (clientId: string) => {
    return data.jobs.filter(job => job.clientId === clientId);
  };

  const getTierById = (tierId: string) => {
    return data.tiers.find(tier => tier.id === tierId) || null;
  };

  const checkDuplicateEmail = (email: string) => {
    return data.clients.some(client => 
      client.email.toLowerCase() === email.toLowerCase() && 
      client.hasReceivedFreeShortlist
    );
  };

  const resetData = () => {
    if (window.confirm('Are you sure you want to reset ALL data? This will clear all jobs, clients, and candidates.')) {
      localStorage.removeItem('clients');
      localStorage.removeItem('jobs');
      localStorage.removeItem('candidates');
      localStorage.removeItem('tiers');
      const freshData = createDummyData();
      setData(freshData);
      console.log('Data reset successfully');
    }
  };

  const value = {
    tiers: data.tiers,
    clients: data.clients,
    jobs: data.jobs,
    candidates: data.candidates,
    addClient,
    addJob,
    addCandidate,
    addCandidatesFromLinkedIn,
    updateJob,
    updateClient,
    deleteJob,
    deleteClient,
    getCandidatesByJob,
    getCandidatesByClient,
    getJobsByStatus,
    getClientById,
    getJobById,
    getJobsByClient,
    getTierById,
    checkDuplicateEmail,
    resetData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};