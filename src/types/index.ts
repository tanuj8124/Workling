export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'worker' | 'employer';
  rating?: number;
  price?: number;
  skills?: string[];
  certificates?: string[];
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  createdBy: User;
  applicants: Array<{
    worker: User;
  }>;
  createdAt: string;
}