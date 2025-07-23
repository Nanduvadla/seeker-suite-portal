import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  jobTypes: string[];
  experienceLevel: string[];
  salaryRange: number[];
  datePosted: string;
  industries: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    jobTypes: [],
    experienceLevel: [],
    salaryRange: [0, 200000],
    datePosted: '',
    industries: []
  });

  const [expandedSections, setExpandedSections] = useState({
    jobType: true,
    experience: true,
    salary: true,
    date: true,
    industry: true
  });

  const jobTypes = [
    { id: 'full-time', label: 'Full-time' },
    { id: 'part-time', label: 'Part-time' },
    { id: 'contract', label: 'Contract' },
    { id: 'internship', label: 'Internship' },
    { id: 'remote', label: 'Remote' }
  ];

  const experienceLevels = [
    { id: 'fresher', label: 'Fresher' },
    { id: '1-3', label: '1-3 years' },
    { id: '3-5', label: '3-5 years' },
    { id: '5+', label: '5+ years' }
  ];

  const industries = [
    { id: 'it', label: 'Information Technology' },
    { id: 'finance', label: 'Finance' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'edtech', label: 'EdTech' },
    { id: 'ecommerce', label: 'E-commerce' },
    { id: 'marketing', label: 'Marketing' }
  ];

  const handleCheckboxChange = (field: keyof FilterState, value: string, checked: boolean) => {
    const updatedFilters = { ...filters };
    const currentArray = updatedFilters[field] as string[];
    
    if (checked) {
      updatedFilters[field] = [...currentArray, value] as any;
    } else {
      updatedFilters[field] = currentArray.filter(item => item !== value) as any;
    }
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSalaryChange = (value: number[]) => {
    const updatedFilters = { ...filters, salaryRange: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleDateChange = (value: string) => {
    const updatedFilters = { ...filters, datePosted: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      jobTypes: [],
      experienceLevel: [],
      salaryRange: [0, 200000],
      datePosted: '',
      industries: []
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const FilterSection: React.FC<{ 
    title: string; 
    section: keyof typeof expandedSections; 
    children: React.ReactNode 
  }> = ({ title, section, children }) => (
    <div className="border-b border-border pb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <h3 className="font-semibold text-foreground">{title}</h3>
        {expandedSections[section] ? 
          <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        }
      </button>
      {expandedSections[section] && <div className="space-y-3">{children}</div>}
    </div>
  );

  return (
    <div className="w-80 bg-card border border-border rounded-lg p-6 h-fit sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-primary">
          Clear all
        </Button>
      </div>

      <div className="space-y-6">
        <FilterSection title="Job Type" section="jobType">
          {jobTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={type.id}
                checked={filters.jobTypes.includes(type.id)}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('jobTypes', type.id, checked as boolean)
                }
              />
              <label 
                htmlFor={type.id} 
                className="text-sm text-foreground cursor-pointer flex-1"
              >
                {type.label}
              </label>
            </div>
          ))}
        </FilterSection>

        <FilterSection title="Experience Level" section="experience">
          {experienceLevels.map((level) => (
            <div key={level.id} className="flex items-center space-x-2">
              <Checkbox
                id={level.id}
                checked={filters.experienceLevel.includes(level.id)}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('experienceLevel', level.id, checked as boolean)
                }
              />
              <label 
                htmlFor={level.id} 
                className="text-sm text-foreground cursor-pointer flex-1"
              >
                {level.label}
              </label>
            </div>
          ))}
        </FilterSection>

        <FilterSection title="Salary Range" section="salary">
          <div className="px-2">
            <Slider
              value={filters.salaryRange}
              onValueChange={handleSalaryChange}
              max={200000}
              min={0}
              step={5000}
              className="mb-3"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${filters.salaryRange[0].toLocaleString()}</span>
              <span>${filters.salaryRange[1].toLocaleString()}</span>
            </div>
          </div>
        </FilterSection>

        <FilterSection title="Date Posted" section="date">
          <Select value={filters.datePosted} onValueChange={handleDateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </FilterSection>

        <FilterSection title="Industry" section="industry">
          {industries.map((industry) => (
            <div key={industry.id} className="flex items-center space-x-2">
              <Checkbox
                id={industry.id}
                checked={filters.industries.includes(industry.id)}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('industries', industry.id, checked as boolean)
                }
              />
              <label 
                htmlFor={industry.id} 
                className="text-sm text-foreground cursor-pointer flex-1"
              >
                {industry.label}
              </label>
            </div>
          ))}
        </FilterSection>
      </div>
    </div>
  );
};

export default FilterSidebar;