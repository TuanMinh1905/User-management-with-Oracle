export interface User {
  id: number;
  employeeId: string;
  fullName: string;
  email: string;
  phone?: string;
  position: string;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  avatar?: string;
  joinDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  employeeId: string;
  fullName: string;
  email: string;
  phone?: string;
  position: string;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  avatar?: string;
  joinDate?: string;
}

export interface Statistics {
  total: number;
  active: number;
  inactive: number;
  onLeave: number;
  byRole: { role: string; count: number }[];
  byPosition: { position: string; count: number }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
