import { useState } from 'react';
import { useMaerskTrackingStore } from '../../store/maerskTrackingStore';
import { Ship } from 'lucide-react';
import TrackingSearch from '../../components/maersk/TrackingSearch';
import EventTimeline from '../../components/maersk/EventTimeline';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function MaerskTracking() {
  const { events, loading, error, fetchEvents } = useMaerskTrackingStore();
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (params: any) => {
    setHasSearched(true);
    await fetchEvents(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Ship className="h-8 w-8 text-primary-600 mr-3" />
          MAERSK Tracking
        </h1>
        <p className="mt-2 text-gray-600">
          Track your MAERSK shipments in real-time
        </p>
      </div>

      <div className="space-y-6">
        <TrackingSearch onSearch={handleSearch} />

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          hasSearched && <EventTimeline events={events} />
        )}
      </div>
    </div>
  );
}