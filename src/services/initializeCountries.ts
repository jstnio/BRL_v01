import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const countries = [
  { name: 'United States', code: 'US' },
  { name: 'Canada', code: 'CA' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Chile', code: 'CL' },
  { name: 'Colombia', code: 'CO' },
  { name: 'Peru', code: 'PE' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'France', code: 'FR' },
  { name: 'Germany', code: 'DE' },
  { name: 'Italy', code: 'IT' },
  { name: 'Spain', code: 'ES' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'Belgium', code: 'BE' },
  { name: 'China', code: 'CN' },
  { name: 'Japan', code: 'JP' },
  { name: 'South Korea', code: 'KR' },
  { name: 'India', code: 'IN' },
  { name: 'Australia', code: 'AU' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Singapore', code: 'SG' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Indonesia', code: 'ID' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Vietnam', code: 'VN' },
  { name: 'Philippines', code: 'PH' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'Egypt', code: 'EG' },
  { name: 'Morocco', code: 'MA' },
  { name: 'United Arab Emirates', code: 'AE' },
  { name: 'Saudi Arabia', code: 'SA' },
  { name: 'Israel', code: 'IL' },
  { name: 'Turkey', code: 'TR' },
  { name: 'Russia', code: 'RU' },
];

export async function initializeCountries() {
  try {
    const countriesRef = collection(db, 'countries');
    
    const uniqueCountries = Array.from(new Set(countries.map(country => country.code)))
      .map(code => countries.find(country => country.code === code));

    // Add each country to the collection
    for (const country of uniqueCountries) {
      await addDoc(countriesRef, {
        ...country,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    console.log('Countries collection initialized successfully');
  } catch (error) {
    console.error('Error initializing countries collection:', error);
    throw error;
  }
}
