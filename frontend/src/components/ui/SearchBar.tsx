import React, { useState } from 'react';
import { Search, Calendar, Filter, Save, ExternalLink } from 'lucide-react';
import { searchScholarAPI, savePapersAPI, SerpSearchResult } from '../../services/serpApi';

interface SearchBarProps {
  onSearchResults?: (results: SerpSearchResult[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fromYear, setFromYear] = useState('');
  const [tillYear, setTillYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SerpSearchResult[]>([]);
  const [selectedPapers, setSelectedPapers] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const params = {
        query: searchQuery,
        fromYear: fromYear ? parseInt(fromYear) : undefined,
        tillYear: tillYear ? parseInt(tillYear) : undefined,
      };

      const response = await searchScholarAPI(params);
      if (response.success) {
        setSearchResults(response.data);
        onSearchResults?.(response.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
      // You can add toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSelected = async () => {
    if (selectedPapers.size === 0) return;

    const papersToSave = Array.from(selectedPapers).map(index => searchResults[index]);
    
    try {
      await savePapersAPI(papersToSave);
      setSelectedPapers(new Set());
      // You can add success toast notification here
      alert('Papers saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      // You can add error toast notification here
    }
  };

  const togglePaperSelection = (index: number) => {
    const newSelected = new Set(selectedPapers);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedPapers(newSelected);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for research papers..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>
        <button
          onClick={handleSearch}
          disabled={isLoading || !searchQuery.trim()}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Search className="h-5 w-5" />
          )}
          <span>{isLoading ? 'Searching...' : 'Search'}</span>
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Year
            </label>
            <input
              type="number"
              value={fromYear}
              onChange={(e) => setFromYear(e.target.value)}
              placeholder="e.g., 2020"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Till Year
            </label>
            <input
              type="number"
              value={tillYear}
              onChange={(e) => setTillYear(e.target.value)}
              placeholder="e.g., 2024"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Search Results ({searchResults.length})
            </h3>
            {selectedPapers.size > 0 && (
              <button
                onClick={handleSaveSelected}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Save className="h-4 w-4" />
                <span>Save Selected ({selectedPapers.size})</span>
              </button>
            )}
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {searchResults.map((paper, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedPapers.has(index)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => togglePaperSelection(index)}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedPapers.has(index)}
                    onChange={() => togglePaperSelection(index)}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      {paper.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {paper.authors}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{paper.publishedBy}</span>
                      <span>{paper.year}</span>
                      <span>Cited by: {paper.inline_links?.cited_by?.total || 0}</span>
                    </div>
                    <a
                      href={paper.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm mt-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>View Paper</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
