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

const Index = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
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

  // ✅ Fetch jobs from backend on mount
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/jobs/")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch jobs");
        return res.json();
      })
      .then(data => {
        setJobs(data);
        setFilteredJobs(data);
      })
      .catch(err => {
        console.error("Error fetching jobs:", err);
      });
  }, []);

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
      filtered = filtered.filter(job =>
        filters.experienceLevel.includes(job.experience.toLowerCase())
      );
    }

    // Date posted filter (simplified for demo)
    if (filters.datePosted) {
      filtered = filtered.filter(job => {
        if (filters.datePosted === '24h') return job.postedDate?.includes('hour') || job.postedDate?.includes('1 day');
        if (filters.datePosted === '7d') return !job.postedDate?.includes('week');
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

  const getTimeValue = (timeString: string = ''): number => {
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
    // Call backend to toggle bookmark
    fetch(`http://127.0.0.1:5000/api/jobs/${jobId}/bookmark`, { method: "PUT" })
      .then(res => res.json())
      .then(updatedJob => {
        setJobs(prevJobs =>
          prevJobs.map(job =>
            job.id === jobId ? updatedJob : job
          )
        );
      })
      .catch(err => console.error("Error toggling bookmark:", err));
  };

  const handleJobPosted = (newJob: Job) => {
    // Call backend to post job
    fetch("http://127.0.0.1:5000/api/jobs/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJob)
    })
      .then(res => res.json())
      .then(savedJob => {
        setJobs(prevJobs => [savedJob, ...prevJobs]);
      })
      .catch(err => console.error("Error posting job:", err));
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
