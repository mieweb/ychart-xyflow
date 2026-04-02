import { useCallback, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';

export function SearchBar() {
  const {
    searchQuery,
    searchResults,
    searchIndex,
    search,
    clearSearch,
    nextResult,
    prevResult,
  } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.shiftKey ? prevResult() : nextResult();
      } else if (e.key === 'Escape') {
        clearSearch();
      }
    },
    [nextResult, prevResult, clearSearch]
  );

  return (
    <div className="ychart-searchbar" role="search" aria-label="Search nodes">
      <input
        ref={inputRef}
        type="text"
        className="ychart-search-input"
        placeholder="Search nodes..."
        value={searchQuery}
        onChange={(e) => search(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Search query"
      />
      {searchResults.length > 0 && (
        <span className="ychart-search-count" aria-live="polite">
          {searchIndex + 1} / {searchResults.length}
        </span>
      )}
      <button
        className="ychart-search-nav-btn"
        onClick={prevResult}
        aria-label="Previous result"
        disabled={searchResults.length === 0}
      >
        <ChevronUp size={14} />
      </button>
      <button
        className="ychart-search-nav-btn"
        onClick={nextResult}
        aria-label="Next result"
        disabled={searchResults.length === 0}
      >
        <ChevronDown size={14} />
      </button>
      <button
        className="ychart-search-close-btn"
        onClick={clearSearch}
        aria-label="Close search"
      >
        <X size={14} />
      </button>
    </div>
  );
}
