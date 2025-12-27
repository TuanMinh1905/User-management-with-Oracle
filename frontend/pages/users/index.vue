<template>
  <div>
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div class="flex items-center gap-4">
        <!-- Search -->
        <div class="relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Tìm kiếm nhân viên..." 
            class="input pl-10 w-64"
            @input="debouncedSearch"
          />
        </div>

        <!-- Status Filter -->
        <select v-model="statusFilter" class="select w-40" @change="applyFilters">
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Đang làm</option>
          <option value="INACTIVE">Nghỉ việc</option>
          <option value="ON_LEAVE">Nghỉ phép</option>
        </select>

        <!-- Role Filter -->
        <select v-model="roleFilter" class="select w-40" @change="applyFilters">
          <option value="">Tất cả vai trò</option>
          <option value="ADMIN">Quản trị viên</option>
          <option value="MANAGER">Quản lý</option>
          <option value="MEMBER">Nhân viên</option>
        </select>
      </div>

      <NuxtLink to="/users/create" class="btn btn-primary flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Thêm nhân viên
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Users Table -->
    <div v-else class="card overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">Mã NV</th>
            <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">Nhân viên</th>
            <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">Vị trí</th>
            <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">Vai trò</th>
            <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">Trạng thái</th>
            <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">Ngày vào</th>
            <th class="text-center py-4 px-6 text-sm font-medium text-gray-500">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="user in users" 
            :key="user.id" 
            class="border-t border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="py-4 px-6 text-gray-600 font-mono text-sm">{{ user.employeeId }}</td>
            <td class="py-4 px-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                  {{ user.fullName.charAt(0) }}
                </div>
                <div>
                  <p class="font-medium text-gray-800">{{ user.fullName }}</p>
                  <p class="text-sm text-gray-500">{{ user.email }}</p>
                </div>
              </div>
            </td>
            <td class="py-4 px-6 text-gray-600">{{ user.position }}</td>
            <td class="py-4 px-6">
              <span :class="getRoleBadgeClass(user.role)" class="badge">
                {{ getRoleName(user.role) }}
              </span>
            </td>
            <td class="py-4 px-6">
              <span :class="getStatusBadgeClass(user.status)" class="badge">
                {{ getStatusName(user.status) }}
              </span>
            </td>
            <td class="py-4 px-6 text-gray-600">{{ formatDate(user.joinDate) }}</td>
            <td class="py-4 px-6">
              <div class="flex items-center justify-center gap-2">
                <NuxtLink 
                  :to="`/users/${user.id}`" 
                  class="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Xem chi tiết"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </NuxtLink>
                <NuxtLink 
                  :to="`/users/${user.id}/edit`" 
                  class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Chỉnh sửa"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </NuxtLink>
                <button 
                  @click="confirmDelete(user)"
                  class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Xóa"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="users.length === 0" class="py-12 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="text-gray-500">Chưa có nhân viên nào</p>
        <NuxtLink to="/users/create" class="btn btn-primary mt-4 inline-flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Thêm nhân viên đầu tiên
        </NuxtLink>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Xác nhận xóa</h3>
              <p class="text-gray-500">Bạn có chắc muốn xóa nhân viên này?</p>
            </div>
          </div>
          <div v-if="userToDelete" class="bg-gray-50 rounded-lg p-4 mb-6">
            <p class="font-medium text-gray-800">{{ userToDelete.fullName }}</p>
            <p class="text-sm text-gray-500">{{ userToDelete.email }}</p>
          </div>
          <div class="flex gap-3 justify-end">
            <button @click="showDeleteModal = false" class="btn btn-secondary">Hủy</button>
            <button @click="deleteUser" class="btn btn-danger" :disabled="deleting">
              {{ deleting ? 'Đang xóa...' : 'Xóa' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import type { User } from '~/types';

const userStore = useUserStore();

const searchQuery = ref('');
const statusFilter = ref('');
const roleFilter = ref('');
const showDeleteModal = ref(false);
const userToDelete = ref<User | null>(null);
const deleting = ref(false);

const users = computed(() => userStore.users);
const loading = computed(() => userStore.loading);

let searchTimeout: NodeJS.Timeout;

const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 300);
};

const applyFilters = () => {
  userStore.setFilters({
    search: searchQuery.value,
    status: statusFilter.value,
    role: roleFilter.value,
  });
  userStore.fetchUsers();
};

const getRoleName = (role: string) => {
  const names: Record<string, string> = {
    ADMIN: 'Quản trị',
    MANAGER: 'Quản lý',
    MEMBER: 'Nhân viên',
  };
  return names[role] || role;
};

const getRoleBadgeClass = (role: string) => {
  const classes: Record<string, string> = {
    ADMIN: 'bg-purple-100 text-purple-800',
    MANAGER: 'bg-blue-100 text-blue-800',
    MEMBER: 'bg-gray-100 text-gray-800',
  };
  return classes[role] || '';
};

const getStatusName = (status: string) => {
  const names: Record<string, string> = {
    ACTIVE: 'Đang làm',
    INACTIVE: 'Nghỉ việc',
    ON_LEAVE: 'Nghỉ phép',
  };
  return names[status] || status;
};

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    ACTIVE: 'badge-active',
    INACTIVE: 'badge-inactive',
    ON_LEAVE: 'badge-onleave',
  };
  return classes[status] || '';
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

const confirmDelete = (user: User) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const deleteUser = async () => {
  if (!userToDelete.value) return;
  
  deleting.value = true;
  try {
    await userStore.deleteUser(userToDelete.value.id);
    showDeleteModal.value = false;
    userToDelete.value = null;
  } catch (error) {
    alert('Không thể xóa nhân viên. Vui lòng thử lại.');
  } finally {
    deleting.value = false;
  }
};

onMounted(() => {
  userStore.fetchUsers();
});
</script>
