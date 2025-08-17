import React, { useState, useEffect } from 'react';
import { ChevronDown, Filter, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import FilterSidebar, { FilterState } from '@/components/FilterSidebar';
import JobCard, { Job } from '@/components/JobCard';
import JobModal from '@/components/JobModal';
import PostJobForm from '@/components/PostJobForm';
import AuthModals from '@/components/AuthModals';
import Footer from '@/components/Footer';

// Sample job data
const sampleJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$120,000 - $160,000',
    type: 'full-time',
    experience: '5+ years',
    description: 'We are looking for a talented Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining user-facing web applications using modern frameworks and tools.',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL'],
    postedDate: '2 days ago',
    isBookmarked: false
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'Innovation Labs',
    location: 'New York, NY',
    salary: '$110,000 - $140,000',
    type: 'full-time',
    experience: '3-5 years',
    description: "Join our product team to drive the development of cutting-edge solutions. You'll work closely with engineering, design, and business stakeholders to deliver exceptional user experiences.",
    skills: ['Product Strategy', 'Agile', 'Data Analysis', 'User Research', 'Roadmapping'],
    postedDate: '1 day ago',
    isBookmarked: false
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    company: 'DesignStudio Pro',
    location: 'Remote',
    salary: '$85,000 - $110,000',
    type: 'remote',
    experience: '3-5 years',
    description: "Create beautiful and intuitive user experiences for our digital products. You'll collaborate with cross-functional teams to solve complex design challenges.",
    skills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'Design Systems'],
    postedDate: '3 days ago',
    isBookmarked: true
  },
  {
    id: '4',
    title: 'Data Scientist Intern',
    company: 'DataTech Solutions',
    location: 'Austin, TX',
    salary: '$25 - $35/hour',
    type: 'internship',
    experience: 'Fresher',
    description: 'Get hands-on experience in data science and machine learning. Work on real projects with our experienced team and contribute to impactful solutions.',
    skills: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'Scikit-learn'],
    postedDate: '5 days ago',
    isBookmarked: false
  },
  {
    id: '5',
    title: 'Backend Engineer',
    company: 'CloudTech Inc.',
    location: 'Seattle, WA',
    salary: '$95,000 - $130,000',
    type: 'full-time',
    experience: '3-5 years',
    description: 'Build scalable backend systems and APIs. Work with modern cloud technologies to create robust and efficient server-side applications.',
    skills: ['Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL'],
    postedDate: '1 week ago',
    isBookmarked: false
  },
  {
    id: '6',
    title: 'Marketing Specialist',
    company: 'GrowthCo',
    location: 'Los Angeles, CA',
    salary: '$60,000 - $80,000',
    type: 'part-time',
    experience: '1-3 years',
    description: 'Drive marketing initiatives and campaigns to help grow our brand. Work with digital marketing tools and analyze campaign performance.',
    skills: ['Digital Marketing', 'SEO', 'Google Analytics', 'Content Marketing', 'Social Media'],
    postedDate: '4 days ago',
    isBookmarked: false
  }
];

const Index = () => {
  const [jobs, setJobs] = useState<Job[]>(sampleJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(sampleJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    jobTypes: [],
    experienceLevel: [],
    salaryRange: [0, 200000],
    datePosted: '',
    industries: []
  });

  // Apply filters and search
  useEffect(() => {
    let filtered = [...jobs];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (searchLocation) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    // Job type filter
    if (filters.jobTypes.length > 0) {
      filtered = filtered.filter(job => filters.jobTypes.includes(job.type));
    }

    // Experience level filter
    if (filters.experienceLevel.length > 0) {
      filtered = filtered.filter(job => filters.experienceLevel.includes(job.experience.toLowerCase()));
    }

    // Date posted filter (simplified for demo)
    if (filters.datePosted) {
      // In a real app, you'd filter by actual dates
      filtered = filtered.filter(job => {
        if (filters.datePosted === '24h') return job.postedDate.includes('hour') || job.postedDate.includes('1 day');
        if (filters.datePosted === '7d') return !job.postedDate.includes('week');
        return true;
      });
    }

    // Sort jobs
    if (sortBy === 'newest') {
      filtered.sort((a, b) => {
        const aTime = getTimeValue(a.postedDate);
        const bTime = getTimeValue(b.postedDate);
        return aTime - bTime;
      });
    } else if (sortBy === 'salary-high') {
      filtered.sort((a, b) => {
        const aSalary = extractSalary(a.salary);
        const bSalary = extractSalary(b.salary);
        return bSalary - aSalary;
      });
    }

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [jobs, searchQuery, searchLocation, filters, sortBy]);

  const getTimeValue = (timeString: string): number => {
    if (timeString.includes('hour')) return 1;
    if (timeString.includes('1 day')) return 2;
    if (timeString.includes('2 days')) return 3;
    if (timeString.includes('3 days')) return 4;
    if (timeString.includes('4 days')) return 5;
    if (timeString.includes('5 days')) return 6;
    if (timeString.includes('week')) return 7;
    return 8;
  };

  const extractSalary = (salaryString?: string): number => {
    if (!salaryString) return 0;
    const numbers = salaryString.match(/\d+/g);
    if (numbers) {
      return parseInt(numbers[0]) * 1000;
    }
    return 0;
  };

  const handleSearch = (query: string, location: string) => {
    setSearchQuery(query);
    setSearchLocation(location);
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  const handleBookmarkToggle = (jobId: string) => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
      )
    );
  };

  const handleJobPosted = (newJob: Job) => {
    setJobs(prevJobs => [newJob, ...prevJobs]);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation
        onLoginClick={() => setIsLoginOpen(true)}
        onSignupClick={() => setIsSignupOpen(true)}
        onPostJobClick={() => setIsPostJobOpen(true)}
      />

      {/* Hero Section with Search */}
      <SearchBar onSearch={handleSearch} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center space-x-2 mb-4"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Sidebar */}
          <div className={`lg:block ${isSidebarOpen ? 'block' : 'hidden'}`}>
            <FilterSidebar onFilterChange={handleFilterChange} />
          </div>

          {/* Jobs Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {filteredJobs.length} Jobs Found
                </h2>
                <p className="text-muted-foreground">
                  {searchQuery && `for "${searchQuery}"`}
                  {searchLocation && ` in ${searchLocation}`}
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <div className="flex items-center space-x-2">
                  <SortAsc className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="salary-high">Salary: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Jobs Grid */}
            {currentJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {currentJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onJobClick={handleJobClick}
                    onBookmarkToggle={handleBookmarkToggle}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setSearchLocation('');
                    setFilters({
                      jobTypes: [],
                      experienceLevel: [],
                      salaryRange: [0, 200000],
                      datePosted: '',
                      industries: []
                    });
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    onClick={() => handlePageChange(pageNumber)}
                    className={currentPage === pageNumber ? "btn-primary" : ""}
                  >
                    {pageNumber}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <JobModal
        job={selectedJob}
        isOpen={isJobModalOpen}
        onClose={() => {
          setIsJobModalOpen(false);
          setSelectedJob(null);
        }}
      />

      <PostJobForm
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
        onJobPosted={handleJobPosted}
      />

      <AuthModals
        isLoginOpen={isLoginOpen}
        isSignupOpen={isSignupOpen}
        onLoginClose={() => setIsLoginOpen(false)}
        onSignupClose={() => setIsSignupOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
        onSwitchToLogin={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </div>
  );
};

export default Index;
