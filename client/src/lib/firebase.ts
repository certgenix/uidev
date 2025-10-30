import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, collection, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Only initialize Firebase if API key is provided
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.warn('Firebase configuration missing. Firebase features will be unavailable.');
}

export interface WeekTask {
  id: string;
  weekNumber: number;
  dayNumber: number;
  taskName: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt?: Date;
}

export interface WeekData {
  id: string;
  userId: string;
  weekNumber: number;
  status: 'locked' | 'available' | 'completed';
  theme?: string;
  startedAt?: Date;
  completedAt?: Date;
  tasks: WeekTask[];
}

export async function fetchWeeksAndTasks(userId: string): Promise<WeekData[]> {
  if (!db) {
    console.error('Firestore is not initialized');
    return [];
  }

  try {
    // Fetch weeks for the user
    const weeksRef = collection(db, 'weeks');
    const weeksQuery = query(
      weeksRef,
      where('userId', '==', userId)
    );
    
    const weeksSnapshot = await getDocs(weeksQuery);
    const weeksData: WeekData[] = [];

    for (const weekDoc of weeksSnapshot.docs) {
      const weekData = weekDoc.data();
      
      // Fetch tasks for this week
      const tasksRef = collection(db, 'weeks', weekDoc.id, 'tasks');
      const tasksSnapshot = await getDocs(tasksRef);
      
      const tasks: WeekTask[] = tasksSnapshot.docs
        .map(taskDoc => ({
          id: taskDoc.id,
          ...taskDoc.data(),
          completedAt: taskDoc.data().completedAt?.toDate()
        } as WeekTask))
        .sort((a, b) => a.dayNumber - b.dayNumber);

      weeksData.push({
        id: weekDoc.id,
        userId: weekData.userId,
        weekNumber: weekData.weekNumber,
        status: weekData.status || 'locked',
        theme: weekData.theme,
        startedAt: weekData.startedAt?.toDate(),
        completedAt: weekData.completedAt?.toDate(),
        tasks
      });
    }

    // Sort weeks by weekNumber
    return weeksData.sort((a, b) => a.weekNumber - b.weekNumber);
  } catch (error) {
    console.error('Error fetching weeks and tasks from Firestore:', error);
    return [];
  }
}

export { auth, db };
