import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { FormInput } from '../components/forms/FormInput';
import { 
  Zap, 
  ArrowRight,
  CheckCircle,
  Users,
  Target,
  Clock
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    title: '',
    description: '',
    location: '',
    candidatesRequested: '5'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setShowSuccess(true);
    setIsSubmitting(false);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-shadowforce via-shadowforce-dark to-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-anton text-white-knight mb-4 uppercase tracking-wide">
            Request Submitted!
          </h2>
          <p className="text-guardian font-jakarta mb-6">
            Thank you for your interest in Super Recruiter. We'll contact you within 24 hours to discuss your recruitment needs.
          </p>
          <Button 
            variant="primary"
            onClick={() => setShowSuccess(false)}
          >
            Submit Another Request
          </Button>
        </Card>
      </div>
    );
  }

  return (
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

      {/* Form Section */}
      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8">
            <h2 className="text-2xl font-anton text-white-knight mb-6 uppercase tracking-wide text-center">
              Submit Your Job Requirements
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-jakarta font-semibold text-supernova uppercase tracking-wide">
                  Company Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                  <FormInput
                    label="Contact Name"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <FormInput
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Job Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-jakarta font-semibold text-supernova uppercase tracking-wide">
                  Job Information
                </h3>
                
                <FormInput
                  label="Job Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                
                <FormInput
                  label="Job Description"
                  name="description"
                  type="textarea"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe the role, responsibilities, and requirements..."
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                  <FormInput
                    label="Candidates Requested"
                    name="candidatesRequested"
                    type="select"
                    value={formData.candidatesRequested}
                    onChange={handleInputChange}
                    required
                    options={[
                      { value: '3', label: '3 Candidates' },
                      { value: '5', label: '5 Candidates' },
                      { value: '10', label: '10 Candidates' },
                      { value: '15', label: '15 Candidates' }
                    ]}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full text-lg py-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Get Candidates
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
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
  );
};