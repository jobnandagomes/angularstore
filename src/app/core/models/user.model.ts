export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student' | 'instructor';
  phone?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  preferences?: UserPreferences;
  enrolledCourses: number[];
}

export interface UserPreferences {
  theme?: 'light' | 'dark';
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  language?: string;
} 