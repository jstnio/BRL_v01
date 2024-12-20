import { initializeCountries } from './initializeCountries';
import { initializeShipments } from './initializeShipments';

export async function initializeData() {
  try {
    await Promise.all([
      initializeCountries(),
      initializeShipments()
    ]);
    console.log('All data initialized successfully');
  } catch (error) {
    console.error('Error initializing data:', error);
    throw error;
  }
}
