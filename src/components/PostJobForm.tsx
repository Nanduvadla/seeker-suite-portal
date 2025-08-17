import React, { useState } from 'react';
import { X, Building2, MapPin, DollarSign, FileText, Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Job } from './JobCard';

interface PostJobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onJobPosted: (job: Job) => void;
}

const PostJobForm: React.FC<PostJobFormProps> = ({ isOpen, onClose, onJobPosted }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: '',
    experience: '',
    description: '',
    skills: '',
    contactEmail: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const jobTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'remote', label: 'Remote' }
  ];

  const experienceLevels = [
    { value: 'fresher', label: 'Fresher' },
    { value: '1-3 years', label: '1-3 years' },
    { value: '3-5 years', label: '3-5 years' },
    { value: '5+ years', label: '5+ years' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.type) newErrors.type = 'Job type is required';
    if (!formData.experience) newErrors.experience = 'Experience level is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (!formData.skills.trim()) newErrors.skills = 'Skills are required';
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newJob: Job = {
      id: Date.now().toString(),
      title: formData.title,
      company: formData.company,
      location: formData.location,
      salary: formData.salary || undefined,
      type: formData.type as Job['type'],
      experience: formData.experience,
      description: formData.description,
      skills: formData.skills.split(',').map(skill => skill.trim()),
      postedDate: 'Just posted',
      isBookmarked: false
    };

    onJobPosted(newJob);
    
    // Reset form
    setFormData({
      title: '',
      company: '',
      location: '',
      salary: '',
      type: '',
      experience: '',
      description: '',
      skills: '',
      contactEmail: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <DialogTitle className="text-xl font-bold text-foreground">
                Post a New Job
              </DialogTitle>
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

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g. Senior Frontend Developer"
                className={`mt-1 ${errors.title ? 'border-destructive' : ''}`}
              />
              {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
            </div>

            <div>
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="e.g. TechCorp Inc."
                className={`mt-1 ${errors.company ? 'border-destructive' : ''}`}
              />
              {errors.company && <p className="text-xs text-destructive mt-1">{errors.company}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g. San Francisco, CA or Remote"
                  className={`pl-10 mt-1 ${errors.location ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.location && <p className="text-xs text-destructive mt-1">{errors.location}</p>}
            </div>

            <div>
              <Label htmlFor="salary">Salary Range</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="salary"
                  type="text"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  placeholder="e.g. $80,000 - $120,000"
                  className="pl-10 mt-1"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Job Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger className={`mt-1 ${errors.type ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-xs text-destructive mt-1">{errors.type}</p>}
            </div>

            <div>
              <Label htmlFor="experience">Experience Level *</Label>
              <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                <SelectTrigger className={`mt-1 ${errors.experience ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.experience && <p className="text-xs text-destructive mt-1">{errors.experience}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Job Description *</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
                rows={4}
                className={`pl-10 mt-1 ${errors.description ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
          </div>

          <div>
            <Label htmlFor="skills">Required Skills *</Label>
            <div className="relative">
              <Tags className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="skills"
                type="text"
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                placeholder="e.g. React, TypeScript, Node.js (separate with commas)"
                className={`pl-10 mt-1 ${errors.skills ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.skills && <p className="text-xs text-destructive mt-1">{errors.skills}</p>}
          </div>

          <div>
            <Label htmlFor="contactEmail">Contact Email *</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              placeholder="recruiter@company.com"
              className={`mt-1 ${errors.contactEmail ? 'border-destructive' : ''}`}
            />
            {errors.contactEmail && <p className="text-xs text-destructive mt-1">{errors.contactEmail}</p>}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="btn-primary px-8">
              Post Job
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostJobForm;