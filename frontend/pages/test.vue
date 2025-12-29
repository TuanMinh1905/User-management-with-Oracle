<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">🧪 Test Oracle Connection</h1>

    <!-- Status Card -->
    <div class="card p-6 mb-6">
      <div class="flex items-center gap-3 mb-4">
        <div 
          class="w-4 h-4 rounded-full"
          :class="status === 'success' ? 'bg-green-500' : status === 'error' ? 'bg-red-500' : 'bg-gray-300'"
        ></div>
        <span class="font-medium">
          {{ status === 'success' ? 'Kết nối thành công!' : status === 'error' ? 'Lỗi kết nối' : 'Chưa kết nối' }}
        </span>
      </div>
      
      <button 
        @click="fetchData" 
        :disabled="loading"
        class="btn-primary px-4 py-2 rounded-lg"
      >
        {{ loading ? 'Đang tải...' : '🔄 Lấy dữ liệu từ Oracle' }}
      </button>

      <p v-if="error" class="mt-4 text-red-600 bg-red-50 p-3 rounded">
        ❌ {{ error }}
      </p>
    </div>

    <!-- Data Table -->
    <div v-if="employees.length > 0" class="card overflow-hidden">
      <div class="p-4 bg-gray-50 border-b">
        <h2 class="font-semibold text-gray-700">
          📋 Bảng Employee ({{ employees.length }} nhân viên)
        </h2>
      </div>
      
      <table class="w-full">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="emp in employees" :key="emp.ID" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-800">{{ emp.ID }}</td>
            <td class="px-6 py-4 text-sm text-gray-800 font-medium">{{ emp.TEN }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ emp.EMAIL }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else-if="status === 'success'" class="card p-8 text-center text-gray-500">
      Không có dữ liệu trong bảng Employee
    </div>

    <!-- Instructions -->
    <div class="mt-6 card p-6 bg-blue-50">
      <h3 class="font-semibold text-blue-800 mb-3">📝 Hướng dẫn</h3>
      <p class="text-blue-700 text-sm mb-2">Nếu chưa có data, hãy chạy SQL sau trong SQL Developer:</p>
      <pre class="bg-blue-100 p-4 rounded text-xs overflow-x-auto text-blue-900">
-- Đăng nhập SYS
CREATE USER FirstTest IDENTIFIED BY test123;
GRANT CREATE SESSION, CREATE TABLE, UNLIMITED TABLESPACE TO FirstTest;

-- Tạo bảng
CREATE TABLE FirstTest.Employee (
    id NUMBER PRIMARY KEY,
    ten NVARCHAR2(100),
    email VARCHAR2(100)
);

-- Thêm data
INSERT INTO FirstTest.Employee VALUES (1, N'Nguyễn Văn A', 'nguyenvana@email.com');
INSERT INTO FirstTest.Employee VALUES (2, N'Trần Thị B', 'tranthib@email.com');
INSERT INTO FirstTest.Employee VALUES (3, N'Lê Văn C', 'levanc@email.com');
INSERT INTO FirstTest.Employee VALUES (4, N'Phạm Thị D', 'phamthid@email.com');
COMMIT;
      </pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

interface Employee {
  ID: number;
  TEN: string;
  EMAIL: string;
}

const employees = ref<Employee[]>([]);
const loading = ref(false);
const error = ref('');
const status = ref<'idle' | 'success' | 'error'>('idle');

async function fetchData() {
  loading.value = true;
  error.value = '';
  
  try {
    const response = await fetch(`${config.public.apiBase}/test-oracle`);
    const data = await response.json();
    
    if (data.success) {
      employees.value = data.data || [];
      status.value = 'success';
    } else {
      error.value = data.error || 'Lỗi không xác định';
      status.value = 'error';
    }
  } catch (err: any) {
    error.value = err.message || 'Không thể kết nối tới server';
    status.value = 'error';
  } finally {
    loading.value = false;
  }
}

// Auto fetch on mount
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 transition-colors;
}

.card {
  @apply bg-white rounded-xl shadow-sm border border-gray-100;
}
</style>
