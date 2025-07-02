
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Calendar } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'post' | 'user' | 'help_request';
  title: string;
  content: string;
  author: string;
  location?: string;
  tags: string[];
  created_at: string;
}

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    
    try {
      // Mock search results for demo
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'post',
          title: 'Food Bank Volunteering',
          content: 'Helped distribute meals to 100 families at the downtown food bank...',
          author: 'Sarah Chen',
          location: 'Downtown Food Bank',
          tags: ['food', 'volunteer', 'community'],
          created_at: '2 hours ago'
        },
        {
          id: '2',
          type: 'help_request',
          title: 'Need Help with Elderly Care',
          content: 'Looking for someone to help my elderly neighbor with grocery shopping...',
          author: 'Mike Johnson',
          location: 'Oak Street',
          tags: ['elderly', 'groceries', 'urgent'],
          created_at: '1 day ago'
        },
        {
          id: '3',
          type: 'user',
          title: 'Maria Santos',
          content: 'Active volunteer with 500+ community points. Specializes in education and children support.',
          author: 'Maria Santos',
          location: 'City Center',
          tags: ['education', 'children', 'volunteer'],
          created_at: 'Profile'
        }
      ];
      
      // Filter results based on search query and type
      const filtered = mockResults.filter(result => {
        const matchesQuery = result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            result.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            result.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesType = selectedType === 'all' || result.type === selectedType;
        
        return matchesQuery && matchesType;
      });
      
      setSearchResults(filtered);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'post': return 'bg-green-100 text-green-700';
      case 'help_request': return 'bg-red-100 text-red-700';
      case 'user': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'post': return 'Good Deed';
      case 'help_request': return 'Help Request';
      case 'user': return 'User Profile';
      default: return type;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search for posts, users, help requests, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {showFilters && (
            <div className="flex space-x-2 p-4 bg-gray-50 rounded-lg">
              <label className="text-sm font-medium">Filter by type:</label>
              <div className="flex space-x-2">
                {['all', 'post', 'help_request', 'user'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      selectedType === type
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {type === 'all' ? 'All' : getTypeLabel(type)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {searchResults.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Search Results ({searchResults.length})</h3>
          {searchResults.map((result) => (
            <Card key={result.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getTypeColor(result.type)}>
                        {getTypeLabel(result.type)}
                      </Badge>
                      <h4 className="font-semibold text-gray-900">{result.title}</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{result.content}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>by {result.author}</span>
                      {result.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{result.location}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{result.created_at}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {result.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {result.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {searchQuery && searchResults.length === 0 && !loading && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No results found for "{searchQuery}"</p>
          <p className="text-sm text-gray-400 mt-2">Try different keywords or check the filters</p>
        </Card>
      )}
    </div>
  );
};

export default SearchComponent;
