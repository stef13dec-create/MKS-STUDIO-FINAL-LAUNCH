import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Diagnostic log for deployment
if (typeof window !== 'undefined') {
  console.log("Firebase Init - ProjectID:", firebaseConfig.projectId ? "FOUND" : "MISSING");
  if (!firebaseConfig.projectId) {
    console.error("CRITICAL: NEXT_PUBLIC_FIREBASE_PROJECT_ID is undefined. Check GitHub Secrets.");
  }
}

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

// Helper to determine if we should skip actual Firebase calls during static build
const isBuilding = typeof window === 'undefined' && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export async function getProjects(): Promise<Project[]> {
  if (isBuilding) {
    console.log("Skipping getProjects() during build (no API key)");
    return [];
  }
  try {
    const projectsCol = collection(db, 'projects');
    const projectSnapshot = await getDocs(projectsCol);
    const projectList = projectSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Project));
    return projectList;
  } catch (err) {
    console.error("Error in getProjects():", err);
    return [];
  }
}

export async function getProject(id: string): Promise<Project | null> {
  if (isBuilding) {
    console.log(`Skipping getProject(${id}) during build (no API key)`);
    return null;
  }
  try {
    const docRef = doc(db, "projects", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Project;
    }
  } catch (err) {
    console.error(`Error in getProject(${id}):`, err);
  }
  return null;
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  if (isBuilding) {
    console.log("Skipping getGalleryImages() during build (no API key)");
    return [];
  }
  try {
    const galleryCol = collection(db, 'gallery');
    const gallerySnapshot = await getDocs(galleryCol);
    const galleryList = gallerySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as GalleryImage));
    return galleryList;
  } catch (err) {
    console.error("Error in getGalleryImages():", err);
    return [];
  }
}

export { app, db, auth, storage };
