// Fixed timestamp for the application
const FIXED_TIMESTAMP = '2024-12-17T18:29:01-05:00';

export const getCurrentTimestamp = (): string => {
  return FIXED_TIMESTAMP;
};

export const getCurrentDate = (): Date => {
  return new Date(FIXED_TIMESTAMP);
};

// Format date for Maersk API (YYYY-MM-DD format)
export const formatDateForMaersk = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Format datetime for display
export const formatDateTime = (dateTime: string): string => {
  const date = new Date(dateTime);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }).format(date);
};
