import React, { useState } from 'react';
import { Briefcase, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert('Thank you for subscribing to job alerts!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gradient">JobSeeker</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting talented professionals with amazing opportunities. 
              Your dream job is just a click away.
            </p>
            <div className="flex space-x-3">
              <button className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors">
                <Facebook className="h-4 w-4" />
              </button>
              <button className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors">
                <Twitter className="h-4 w-4" />
              </button>
              <button className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors">
                <Linkedin className="h-4 w-4" />
              </button>
              <button className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors">
                <Instagram className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">For Job Seekers</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Browse Jobs</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Job Alerts</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Resume Builder</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Career Advice</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Salary Guide</a></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">For Employers</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Post a Job</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Browse Resumes</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing Plans</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Recruiter Tools</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Company Profiles</a></li>
            </ul>
          </div>

          {/* Job Alerts Subscription */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest job opportunities delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="text-sm"
                required
              />
              <Button type="submit" className="btn-primary w-full text-sm">
                Subscribe to Job Alerts
              </Button>
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Email</p>
                <p className="text-sm text-muted-foreground">support@jobseeker.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Phone</p>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Address</p>
                <p className="text-sm text-muted-foreground">123 Business St, City, ST 12345</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center space-x-6">
              <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">About Us</a>
              <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Cookie Policy</a>
              <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Help Center</a>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2024 JobSeeker. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;