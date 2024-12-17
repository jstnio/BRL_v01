import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { HBLData } from '../types/hbl';

class HBLService {
  private validateHBLData(data: Partial<HBLData>) {
    const requiredFields = [
      'blNumber',
      'shipmentId',
      'shipper',
      'consignee',
      'notifyParty',
      'vessel',
      'voyageNo',
      'portOfLoading',
      'portOfDischarge',
      'packages'
    ];

    for (const field of requiredFields) {
      if (!data[field as keyof typeof data]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!Array.isArray(data.packages) || data.packages.length === 0) {
      throw new Error('At least one package is required');
    }
  }

  async createHBL(data: Omit<HBLData, 'id'>) {
    try {
      this.validateHBLData(data);

      // Check if BL number is unique
      const existingDocs = await getDocs(
        query(collection(db, 'houseBillsOfLading'), where('blNumber', '==', data.blNumber))
      );
      
      if (!existingDocs.empty) {
        throw new Error('BL number already exists');
      }

      const docRef = await addDoc(collection(db, 'houseBillsOfLading'), {
        ...data,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating HBL:', error);
      throw error;
    }
  }

  async updateHBL(id: string, data: Partial<HBLData>) {
    try {
      if (data.blNumber) {
        const existingDocs = await getDocs(
          query(collection(db, 'houseBillsOfLading'), 
            where('blNumber', '==', data.blNumber),
            where('__name__', '!=', id)
          )
        );
        
        if (!existingDocs.empty) {
          throw new Error('BL number already exists');
        }
      }

      const docRef = doc(db, 'houseBillsOfLading', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating HBL:', error);
      throw error;
    }
  }

  async getHBL(id: string): Promise<HBLData | null> {
    try {
      const docRef = doc(db, 'houseBillsOfLading', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as HBLData;
      }
      return null;
    } catch (error) {
      console.error('Error getting HBL:', error);
      throw error;
    }
  }

  async getHBLsByShipment(shipmentId: string): Promise<HBLData[]> {
    try {
      const q = query(
        collection(db, 'houseBillsOfLading'), 
        where('shipmentId', '==', shipmentId)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HBLData[];
    } catch (error) {
      console.error('Error getting HBLs by shipment:', error);
      throw error;
    }
  }

  async finalizeHBL(id: string) {
    try {
      const docRef = doc(db, 'houseBillsOfLading', id);
      await updateDoc(docRef, {
        status: 'final',
        finalizedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error finalizing HBL:', error);
      throw error;
    }
  }
}

export const hblService = new HBLService();