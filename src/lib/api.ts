// Mock data for development
const mockLocations = [
  { id: '1', city: 'Shanghai', country: 'China', code: 'SHA' },
  { id: '2', city: 'Singapore', country: 'Singapore', code: 'SIN' },
  { id: '3', city: 'Rotterdam', country: 'Netherlands', code: 'RTM' },
  { id: '4', city: 'Los Angeles', country: 'United States', code: 'LAX' },
  { id: '5', city: 'Dubai', country: 'United Arab Emirates', code: 'DXB' },
  { id: '6', city: 'Hong Kong', country: 'China', code: 'HKG' },
  { id: '7', city: 'Hamburg', country: 'Germany', code: 'HAM' },
  { id: '8', city: 'Busan', country: 'South Korea', code: 'PUS' },
  { id: '9', city: 'Tokyo', country: 'Japan', code: 'TYO' },
  { id: '10', city: 'New York', country: 'United States', code: 'NYC' },
];

export async function searchLocations(query: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Filter locations based on query
  return mockLocations.filter(location => 
    location.city.toLowerCase().includes(query.toLowerCase()) ||
    location.country.toLowerCase().includes(query.toLowerCase()) ||
    location.code.toLowerCase().includes(query.toLowerCase())
  );
}
