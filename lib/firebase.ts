import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  date: string;
  size: string;
  image: string;
  description: string;
  gallery: string[];
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export async function getProjects(): Promise<Project[]> {
  const projectsCol = collection(db, 'projects');
  const projectSnapshot = await getDocs(projectsCol);
  const projectList = projectSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Project));
  return projectList;
}

export async function getProject(id: string): Promise<Project | null> {
  const docRef = doc(db, "projects", id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Project;
  }
  return null;
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const galleryCol = collection(db, 'gallery');
  const gallerySnapshot = await getDocs(galleryCol);
  const galleryList = gallerySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as GalleryImage));
  return galleryList;
}

export { app, db, auth, storage };
