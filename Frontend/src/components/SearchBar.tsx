import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (query: string, location: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, location);
  };

  return (
    <div className="bg-gradient-hero py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your Dream Job Today
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Discover thousands of job opportunities from top companies around the world
          </p>
        </div>

        <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Job title, keywords, or company"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12 border-0 focus:ring-2 focus:ring-primary text-lg"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="City, state, or remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 h-12 border-0 focus:ring-2 focus:ring-primary text-lg"
              />
            </div>
            <Button type="submit" className="btn-primary h-12 px-8 text-lg font-semibold">
              Search Jobs
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/80 text-sm">
            Popular searches: 
            <span className="ml-2 space-x-3">
              <button className="text-white hover:text-white/80 underline">Frontend Developer</button>
              <button className="text-white hover:text-white/80 underline">Product Manager</button>
              <button className="text-white hover:text-white/80 underline">Data Scientist</button>
              <button className="text-white hover:text-white/80 underline">Remote</button>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;