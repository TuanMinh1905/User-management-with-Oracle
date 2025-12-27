<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <aside class="w-64 bg-primary-800 text-white">
      <div class="p-6">
        <h1 class="text-xl font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          IT Department
        </h1>
        <p class="text-primary-200 text-sm mt-1">Quản lý nhân viên</p>
      </div>
      
      <nav class="mt-6">
        <NuxtLink 
          to="/" 
          class="flex items-center gap-3 px-6 py-3 text-primary-100 hover:bg-primary-700 transition-colors"
          :class="{ 'bg-primary-700 border-r-4 border-white': $route.path === '/' }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </NuxtLink>
        
        <NuxtLink 
          to="/users" 
          class="flex items-center gap-3 px-6 py-3 text-primary-100 hover:bg-primary-700 transition-colors"
          :class="{ 'bg-primary-700 border-r-4 border-white': $route.path.startsWith('/users') }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Quản lý nhân viên
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="px-8 py-4 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-800">
            <slot name="header">{{ pageTitle }}</slot>
          </h2>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-600">Admin</span>
            <div class="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
              A
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="p-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/users': 'Quản lý nhân viên',
    '/users/create': 'Thêm nhân viên mới',
  };
  
  if (route.path.startsWith('/users/') && route.params.id) {
    return 'Chi tiết nhân viên';
  }
  
  return titles[route.path] || 'IT Department';
});
</script>
