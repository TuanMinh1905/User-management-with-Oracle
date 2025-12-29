export interface User {
  id: number | string; // Có thể là number hoặc string (username)
  employeeId: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string; // Có trong Oracle DB
  // Các field không có trong DB, chỉ để hiển thị
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
  address?: string; // Có trong Oracle DB
  // Các field không có trong DB, optional
  position?: string;
  role?: 'ADMIN' | 'MANAGER' | 'MEMBER';
  status?: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
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
