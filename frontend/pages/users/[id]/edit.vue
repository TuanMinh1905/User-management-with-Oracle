<template>
  <div class="max-w-3xl">
    <!-- Loading -->
    <div v-if="pageLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="user" class="card p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">Chỉnh sửa thông tin nhân viên</h2>
      
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
              disabled
            />
            <p class="text-xs text-gray-500 mt-1">Mã nhân viên không thể thay đổi</p>
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
            {{ loading ? 'Đang lưu...' : 'Cập nhật' }}
          </button>
          <NuxtLink :to="`/users/${route.params.id}`" class="btn btn-secondary">
            Hủy
          </NuxtLink>
        </div>
      </form>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-12">
      <p class="text-gray-500 mb-4">Không tìm thấy nhân viên</p>
      <NuxtLink to="/users" class="btn btn-primary">Quay lại danh sách</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import type { UserFormData } from '~/types';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const pageLoading = ref(true);
const loading = ref(false);
const error = ref('');
const user = computed(() => userStore.currentUser);

// Chỉ có 5 trường theo Oracle: USERNAME, FULL_NAME, EMAIL, PHONE, ADDRESS
const form = reactive<UserFormData>({
  employeeId: '',
  fullName: '',
  email: '',
  phone: '',
  address: '',
});

const loadUser = async () => {
  pageLoading.value = true;
  const id = route.params.id as string;
  
  if (id) {
    const userData = await userStore.fetchUserById(id);
    if (userData) {
      form.employeeId = userData.employeeId;
      form.fullName = userData.fullName;
      form.email = userData.email;
      form.phone = userData.phone || '';
      form.address = userData.address || '';
    }
  }
  
  pageLoading.value = false;
};

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;
  
  try {
    const id = route.params.id as string;
    await userStore.updateUser(id, form);
    router.push(`/users/${id}`);
  } catch (err: any) {
    error.value = err.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadUser();
});
</script>
