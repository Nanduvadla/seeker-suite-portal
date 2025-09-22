import React, { useState } from 'react';
import { Briefcase, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onPostJobClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onLoginClick, onSignupClick, onPostJobClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">JobSeeker</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Browse Jobs
            </a>
            <button 
              onClick={onPostJobClick}
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Post a Job
            </button>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Contact
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" onClick={onLoginClick} className="text-muted-foreground hover:text-primary">
              Login
            </Button>
            <Button onClick={onSignupClick} className="btn-primary rounded-lg px-6">
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 text-foreground font-medium">
                Home
              </a>
              <a href="#" className="block px-3 py-2 text-muted-foreground hover:text-primary">
                Browse Jobs
              </a>
              <button 
                onClick={onPostJobClick}
                className="block w-full text-left px-3 py-2 text-muted-foreground hover:text-primary"
              >
                Post a Job
              </button>
              <a href="#" className="block px-3 py-2 text-muted-foreground hover:text-primary">
                Contact
              </a>
              <div className="px-3 py-2 space-y-2">
                <Button variant="ghost" onClick={onLoginClick} className="w-full justify-start">
                  Login
                </Button>
                <Button onClick={onSignupClick} className="btn-primary w-full">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;