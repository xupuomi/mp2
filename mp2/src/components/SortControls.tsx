import React from 'react';

export interface SortOption {
  value: string;
  label: string;
}

interface SortControlsProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  options?: SortOption[];
}

const defaultSortOptions: SortOption[] = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'popularity.asc', label: 'Least Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'vote_average.asc', label: 'Lowest Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' },
  { value: 'title.asc', label: 'A-Z' },
  { value: 'title.desc', label: 'Z-A' }
];

const SortControls: React.FC<SortControlsProps> = ({
  sortBy,
  onSortChange,
  options = defaultSortOptions
}) => {
  return (
    <div className="sort-controls">
      <label htmlFor="sort-select" className="sort-label">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="sort-select"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortControls;