<template>
  <div class="max-w-3xl">
    <div class="card p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">Thêm nhân viên mới</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Employee ID (USERNAME) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Mã nhân viên <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="form.employeeId" 
              type="text" 
              class="input"
              placeholder="VD: NV001"
              required
            />
          </div>

          <!-- Full Name (FULL_NAME) -->
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

          <!-- Phone (PHONE) -->
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

          <!-- Address (ADDRESS) -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ
            </label>
            <input 
              v-model="form.address" 
              type="text" 
              class="input"
              placeholder="123 Đường ABC, Quận 1, TP.HCM"
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

// Chỉ có 5 trường theo Oracle: USERNAME, FULL_NAME, EMAIL, PHONE, ADDRESS
const form = reactive<UserFormData>({
  employeeId: '',
  fullName: '',
  email: '',
  phone: '',
  address: '',
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
