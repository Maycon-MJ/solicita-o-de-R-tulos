import { 
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  onSnapshot,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import type { LabelRequest, Quotation } from '../types';

export async function saveRequest(request: LabelRequest) {
  try {
    // Upload files if present
    const filesPromises = request.files.map(async (file) => {
      if (file.url.startsWith('blob:')) {
        const response = await fetch(file.url);
        const blob = await response.blob();
        const storageRef = ref(storage, `files/${request.id}/${file.id}`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        return { ...file, url: downloadURL };
      }
      return file;
    });

    const updatedFiles = await Promise.all(filesPromises);

    // Save request to Firestore
    const requestData = {
      ...request,
      files: updatedFiles,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await addDoc(collection(db, 'requests'), requestData);
  } catch (error) {
    console.error('Error saving request:', error);
    throw error;
  }
}

export async function updateRequest(requestId: string, updates: Partial<LabelRequest>) {
  try {
    // Handle file uploads for any new files
    if (updates.files) {
      const filesPromises = updates.files.map(async (file) => {
        if (file.url.startsWith('blob:')) {
          const response = await fetch(file.url);
          const blob = await response.blob();
          const storageRef = ref(storage, `files/${requestId}/${file.id}`);
          await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(storageRef);
          return { ...file, url: downloadURL };
        }
        return file;
      });

      updates.files = await Promise.all(filesPromises);
    }

    const docRef = doc(db, 'requests', requestId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating request:', error);
    throw error;
  }
}

export function subscribeToRequests(callback: (requests: LabelRequest[]) => void) {
  const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as LabelRequest[];
    
    callback(requests);
  });
}

export async function addQuotationToRequest(
  requestId: string,
  quotation: Quotation
) {
  try {
    const docRef = doc(db, 'requests', requestId);
    await updateDoc(docRef, {
      quotations: arrayUnion(quotation),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding quotation:', error);
    throw error;
  }
}