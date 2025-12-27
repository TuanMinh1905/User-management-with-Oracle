<template>
  <div class="max-w-3xl">
    <div class="card p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">Thêm nhân viên mới</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Employee ID -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Mã nhân viên <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="form.employeeId" 
              type="text" 
              class="input"
              placeholder="VD: IT001"
              required
            />
          </div>

          <!-- Full Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="form.fullName" 
              type="text" 
              class="input"
              placeholder="Nguyễn Văn A"
              required
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="form.email" 
              type="email" 
              class="input"
              placeholder="email@company.com"
              required
            />
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input 
              v-model="form.phone" 
              type="tel" 
              class="input"
              placeholder="0901234567"
            />
          </div>

          <!-- Position -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Vị trí <span class="text-red-500">*</span>
            </label>
            <select v-model="form.position" class="select" required>
              <option value="">Chọn vị trí</option>
              <option value="Developer">Developer</option>
              <option value="Senior Developer">Senior Developer</option>
              <option value="Tester">Tester</option>
              <option value="DevOps">DevOps</option>
              <option value="BA">BA</option>
              <option value="Tech Lead">Tech Lead</option>
              <option value="Project Manager">Project Manager</option>
            </select>
          </div>

          <!-- Role -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Vai trò <span class="text-red-500">*</span>
            </label>
            <select v-model="form.role" class="select" required>
              <option value="MEMBER">Nhân viên</option>
              <option value="MANAGER">Quản lý</option>
              <option value="ADMIN">Quản trị viên</option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái <span class="text-red-500">*</span>
            </label>
            <select v-model="form.status" class="select" required>
              <option value="ACTIVE">Đang làm việc</option>
              <option value="ON_LEAVE">Nghỉ phép</option>
              <option value="INACTIVE">Nghỉ việc</option>
            </select>
          </div>

          <!-- Join Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ngày vào làm
            </label>
            <input 
              v-model="form.joinDate" 
              type="date" 
              class="input"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg">
          {{ error }}
        </div>

        <!-- Actions -->
        <div class="flex gap-4 pt-4">
          <button 
            type="submit" 
            class="btn btn-primary flex items-center gap-2"
            :disabled="loading"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Đang lưu...' : 'Thêm nhân viên' }}
          </button>
          <NuxtLink to="/users" class="btn btn-secondary">
            Hủy
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import type { UserFormData } from '~/types';

const router = useRouter();
const userStore = useUserStore();

const loading = ref(false);
const error = ref('');

const form = reactive<UserFormData>({
  employeeId: '',
  fullName: '',
  email: '',
  phone: '',
  position: '',
  role: 'MEMBER',
  status: 'ACTIVE',
  joinDate: new Date().toISOString().split('T')[0],
});

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;
  
  try {
    await userStore.createUser(form);
    router.push('/users');
  } catch (err: any) {
    error.value = err.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
  } finally {
    loading.value = false;
  }
};
</script>
