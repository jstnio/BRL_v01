import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, collection, query, where, orderBy, getDocs, CollectionReference, Query, DocumentData, doc, getDoc, setDoc, serverTimestamp, limit } from 'firebase/firestore';
import { Shipment, ShipmentType } from '../types';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjwJ1V5qbTviK5Fny-jDBziToS0uaLGIE",
  authDomain: "geometric-ivy-709.firebaseapp.com",
  projectId: "geometric-ivy-709",
  storageBucket: "geometric-ivy-709.firebasestorage.app",
  messagingSenderId: "632720753298",
  appId: "1:632720753298:web:8bb45745bb8d59bdde5c4b",
  measurementId: "G-QX3NQ26WHD"
};

// Debug: Log Firebase config status
console.log('Firebase Config Status:', {
  projectId: firebaseConfig.projectId,
  configComplete: Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  )
});

// Initialize Firebase
let app;
let auth: Auth;
let db: Firestore;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  
  console.log('Firebase initialized successfully:', {
    appName: app.name,
    authInitialized: Boolean(auth),
    dbInitialized: Boolean(db),
    currentUser: auth.currentUser?.uid
  });
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Collection references with proper typing
export const collections = {
  oceanShipments: collection(db, 'oceanShipments') as CollectionReference<DocumentData>,
  airShipments: collection(db, 'airShipments') as CollectionReference<DocumentData>,
  truckShipments: collection(db, 'truckShipments') as CollectionReference<DocumentData>,
  users: collection(db, 'users') as CollectionReference<DocumentData>,
  truckers: collection(db, 'truckers') as CollectionReference<DocumentData>,
  quotes: collection(db, 'quotes') as CollectionReference<DocumentData>,
  customers: collection(db, 'customers') as CollectionReference<DocumentData>,
  shippingLines: collection(db, 'shippingLines') as CollectionReference<DocumentData>,
  freightForwarders: collection(db, 'freightForwarders') as CollectionReference<DocumentData>,
  airports: collection(db, 'airports') as CollectionReference<DocumentData>,
  airlines: collection(db, 'airlines') as CollectionReference<DocumentData>,
  ports: collection(db, 'ports') as CollectionReference<DocumentData>,
  terminals: collection(db, 'terminals') as CollectionReference<DocumentData>,
  customsBrokers: collection(db, 'customsBrokers') as CollectionReference<DocumentData>,
};

const shipmentCollectionMap = {
  ocean: 'oceanShipments',
  airfreight: 'airShipments',
  truck: 'truckShipments'
} as const;

// Query functions with proper typing and error handling
export async function getAllOceanShipments(): Promise<Shipment[]> {
  try {
    const q = query(collections.oceanShipments, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      type: 'ocean',
      createdAt: doc.data().createdAt,
      ...doc.data()
    } as Shipment));
  } catch (error) {
    console.error('Error fetching ocean shipments:', error);
    throw new Error('Failed to fetch ocean shipments. Please try again.');
  }
}

export async function getAllAirShipments(): Promise<Shipment[]> {
  try {
    const q = query(collections.airShipments, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      type: 'airfreight',
      createdAt: doc.data().createdAt,
      ...doc.data()
    } as Shipment));
  } catch (error) {
    console.error('Error fetching air shipments:', error);
    throw new Error('Failed to fetch air shipments. Please try again.');
  }
}

export async function getAllTruckShipments(): Promise<Shipment[]> {
  try {
    const q = query(collections.truckShipments, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      type: 'truck',
      createdAt: doc.data().createdAt,
      ...doc.data()
    } as Shipment));
  } catch (error) {
    console.error('Error fetching truck shipments:', error);
    throw new Error('Failed to fetch truck shipments. Please try again.');
  }
}

export const getCustomerShipments = (userId: string) => {
  const queries = {
    ocean: query(
      collections.oceanShipments,
      where('shipper.userId', '==', userId),
      orderBy('createdAt', 'desc')
    ),
    airfreight: query(
      collections.airShipments,
      where('shipper.userId', '==', userId),
      orderBy('createdAt', 'desc')
    ),
    truck: query(
      collections.truckShipments,
      where('shipper.userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
  };

  return queries;
};

export async function searchShipments(searchTerm: string): Promise<Shipment[]> {
  try {
    const shipmentTypes = ['ocean', 'airfreight', 'truck'] as const;
    const allShipments: Shipment[] = [];

    // First, try to find the shipment in our local database
    for (const type of shipmentTypes) {
      const collectionName = shipmentCollectionMap[type];
      const queries = [
        query(collections[collectionName], where('bookingNumber', '==', searchTerm)),
        query(collections[collectionName], where('containerNumber', '==', searchTerm)),
        query(collections[collectionName], where('blNumber', '==', searchTerm)),
        query(collections[collectionName], where('customerReference', '==', searchTerm))
      ];

      for (const q of queries) {
        const snapshot = await getDocs(q);
        const shipments = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            type,
            createdAt: data.createdAt,
            ...data
          } as Shipment;
        });
        allShipments.push(...shipments);
      }
    }

    // If we found shipments in our database, return them
    if (allShipments.length > 0) {
      return Array.from(
        new Map(allShipments.map(item => [item.id, item])).values()
      ).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    // If no shipments found in our database, try Maersk API
    try {
      const { getTrackingEvents } = await import('../services/maerskTrackingApi');
      const response = await getTrackingEvents({
        transportDocumentReference: searchTerm
      });

      if (response.shipmentDetails) {
        // Create a shipment object from Maersk API response
        const maerskShipment: Shipment = {
          id: response.shipmentDetails.shipmentId,
          type: 'ocean',
          status: response.shipmentDetails.status.toLowerCase(),
          blNumber: searchTerm,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          origin: {
            city: response.shipmentDetails.departureLocation?.address?.cityName || '',
            country: response.shipmentDetails.departureLocation?.address?.country || ''
          },
          destination: {
            city: response.shipmentDetails.arrivalLocation?.address?.cityName || '',
            country: response.shipmentDetails.arrivalLocation?.address?.country || ''
          },
          departureDate: response.shipmentDetails.estimatedDepartureDate || response.shipmentDetails.actualDepartureDate,
          arrivalDate: response.shipmentDetails.estimatedArrivalDate || response.shipmentDetails.actualArrivalDate,
          containerNumber: response.shipmentDetails.containers?.[0]?.containerNumber || '',
          containerType: response.shipmentDetails.containers?.[0]?.containerType || '',
          vessel: response.shipmentDetails.vessel?.vesselName || '',
          imoNumber: response.shipmentDetails.vessel?.vesselIMONumber || '',
          events: response.events || []
        };

        return [maerskShipment];
      }
    } catch (maerskError) {
      console.error('Error fetching from Maersk API:', maerskError);
      // Continue even if Maersk API fails
    }

    // If no results found anywhere, return empty array
    return [];
  } catch (error) {
    console.error('Error searching shipments:', error);
    throw new Error('Failed to search shipments. Please try again.');
  }
}

// Utility functions
export async function verifyUserRole() {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error('No user is currently signed in');
    return null;
  }

  console.log('Checking auth state:', {
    uid: currentUser.uid,
    email: currentUser.email,
    emailVerified: currentUser.emailVerified,
    isAnonymous: currentUser.isAnonymous,
    metadata: currentUser.metadata
  });

  try {
    // 1. Check if user document exists
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    console.log('User document check:', {
      exists: userDoc.exists(),
      path: userDocRef.path,
      uid: currentUser.uid
    });

    if (!userDoc.exists()) {
      console.error('User document does not exist. Creating one...');
      // Create a user document with manager role
      try {
        await setDoc(userDocRef, {
          email: currentUser.email,
          role: 'manager',
          name: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
          createdAt: serverTimestamp()
        });
        console.log('Created user document with manager role');
        return 'manager';
      } catch (error) {
        console.error('Failed to create user document:', error);
        return null;
      }
    }

    const userData = userDoc.data();
    console.log('User data:', {
      uid: currentUser.uid,
      email: currentUser.email,
      role: userData.role,
      exists: userDoc.exists(),
      data: userData
    });

    // 2. Test collection access
    try {
      console.log('Testing collection access...');
      const testRef = collection(db, 'oceanShipments');
      const testQuery = query(testRef, limit(1));
      const snapshot = await getDocs(testQuery);
      console.log('Collection access test succeeded:', {
        collectionPath: testRef.path,
        documentsFound: snapshot.size
      });
    } catch (error) {
      console.error('Collection access test failed:', error);
    }

    return userData.role;
  } catch (error) {
    console.error('Error verifying user role:', error);
    return null;
  }
}

export { auth, db };