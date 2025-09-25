import React, { useState } from 'react';
import { MapPin, Clock, Bookmark, Building2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  experience: string;
  description: string;
  skills?: string[];
  postedDate: string;
  companyLogo?: string;
  isBookmarked?: boolean;
}

interface JobCardProps {
  job: Job;
  onJobClick: (job: Job) => void;
  onBookmarkToggle: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onJobClick, onBookmarkToggle }) => {
  const [isBookmarked, setIsBookmarked] = useState(job.isBookmarked || false);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmarkToggle(job.id);
  };

  const getJobTypeBadge = (type?: string) => {
  const badges = {
    'full-time': 'job-badge-primary',
    'part-time': 'job-badge-success',
    'contract': 'job-badge-warning',
    'internship': 'job-badge-primary',
    'remote': 'job-badge-success'
  };
  return type ? badges[type as keyof typeof badges] : 'job-badge-primary';
  };


  const formatJobType = (type?: string) => {
  if (!type) return "Not specified"; // prevents crash
  return type
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  };

  return (
    <Card className="card-hover cursor-pointer group bg-gradient-card border border-border/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.company} className="w-8 h-8 rounded" />
              ) : (
                <Building2 className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <h3 
                className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors cursor-pointer"
                onClick={() => onJobClick(job)}
              >
                {job.title}
              </h3>
              <p className="text-muted-foreground font-medium">{job.company}</p>
            </div>
          </div>
          
          <button
            onClick={handleBookmarkClick}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            {job.salary && (
              <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4" />
                <span>{job.salary}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{job.postedDate}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className={getJobTypeBadge(job.type)}>
              {formatJobType(job.type)}
            </span>
            <span className="job-badge-primary">
              {job.experience}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
           {job.skills && job.skills.length > 0 ? (
            <>
           {job.skills.slice(0, 3).map((skill, index) => (
           <span 
           key={index}
           className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
           >
          {skill}
          </span>
          ))}
          {job.skills.length > 3 && (
          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
          +{job.skills.length - 3} more
          </span>
          )}
          </>
          ) : (
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
           No skills listed
           </span>
          )}
         </div>


        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onJobClick(job)}
            className="btn-outline flex-1 mr-3"
          >
            View Details
          </Button>
          <Button 
            onClick={() => onJobClick(job)}
            className="btn-primary px-6"
          >
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;