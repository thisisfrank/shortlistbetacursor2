import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Search, Award, TrendingUp, Users, Clock, Target, Edit, Trash2, Save, X } from 'lucide-react';

export const SourcerManagement: React.FC = () => {
  const { jobs, candidates, getCandidatesByJob, updateJob } = useData();
  const [search, setSearch] = useState('');
  const [selectedSourcer, setSelectedSourcer] = useState<string | null>(null);
  const [editingSourcer, setEditingSourcer] = useState<string | null>(null);
  const [newSourcerName, setNewSourcerName] = useState('');

  // Get all unique sourcers
  const sourcers = [...new Set(jobs.filter(job => job.sourcerName).map(job => job.sourcerName!))]
    .map(sourcerName => {
      const sourcerJobs = jobs.filter(job => job.sourcerName === sourcerName);
      const completedJobs = sourcerJobs.filter(job => job.status === 'Completed');
      const claimedJobs = sourcerJobs.filter(job => job.status === 'Claimed');
      
      const totalCandidates = sourcerJobs.reduce((acc, job) => {
        return acc + getCandidatesByJob(job.id).length;
      }, 0);

      const avgCandidatesPerJob = completedJobs.length > 0 
        ? Math.round(totalCandidates / completedJobs.length) 
        : 0;

      const avgCompletionTime = completedJobs.reduce((acc, job) => {
        const created = new Date(job.createdAt).getTime();
        const updated = new Date(job.updatedAt).getTime();
        return acc + (updated - created);
      }, 0) / completedJobs.length;

      const avgDays = avgCompletionTime ? Math.round(avgCompletionTime / (1000 * 60 * 60 * 24)) : 0;

      return {
        name: sourcerName,
        totalJobs: sourcerJobs.length,
        completedJobs: completedJobs.length,
        claimedJobs: claimedJobs.length,
        totalCandidates,
        avgCandidatesPerJob,
        avgCompletionDays: avgDays,
        successRate: sourcerJobs.length > 0 ? Math.round((completedJobs.length / sourcerJobs.length) * 100) : 0,
        lastActive: sourcerJobs.length > 0 
          ? new Date(Math.max(...sourcerJobs.map(job => new Date(job.updatedAt).getTime())))
          : new Date()
      };
    });

  // Filter sourcers based on search
  const filteredSourcers = sourcers.filter(sourcer =>
    sourcer.name.toLowerCase().includes(search.toLowerCase())
  );

  // Sort by performance (completed jobs)
  const sortedSourcers = [...filteredSourcers].sort((a, b) => b.completedJobs - a.completedJobs);

  const handleReassignJobs = (sourcerName: string) => {
    const sourcerJobs = jobs.filter(job => job.sourcerName === sourcerName && job.status === 'Claimed');
    
    if (sourcerJobs.length === 0) {
      alert('No active jobs to reassign for this sourcer.');
      return;
    }

    if (window.confirm(`Reassign ${sourcerJobs.length} active job(s) from ${sourcerName} back to unclaimed status?`)) {
      sourcerJobs.forEach(job => {
        updateJob(job.id, {
          status: 'Unclaimed',
          sourcerName: null
        });
      });
      alert(`Successfully reassigned ${sourcerJobs.length} job(s).`);
    }
  };

  const handleForceComplete = (sourcerName: string) => {
    const sourcerJobs = jobs.filter(job => job.sourcerName === sourcerName && job.status === 'Claimed');
    
    if (sourcerJobs.length === 0) {
      alert('No active jobs to complete for this sourcer.');
      return;
    }

    if (window.confirm(`Force complete ${sourcerJobs.length} active job(s) for ${sourcerName}?`)) {
      sourcerJobs.forEach(job => {
        updateJob(job.id, {
          status: 'Completed',
          completionLink: 'Admin override - marked as completed'
        });
      });
      alert(`Successfully completed ${sourcerJobs.length} job(s).`);
    }
  };

  const handleEditSourcer = (oldName: string) => {
    setEditingSourcer(oldName);
    setNewSourcerName(oldName);
  };

  const handleSaveSourcerName = () => {
    if (!editingSourcer || !newSourcerName.trim()) return;
    
    if (window.confirm(`Update all jobs from "${editingSourcer}" to "${newSourcerName}"?`)) {
      // Update all jobs with this sourcer name
      jobs
        .filter(job => job.sourcerName === editingSourcer)
        .forEach(job => {
          updateJob(job.id, { sourcerName: newSourcerName.trim() });
        });
      
      // Update localStorage if this is the current sourcer
      if (localStorage.getItem('sourcerName') === editingSourcer) {
        localStorage.setItem('sourcerName', newSourcerName.trim());
      }
      
      setEditingSourcer(null);
      setNewSourcerName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingSourcer(null);
    setNewSourcerName('');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getPerformanceColor = (successRate: number) => {
    if (successRate >= 80) return 'text-green-400';
    if (successRate >= 60) return 'text-supernova';
    if (successRate >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getPerformanceBadge = (successRate: number) => {
    if (successRate >= 80) return { variant: 'success' as const, label: 'EXCELLENT' };
    if (successRate >= 60) return { variant: 'default' as const, label: 'GOOD' };
    if (successRate >= 40) return { variant: 'warning' as const, label: 'AVERAGE' };
    return { variant: 'error' as const, label: 'NEEDS IMPROVEMENT' };
  };

  return (
    <div className="space-y-8">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-anton text-white-knight uppercase tracking-wide mb-2">Sourcer Management</h2>
          <p className="text-guardian font-jakarta">Monitor and manage sourcer performance and assignments</p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-guardian" />
          </div>
          <input
            type="text"
            placeholder="Search sourcers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 block w-full rounded-lg border-guardian/30 bg-shadowforce text-white-knight placeholder-guardian/60 focus:ring-supernova focus:border-supernova font-jakarta"
          />
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-supernova/20 to-supernova/10 border-supernova/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-anton text-lg text-supernova uppercase tracking-wide">Total Sourcers</h3>
                <p className="text-3xl font-anton text-white-knight">{sourcers.length}</p>
              </div>
              <Users className="text-supernova" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-500/10 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-anton text-lg text-green-400 uppercase tracking-wide">Avg Success Rate</h3>
                <p className="text-3xl font-anton text-white-knight">
                  {sourcers.length > 0 
                    ? Math.round(sourcers.reduce((acc, s) => acc + s.successRate, 0) / sourcers.length)
                    : 0}%
                </p>
              </div>
              <Target className="text-green-400" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-anton text-lg text-blue-400 uppercase tracking-wide">Total Completed</h3>
                <p className="text-3xl font-anton text-white-knight">
                  {sourcers.reduce((acc, s) => acc + s.completedJobs, 0)}
                </p>
              </div>
              <Award className="text-blue-400" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-anton text-lg text-purple-400 uppercase tracking-wide">Avg Completion</h3>
                <p className="text-3xl font-anton text-white-knight">
                  {sourcers.length > 0 
                    ? Math.round(sourcers.reduce((acc, s) => acc + s.avgCompletionDays, 0) / sourcers.length)
                    : 0}d
                </p>
              </div>
              <Clock className="text-purple-400" size={32} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sourcer List */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-anton text-white-knight uppercase tracking-wide">Sourcer Performance</h3>
        </CardHeader>
        <CardContent>
          {sortedSourcers.length === 0 ? (
            <div className="text-center py-16">
              <Users size={64} className="text-guardian/40 mx-auto mb-4" />
              <h3 className="font-anton text-2xl text-guardian mb-2">NO SOURCERS FOUND</h3>
              <p className="text-guardian/80 font-jakarta">No sourcers match your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-guardian/20">
                <thead className="bg-shadowforce">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-anton text-guardian uppercase tracking-wider">
                      Sourcer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-anton text-guardian uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-anton text-guardian uppercase tracking-wider">
                      Jobs
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-anton text-guardian uppercase tracking-wider">
                      Candidates
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-anton text-guardian uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-anton text-guardian uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-shadowforce-light divide-y divide-guardian/20">
                  {sortedSourcers.map((sourcer) => {
                    const performanceBadge = getPerformanceBadge(sourcer.successRate);
                    return (
                      <tr key={sourcer.name} className="hover:bg-shadowforce transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              {editingSourcer === sourcer.name ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={newSourcerName}
                                    onChange={(e) => setNewSourcerName(e.target.value)}
                                    className="text-sm bg-shadowforce border border-guardian/30 rounded px-2 py-1 text-white-knight"
                                  />
                                  <Button variant="success" size="sm" onClick={handleSaveSourcerName}>
                                    <Save size={12} />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                                    <X size={12} />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-supernova rounded-full flex items-center justify-center mr-3">
                                    <span className="text-shadowforce font-anton text-sm">
                                      {sourcer.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="text-sm font-jakarta font-bold text-white-knight">
                                      {sourcer.name}
                                    </div>
                                    <div className="text-sm text-guardian">
                                      {sourcer.avgCompletionDays}d avg completion
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className="text-sm text-guardian">
                                {sourcer.avgCompletionDays}d avg completion
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Badge variant={performanceBadge.variant} className="text-xs">
                              {performanceBadge.label}
                            </Badge>
                            <span className={`font-anton text-lg ${getPerformanceColor(sourcer.successRate)}`}>
                              {sourcer.successRate}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="text-white-knight font-jakarta font-semibold">
                              {sourcer.completedJobs} completed
                            </div>
                            <div className="text-guardian">
                              {sourcer.claimedJobs} in progress
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="text-white-knight font-jakarta font-semibold">
                              {sourcer.totalCandidates} total
                            </div>
                            <div className="text-guardian">
                              {sourcer.avgCandidatesPerJob} avg/job
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-guardian font-jakarta">
                          {formatDate(sourcer.lastActive)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedSourcer(sourcer.name)}
                          >
                            VIEW
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditSourcer(sourcer.name)}
                            disabled={editingSourcer === sourcer.name}
                          >
                            <Edit size={14} />
                          </Button>
                          {sourcer.claimedJobs > 0 && (
                            <>
                              <Button
                                variant="warning"
                                size="sm"
                                onClick={() => handleReassignJobs(sourcer.name)}
                              >
                                REASSIGN
                              </Button>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleForceComplete(sourcer.name)}
                              >
                                COMPLETE
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sourcer Detail Modal */}
      {selectedSourcer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-anton text-white-knight uppercase tracking-wide">
                  {selectedSourcer} - Detailed Performance
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSourcer(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Sourcer's Jobs */}
                <div>
                  <h4 className="text-lg font-anton text-supernova mb-4 uppercase tracking-wide">
                    Job History
                  </h4>
                  <div className="space-y-3">
                    {jobs
                      .filter(job => job.sourcerName === selectedSourcer)
                      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                      .map(job => (
                        <div key={job.id} className="bg-shadowforce p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="text-white-knight font-jakarta font-semibold">{job.title}</h5>
                              <p className="text-guardian font-jakarta text-sm">
                                {getCandidatesByJob(job.id).length} candidates submitted
                              </p>
                            </div>
                            <Badge
                              variant={
                                job.status === 'Completed' ? 'success' :
                                job.status === 'Claimed' ? 'default' : 'warning'
                              }
                            >
                              {job.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}