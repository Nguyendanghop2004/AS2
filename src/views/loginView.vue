<script setup>
// Trang loginView.vue
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const username = ref('');
const password = ref('');
const router = useRouter();

const login = async () => {
  if (!username.value || !password.value) {
    alert('Vui lòng nhập đầy đủ thông tin!');
    return;
  }

  try {
    const res = await axios.get('http://localhost:3000/user', {
      params: {
        username: username.value,
        password: password.value
      }
    });

    if (res.data.length === 0) {
      alert('❌ Sai tên đăng nhập hoặc mật khẩu!');
      return;
    }

    const user = res.data[0];
    localStorage.setItem('userRole', user.role); // Lưu trạng thái đăng nhập vào localStorage
    localStorage.setItem('userLogin', JSON.stringify(user)); // Lưu thông tin người dùng
    alert('✅ Đăng nhập thành công!');
    router.push('/thongke'); // Chuyển hướng về trang chính
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    alert('❌ Đăng nhập thất bại.');
  }
};

</script>

<template>
  <div class="container mt-5 col-md-4">
    <h2 class="text-center mb-4">🔐 Đăng nhập</h2>
    <div class="form-group mb-3">
      <label>Tên đăng nhập</label>
      <input v-model="username" type="text" class="form-control" />
    </div>
    <div class="form-group mb-3">
      <label>Mật khẩu</label>
      <input v-model="password" type="password" class="form-control" />
    </div>
    <button class="btn btn-primary w-100" @click="login">Đăng nhập</button>
    <router-link to="/register" class="d-block text-center mt-2">Chưa có tài khoản? Đăng ký</router-link>
  </div>
</template>
