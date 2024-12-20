import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { OceanFreightShipment, AirFreightShipment, TruckFreightShipment } from '../types';

const sampleOceanShipments: Omit<OceanFreightShipment, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    brlReference: 'BRL-OCN-001',
    type: 'ocean',
    status: 'in-transit',
    origin: { city: 'Shanghai', country: 'China' },
    destination: { city: 'Los Angeles', country: 'United States' },
    blNumber: 'MAEU123456789',
    containerNumber: 'MSKU1234567',
    containerType: '40HC',
    vessel: 'MSC OSCAR'
  },
  {
    brlReference: 'BRL-OCN-002',
    type: 'ocean',
    status: 'booked',
    origin: { city: 'Rotterdam', country: 'Netherlands' },
    destination: { city: 'New York', country: 'United States' },
    blNumber: 'MAEU987654321',
    containerNumber: 'MSKU7654321',
    containerType: '20DC',
    vessel: 'EVER GIVEN'
  }
];

const sampleAirShipments: Omit<AirFreightShipment, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    brlReference: 'BRL-AIR-001',
    type: 'airfreight',
    status: 'arrived',
    origin: { city: 'Hong Kong', country: 'China' },
    destination: { city: 'Frankfurt', country: 'Germany' },
    awbNumber: '160-12345678',
    airline: 'Lufthansa Cargo',
    flightNumber: 'LH8460'
  },
  {
    brlReference: 'BRL-AIR-002',
    type: 'airfreight',
    status: 'in-transit',
    origin: { city: 'Dubai', country: 'United Arab Emirates' },
    destination: { city: 'Singapore', country: 'Singapore' },
    awbNumber: '176-98765432',
    airline: 'Emirates SkyCargo',
    flightNumber: 'EK9358'
  }
];

const sampleTruckShipments: Omit<TruckFreightShipment, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    brlReference: 'BRL-TRK-001',
    type: 'truck',
    status: 'booked',
    origin: { city: 'Chicago', country: 'United States' },
    destination: { city: 'Toronto', country: 'Canada' },
    truckNumber: 'TRK-1234',
    driverName: 'John Smith',
    driverPhone: '+1-555-0123'
  }
];

export async function initializeShipments() {
  try {
    // Check if shipments already exist
    const oceanRef = collection(db, 'oceanShipments');
    const airRef = collection(db, 'airShipments');
    const truckRef = collection(db, 'truckShipments');

    const [oceanDocs, airDocs, truckDocs] = await Promise.all([
      getDocs(oceanRef),
      getDocs(airRef),
      getDocs(truckRef)
    ]);

    // Only add sample data if collections are empty
    if (oceanDocs.empty) {
      console.log('Initializing ocean shipments...');
      await Promise.all(
        sampleOceanShipments.map(shipment => 
          addDoc(oceanRef, {
            ...shipment,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
        )
      );
    }

    if (airDocs.empty) {
      console.log('Initializing air shipments...');
      await Promise.all(
        sampleAirShipments.map(shipment => 
          addDoc(airRef, {
            ...shipment,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
        )
      );
    }

    if (truckDocs.empty) {
      console.log('Initializing truck shipments...');
      await Promise.all(
        sampleTruckShipments.map(shipment => 
          addDoc(truckRef, {
            ...shipment,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
        )
      );
    }

    console.log('Sample shipments initialized successfully');
  } catch (error) {
    console.error('Error initializing sample shipments:', error);
    throw error;
  }
}
