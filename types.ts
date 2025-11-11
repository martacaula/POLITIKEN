export interface UserSettings {
  ageGroup: string;
  interests: string[];
  duration: number;
}

export interface Article {
  headline: string;
  content: string;
}

export interface PodcastData {
  id: string;
  title: string;
  script: string;
  audioB64: string;
  createdAt: number;
  settings: UserSettings;
}