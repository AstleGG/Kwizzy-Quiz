export type QuizTemplate = 'wordle' | 'map' | 'list';

export interface QuizConfig {
  wordle?: {
    secretWord: string;
  };
  map?: {
    mapType: 'world' | 'africa' | 'asia' | 'europe' | 'north-america' | 'south-america' | 'oceania';
    locations: {
      id: string;
      name: string;
      x: number; // percentage 0-100
      y: number; // percentage 0-100
    }[];
  };
  list?: {
    prompt: string;
    answers: string[];
  };
}

export interface Quiz {
  id: string;
  title: string;
  creatorName: string;
  creatorUid: string;
  templateType: QuizTemplate;
  config: QuizConfig;
  createdAt: any;
  playCount: number;
  isPublic: boolean;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'user' | 'admin';
  username?: string;
  description?: string;
  isProfileComplete?: boolean;
}
