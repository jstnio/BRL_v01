import { useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  title: string;
  email: string;
  organization_name: string;
  linkedin_url: string;
  city: string;
  state: string;
  country: string;
}

interface SearchParams {
  person_titles?: string[];
  person_seniorities?: string[];
  q_organization_domains?: string[];
  q_keywords?: string[];
  location_country?: string[];
}

interface SearchResponse {
  people: Contact[];
  total: number;
  page: number;
}

const Apollo = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    person_titles: [],
    person_seniorities: [],
    q_organization_domains: [],
    q_keywords: [],
    location_country: []
  });

  const seniorities = [
    'vp', 'director', 'manager', 'owner', 'founder', 'c_suite',
    'partner', 'president', 'head', 'senior'
  ];

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Filter out empty arrays from searchParams
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value.length > 0)
      );

      const searchRequest = {
        page: currentPage,
        per_page: 25,
        ...filteredParams
      };

      // Create axios instance with timeout
      const client = axios.create({
        timeout: 30000 // 30 seconds
      });

      const response = await client.post<SearchResponse>(
        'http://localhost:3001/api/apollo/search',
        searchRequest
      );
      
      const { people, total, page } = response.data;
      setContacts(people);
      setTotalResults(total);
      setCurrentPage(page);

      if (people.length === 0) {
        setError('No contacts found matching your search criteria.');
      }
    } catch (err) {
      console.error('Apollo API Error:', err);
      
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          setError('Request timed out. Please try again.');
        } else if (!err.response) {
          setError('Network error. Please check your connection and try again.');
        } else {
          setError(`Failed to fetch contacts: ${err.response.data?.error || err.message}`);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SearchParams, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value ? [value] : []
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Apollo Contact Search</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Title Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g. Marketing Manager"
              onChange={(e) => handleInputChange('person_titles', e.target.value)}
            />
          </div>

          {/* Seniority Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seniority Level
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              onChange={(e) => handleInputChange('person_seniorities', e.target.value)}
            >
              <option value="">Select Seniority</option>
              {seniorities.map(seniority => (
                <option key={seniority} value={seniority}>
                  {seniority.charAt(0).toUpperCase() + seniority.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Company Domain */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Domain
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g. company.com"
              onChange={(e) => handleInputChange('q_organization_domains', e.target.value)}
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keywords
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g. logistics, shipping"
              onChange={(e) => handleInputChange('q_keywords', e.target.value)}
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g. United States"
              onChange={(e) => handleInputChange('location_country', e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="flex items-center justify-center w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Search Contacts
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {contacts.length > 0 && (
        <div className="mb-4 text-gray-600">
          Found {totalResults} contacts (showing page {currentPage})
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => (
          <div key={contact.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg">{`${contact.first_name} ${contact.last_name}`}</h3>
            <p className="text-gray-600 mb-2">{contact.title}</p>
            <p className="text-sm text-gray-500 mb-1">{contact.organization_name}</p>
            <p className="text-sm text-gray-500 mb-3">
              {[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}
            </p>
            
            <div className="flex gap-2">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Email
                </a>
              )}
              {contact.linkedin_url && (
                <a
                  href={contact.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {contacts.length === 0 && !loading && !error && (
        <div className="text-center text-gray-500 mt-8">
          No contacts found. Try adjusting your search criteria.
        </div>
      )}
    </div>
  );
};

export default Apollo;
