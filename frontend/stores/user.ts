import { defineStore } from 'pinia';
import type { User, UserFormData, Statistics, ApiResponse } from '~/types';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    currentUser: null as User | null,
    statistics: null as Statistics | null,
    loading: false,
    error: null as string | null,
    filters: {
      search: '',
      status: '',
      role: '',
      position: '',
    },
  }),

  getters: {
    filteredUsers: (state) => state.users,
    totalUsers: (state) => state.users.length,
    activeUsers: (state) => state.users.filter(u => u.status === 'ACTIVE').length,
  },

  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      
      try {
        const config = useRuntimeConfig();
        const params = new URLSearchParams();
        
        if (this.filters.search) params.append('search', this.filters.search);
        if (this.filters.status) params.append('status', this.filters.status);
        if (this.filters.role) params.append('role', this.filters.role);
        if (this.filters.position) params.append('position', this.filters.position);
        
        const url = `${config.public.apiBase}/users?${params.toString()}`;
        const response = await $fetch<ApiResponse<User[]>>(url);
        
        if (response.success && response.data) {
          this.users = response.data;
        } else {
          throw new Error(response.error || 'Failed to fetch users');
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch users';
        console.error('Error fetching users:', err);
      } finally {
        this.loading = false;
      }
    },

    async fetchUserById(id: number) {
      this.loading = true;
      this.error = null;
      
      try {
        const config = useRuntimeConfig();
        const response = await $fetch<ApiResponse<User>>(`${config.public.apiBase}/users/${id}`);
        
        if (response.success && response.data) {
          this.currentUser = response.data;
          return response.data;
        } else {
          throw new Error(response.error || 'Failed to fetch user');
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch user';
        console.error('Error fetching user:', err);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async createUser(userData: UserFormData) {
      this.loading = true;
      this.error = null;
      
      try {
        const config = useRuntimeConfig();
        const response = await $fetch<ApiResponse<User>>(`${config.public.apiBase}/users`, {
          method: 'POST',
          body: userData,
        });
        
        if (response.success && response.data) {
          this.users.unshift(response.data);
          return response.data;
        } else {
          throw new Error(response.error || 'Failed to create user');
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to create user';
        console.error('Error creating user:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateUser(id: number, userData: Partial<UserFormData>) {
      this.loading = true;
      this.error = null;
      
      try {
        const config = useRuntimeConfig();
        const response = await $fetch<ApiResponse<User>>(`${config.public.apiBase}/users/${id}`, {
          method: 'PUT',
          body: userData,
        });
        
        if (response.success && response.data) {
          const index = this.users.findIndex(u => u.id === id);
          if (index !== -1) {
            this.users[index] = response.data;
          }
          return response.data;
        } else {
          throw new Error(response.error || 'Failed to update user');
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to update user';
        console.error('Error updating user:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(id: number) {
      this.loading = true;
      this.error = null;
      
      try {
        const config = useRuntimeConfig();
        const response = await $fetch<ApiResponse<void>>(`${config.public.apiBase}/users/${id}`, {
          method: 'DELETE',
        });
        
        if (response.success) {
          this.users = this.users.filter(u => u.id !== id);
          return true;
        } else {
          throw new Error(response.error || 'Failed to delete user');
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to delete user';
        console.error('Error deleting user:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchStatistics() {
      try {
        const config = useRuntimeConfig();
        const response = await $fetch<ApiResponse<Statistics>>(`${config.public.apiBase}/statistics`);
        
        if (response.success && response.data) {
          this.statistics = response.data;
          return response.data;
        }
      } catch (err: any) {
        console.error('Error fetching statistics:', err);
      }
    },

    setFilters(filters: Partial<typeof this.filters>) {
      this.filters = { ...this.filters, ...filters };
    },

    clearFilters() {
      this.filters = {
        search: '',
        status: '',
        role: '',
        position: '',
      };
    },
  },
});
