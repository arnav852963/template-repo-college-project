export interface User {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  avatar: string;
  coverImage: string;
  department: string;
  designation: string;
  researchInterests: string[];
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SignupData {
  fullName: string;
  username: string;
  password: string;
  email: string;
  department: string;
  isAdmin: boolean;
  researchInterest: string;
  designation: string;
  avatar: File;
  coverImage: File;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface GoogleAuthData {
  idToken_name: string;
  idToken_email: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Paper {
  _id: string;
  title: string;
  authors: string[];
  publishedBy: string;
  link?: string;
  manualUpload?: string;
  publishedDate: string;
  owner: string;
  citedBy?: number;
  tag: string[];
  isManual: boolean;
  isPublished: boolean;
  classifiedAs: 'journal' | 'conference' | 'book chapter';
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: string;
  teamMembers: string[];
  owner: string;
}

export interface Patent {
  _id: string;
  title: string;
  abstract: string;
  applicationNumber: string;
  filedDate: string;
  status: string;
  pdfUrl: string;
  owner: string;
  tags: string[];
}
