import { initializeCountries } from './initializeCountries';

export async function initializeData() {
  try {
    await initializeCountries();
    console.log('All data initialized successfully');
  } catch (error) {
    console.error('Error initializing data:', error);
    throw error;
  }
}
