import React, { useState } from 'react';
import { X, MapPin, Clock, Building2, DollarSign, Share2, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Job } from './JobCard';

interface JobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

const JobModal: React.FC<JobModalProps> = ({ job, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    coverLetter: '',
    resume: null as File | null
  });

  if (!job) return null;

  const handleInputChange = (field: string, value: string) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setApplicationData(prev => ({
      ...prev,
      resume: file
    }));
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the application data to your backend
    console.log('Application submitted:', applicationData);
    alert('Application submitted successfully!');
    onClose();
  };

  const formatJobType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center">
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt={job.company} className="w-10 h-10 rounded" />
                ) : (
                  <Building2 className="h-8 w-8 text-white" />
                )}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-foreground mb-1">
                  {job.title}
                </DialogTitle>
                <p className="text-lg text-muted-foreground font-medium">{job.company}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Info Bar */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{job.location}</span>
            </div>
            {job.salary && (
              <div className="flex items-center space-x-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground font-medium">{job.salary}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{job.postedDate}</span>
            </div>
            <span className="job-badge-primary">
              {formatJobType(job.type)}
            </span>
            <span className="job-badge-primary">
              {job.experience}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button onClick={() => setActiveTab('apply')} className="btn-primary px-8">
              Apply Now
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details" className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Job Details</span>
              </TabsTrigger>
              <TabsTrigger value="apply" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Apply</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Job Description</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                  <div className="mt-4">
                    <p className="text-muted-foreground leading-relaxed">
                      We are looking for a talented professional to join our growing team. This role offers
                      excellent opportunities for career growth and the chance to work with cutting-edge
                      technologies. You'll be part of a collaborative environment where innovation and
                      creativity are valued.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-2 bg-primary/10 text-primary text-sm rounded-lg font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Company Information</h3>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">{job.company}</h4>
                  <p className="text-sm text-muted-foreground">
                    A leading company in the industry, committed to innovation and excellence.
                    We provide a dynamic work environment with opportunities for professional
                    development and career advancement.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="apply" className="mt-6">
              <form onSubmit={handleSubmitApplication} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={applicationData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={applicationData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="resume">Resume/CV *</Label>
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    required
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                </div>

                <div>
                  <Label htmlFor="coverLetter">Cover Letter</Label>
                  <Textarea
                    id="coverLetter"
                    value={applicationData.coverLetter}
                    onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                    placeholder="Tell us why you're perfect for this role..."
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-primary px-8">
                    Submit Application
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobModal;