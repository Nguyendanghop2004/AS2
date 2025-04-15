<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const user = ref({
    name: '',
    tuoi: '',
    Sdt: '',
    hinhAnh: '',
});

const errors = ref({
    name: '',
    tuoi: '',
    Sdt: '',
    hinhAnh: '',
});

// Lấy dữ liệu người dùng theo ID
const fetchUser = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/user/${route.params.id}`);
        if (!response.data) {
            alert("Người dùng không tồn tại!");
            router.push({ name: 'user' });
            return;
        }
        user.value = response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        alert("Không thể tải dữ liệu người dùng!");
        router.push({ name: 'user' });
    }
};

// Kiểm tra dữ liệu trước khi gửi
const validateForm = () => {
    let isValid = true;

    // Kiểm tra tên người dùng
    if (!user.value.name.trim()) {
        errors.value.name = 'Tên người dùng không được để trống!';
        isValid = false;
    } else {
        errors.value.name = '';
    }

    // Kiểm tra tuổi
    if (!user.value.tuoi || user.value.tuoi <= 0) {
        errors.value.tuoi = 'Tuổi phải là số dương!';
        isValid = false;
    } else {
        errors.value.tuoi = '';
    }

    // Kiểm tra số điện thoại
    if (!user.value.Sdt.trim() || !/^0[3|5|7|8|9][0-9]{8}$/.test(user.value.Sdt)) {
        errors.value.Sdt = 'Số điện thoại không hợp lệ!';
        isValid = false;
    } else {
        errors.value.Sdt = '';
    }

    // Kiểm tra URL hình ảnh
    if (user.value.hinhAnh && !/^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i.test(user.value.hinhAnh)) {
        errors.value.hinhAnh = 'URL hình ảnh không hợp lệ! (jpg, png, gif)';
        isValid = false;
    } else {
        errors.value.hinhAnh = '';
    }

    return isValid;
};

// Cập nhật người dùng
const updateUser = async () => {
    if (!validateForm()) {
        return;
    }

    try {
        await axios.put(`http://localhost:3000/user/${route.params.id}`, user.value);
        alert('Cập nhật người dùng thành công!');
        router.push({ name: 'user' });
    } catch (error) {
        console.error('Lỗi khi cập nhật người dùng:', error);
        alert('Có lỗi xảy ra, vui lòng thử lại!');
    }
};

onMounted(fetchUser);
</script>

<template>
    <div class="container mt-5">
        <h1>Chỉnh sửa người dùng</h1>
        <form @submit.prevent="updateUser">
            <div class="mb-3">
                <label for="name" class="form-label">Tên</label>
                <input type="text" class="form-control" id="name" v-model="user.name" :class="{ 'is-invalid': errors.name }">
                <div class="invalid-feedback">{{ errors.name }}</div>
            </div>

            <div class="mb-3">
                <label for="tuoi" class="form-label">Tuổi</label>
                <input type="number" class="form-control" id="tuoi" v-model="user.tuoi" :class="{ 'is-invalid': errors.tuoi }">
                <div class="invalid-feedback">{{ errors.tuoi }}</div>
            </div>

            <div class="mb-3">
                <label for="Sdt" class="form-label">Số điện thoại</label>
                <input type="text" class="form-control" id="Sdt" v-model="user.Sdt" :class="{ 'is-invalid': errors.Sdt }">
                <div class="invalid-feedback">{{ errors.Sdt }}</div>
            </div>

            <div class="mb-3">
                <label for="hinhAnh" class="form-label">Hình Ảnh (URL)</label>
                <input type="text" class="form-control" id="hinhAnh" v-model="user.hinhAnh" :class="{ 'is-invalid': errors.hinhAnh }">
                <div class="invalid-feedback">{{ errors.hinhAnh }}</div>
            </div>

            <button type="submit" class="btn btn-primary">Cập nhật</button>
            <router-link class="btn btn-secondary ms-2" :to="{ name: 'user' }">Hủy</router-link>
        </form>
    </div>
</template>
