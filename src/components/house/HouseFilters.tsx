import React, { useState } from 'react';
import { Filter, Search, X } from 'lucide-react';

interface FilterOptions {
  minPrice: string;
  maxPrice: string;
  minBedrooms: string;
  location: string;
  searchTerm: string;
}

interface HouseFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

const HouseFilters = ({ onFilterChange }: HouseFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    location: '',
    searchTerm: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const clearFilters = () => {
    const emptyFilters = {
      minPrice: '',
      maxPrice: '',
      minBedrooms: '',
      location: '',
      searchTerm: '',
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-800">Find Your Perfect Stay</h2>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center gap-1 text-primary-600 text-sm font-medium"
          >
            <Filter className="w-4 h-4" />
            <span>{isOpen ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>
        
        {/* Quick search for all viewports */}
        <div className="relative">
          <input
            type="text"
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleChange}
            placeholder="Search..."
            className="form-input pl-9 py-1.5 w-[180px] sm:w-[240px]"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          {filters.searchTerm && (
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, searchTerm: '' }));
                onFilterChange({ ...filters, searchTerm: '' });
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className={`${isOpen || window.innerWidth >= 768 ? 'block' : 'hidden'} bg-white shadow-sm rounded-lg p-4 mt-4 animate-fade-in`}>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={filters.location}
              onChange={handleChange}
              placeholder="Any location"
              className="form-input py-2"
            />
          </div>
          
          <div>
            <label htmlFor="minPrice" className="form-label">
              Min Price
            </label>
            <input
              id="minPrice"
              name="minPrice"
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="Min $"
              className="form-input py-2"
            />
          </div>
          
          <div>
            <label htmlFor="maxPrice" className="form-label">
              Max Price
            </label>
            <input
              id="maxPrice"
              name="maxPrice"
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="Max $"
              className="form-input py-2"
            />
          </div>
          
          <div>
            <label htmlFor="minBedrooms" className="form-label">
              Min Bedrooms
            </label>
            <input
              id="minBedrooms"
              name="minBedrooms"
              type="number"
              min="0"
              value={filters.minBedrooms}
              onChange={handleChange}
              placeholder="Any"
              className="form-input py-2"
            />
          </div>
          
          <div className="md:col-span-4 flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
            >
              Apply Filters
            </button>
            
            <button
              type="button"
              onClick={clearFilters}
              className="btn btn-outline"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HouseFilters;