'use client';

import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

export const SearchBar = ({
  placeholder = 'Search records...',
  value: controlledValue = '',
  onChange,
  debounceMs = 300,
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState(controlledValue);

  useEffect(() => {
    setSearchTerm(controlledValue);
  }, [controlledValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== controlledValue) {
        onChange(searchTerm);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs, onChange, controlledValue]);

  const handleClear = () => {
    setSearchTerm('');
    onChange('');
  };

  return (
    <div className="relative w-full max-w-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-slate-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-2xs"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600"
          aria-label="Clear search query"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
