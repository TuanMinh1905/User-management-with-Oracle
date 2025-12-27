<template>
  <div>
    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Tổng nhân viên</p>
            <p class="text-3xl font-bold text-gray-800">{{ statistics?.total || 0 }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Đang làm việc</p>
            <p class="text-3xl font-bold text-green-600">{{ statistics?.active || 0 }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Nghỉ phép</p>
            <p class="text-3xl font-bold text-yellow-600">{{ statistics?.onLeave || 0 }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Nghỉ việc</p>
            <p class="text-3xl font-bold text-red-600">{{ statistics?.inactive || 0 }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts / Lists Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- By Position -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Theo vị trí</h3>
        <div class="space-y-3">
          <div 
            v-for="item in statistics?.byPosition" 
            :key="item.position"
            class="flex items-center justify-between"
          >
            <span class="text-gray-600">{{ item.position }}</span>
            <div class="flex items-center gap-3">
              <div class="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-primary-600 h-2 rounded-full" 
                  :style="{ width: `${(item.count / (statistics?.total || 1)) * 100}%` }"
                ></div>
              </div>
              <span class="text-sm font-medium text-gray-800 w-8">{{ item.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- By Role -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Theo vai trò</h3>
        <div class="space-y-3">
          <div 
            v-for="item in statistics?.byRole" 
            :key="item.role"
            class="flex items-center justify-between"
          >
            <span class="text-gray-600">{{ getRoleName(item.role) }}</span>
            <div class="flex items-center gap-3">
              <div class="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full" 
                  :class="getRoleColor(item.role)"
                  :style="{ width: `${(item.count / (statistics?.total || 1)) * 100}%` }"
                ></div>
              </div>
              <span class="text-sm font-medium text-gray-800 w-8">{{ item.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Users -->
    <div class="card p-6 mt-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800">Nhân viên mới nhất</h3>
        <NuxtLink to="/users" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
          Xem tất cả →
        </NuxtLink>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Nhân viên</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Vị trí</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Trạng thái</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Ngày vào</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in recentUsers" :key="user.id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="py-3 px-4">
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
              <td class="py-3 px-4 text-gray-600">{{ user.position }}</td>
              <td class="py-3 px-4">
                <span :class="getStatusBadgeClass(user.status)" class="badge">
                  {{ getStatusName(user.status) }}
                </span>
              </td>
              <td class="py-3 px-4 text-gray-600">{{ formatDate(user.joinDate) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

const statistics = computed(() => userStore.statistics);
const recentUsers = computed(() => userStore.users.slice(0, 5));

const getRoleName = (role: string) => {
  const names: Record<string, string> = {
    ADMIN: 'Quản trị viên',
    MANAGER: 'Quản lý',
    MEMBER: 'Nhân viên',
  };
  return names[role] || role;
};

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    ADMIN: 'bg-purple-600',
    MANAGER: 'bg-blue-600',
    MEMBER: 'bg-green-600',
  };
  return colors[role] || 'bg-gray-600';
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

onMounted(async () => {
  await Promise.all([
    userStore.fetchStatistics(),
    userStore.fetchUsers(),
  ]);
});
</script>
