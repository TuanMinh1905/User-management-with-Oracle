<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- User Detail -->
    <div v-else-if="user" class="max-w-4xl">
      <div class="card p-6">
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-center gap-4">
            <div class="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl font-bold">
              {{ user.fullName.charAt(0) }}
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-800">{{ user.fullName }}</h2>
              <p class="text-gray-500">{{ user.email }}</p>
              <div class="flex items-center gap-2 mt-2">
                <span :class="getStatusBadgeClass(user.status)" class="badge">
                  {{ getStatusName(user.status) }}
                </span>
                <span :class="getRoleBadgeClass(user.role)" class="badge">
                  {{ getRoleName(user.role) }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <NuxtLink :to="`/users/${user.id}/edit`" class="btn btn-primary flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Chỉnh sửa
            </NuxtLink>
            <NuxtLink to="/users" class="btn btn-secondary">
              Quay lại
            </NuxtLink>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="text-sm text-gray-500">Mã nhân viên</label>
              <p class="font-medium text-gray-800">{{ user.employeeId }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">Số điện thoại</label>
              <p class="font-medium text-gray-800">{{ user.phone || 'Chưa cập nhật' }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">Vị trí</label>
              <p class="font-medium text-gray-800">{{ user.position }}</p>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label class="text-sm text-gray-500">Ngày vào làm</label>
              <p class="font-medium text-gray-800">{{ formatDate(user.joinDate) }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">Ngày tạo</label>
              <p class="font-medium text-gray-800">{{ formatDateTime(user.createdAt) }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">Cập nhật lần cuối</label>
              <p class="font-medium text-gray-800">{{ formatDateTime(user.updatedAt) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <p class="text-gray-500 mb-4">Không tìm thấy nhân viên</p>
      <NuxtLink to="/users" class="btn btn-primary">Quay lại danh sách</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';

const route = useRoute();
const userStore = useUserStore();

const user = computed(() => userStore.currentUser);
const loading = computed(() => userStore.loading);

const getRoleName = (role: string) => {
  const names: Record<string, string> = {
    ADMIN: 'Quản trị viên',
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
    ACTIVE: 'Đang làm việc',
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

const formatDateTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('vi-VN');
};

onMounted(async () => {
  const id = parseInt(route.params.id as string);
  if (!isNaN(id)) {
    await userStore.fetchUserById(id);
  }
});
</script>
