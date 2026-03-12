export type QuizTemplate = 'wordle' | 'map' | 'list';

export interface QuizConfig {
  wordle?: {
    secretWord: string;
  };
  map?: {
    locations: {
      name: string;
      lat: number;
      lng: number;
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
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'user' | 'admin';
}
