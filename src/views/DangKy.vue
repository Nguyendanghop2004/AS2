<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const username = ref('');
const password = ref('');
const router = useRouter();

const register = async () => {
  if (!username.value || !password.value) {
    alert('Vui lòng nhập đầy đủ thông tin!');
    return;
  }

  try {
    const res = await axios.get('http://localhost:3000/user', {
      params: { username: username.value }
    });

    // if (res.data.length > 0) {
    //   alert('Tên đăng nhập đã tồn tại!');
    //   return;
    // }

    await axios.post('http://localhost:3000/user', {
      username: username.value,
      password: password.value,
      role: 'user' // mặc định là user
    });

    alert('✅ Đăng ký thành công! Vui lòng đăng nhập.');
    router.push('/login');
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    alert('❌ Đăng ký thất bại.');
  }
};
</script>

<template>
  <div class="container mt-5 col-md-4">
    <h2 class="text-center mb-4">📝 Đăng ký</h2>
    <div class="form-group mb-3">
      <label>Tên đăng nhập</label>
      <input v-model="username" type="text" class="form-control" />
    </div>
    <div class="form-group mb-3">
      <label>Mật khẩu</label>
      <input v-model="password" type="password" class="form-control" />
    </div>
    <button class="btn btn-success w-100" @click="register">Đăng ký</button>
    <router-link to="/login" class="d-block text-center mt-2">Đã có tài khoản? Đăng nhập</router-link>
  </div>
</template>
