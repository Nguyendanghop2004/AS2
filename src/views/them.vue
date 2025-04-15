<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const product = ref({
    name: '',
    giá: '',
    kichThuoc: '',
    binhLuan: '',
    hinhAnh: '',
});

// Biến lưu trữ lỗi
const errors = ref({
    name: '',
    giá: '',
    kichThuoc: '',
    hinhAnh: '',
});

// Kiểm tra dữ liệu trước khi gửi
const validateForm = () => {
    let isValid = true;

    // Kiểm tra tên sản phẩm
    if (!product.value.name.trim()) {
        errors.value.name = 'Tên sản phẩm không được để trống!';
        isValid = false;
    } else {
        errors.value.name = '';
    }

    // Kiểm tra giá sản phẩm
    if (!product.value.giá || product.value.giá <= 0) {
        errors.value.giá = 'Giá phải là số dương!';
        isValid = false;
    } else {
        errors.value.giá = '';
    }

    // Kiểm tra kích thước
    if (!product.value.kichThuoc.trim()) {
        errors.value.kichThuoc = 'Vui lòng nhập kích thước!';
        isValid = false;
    } else {
        errors.value.kichThuoc = '';
    }

    // Kiểm tra URL hình ảnh (nếu nhập)
    if (product.value.hinhAnh && !/^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i.test(product.value.hinhAnh)) {
        errors.value.hinhAnh = 'URL hình ảnh không hợp lệ! (phải là jpg, png, gif)';
        isValid = false;
    } else {
        errors.value.hinhAnh = '';
    }

    return isValid;
};

const handleSubmit = async () => {
    if (!validateForm()) {
        return; // Dừng lại nếu form không hợp lệ
    }

    try {
        const response = await axios.post('http://localhost:3000/products', product.value);
        console.log('Sản phẩm đã thêm:', response.data);
        alert('Thêm sản phẩm thành công!');

        // Reset form
        product.value = {
            name: '',
            giá: '',
            kichThuoc: '',
            binhLuan: '',
            hinhAnh: '',
        };

        router.push({ name: 'home' });
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        alert('Có lỗi xảy ra, vui lòng thử lại!');
    }
};
</script>

<template>
    <div class="container mt-5">
        <h1>Thêm mới sản phẩm</h1>
        <form @submit.prevent="handleSubmit">
            <div class="mb-3">
                <label for="name" class="form-label">Tên</label>
                <input type="text" class="form-control" id="name" v-model="product.name"
                    :class="{ 'is-invalid': errors.name }">
                <div class="invalid-feedback">{{ errors.name }}</div>
            </div>

            <div class="mb-3">
                <label for="price" class="form-label">Giá</label>
                <input type="number" class="form-control" id="price" v-model="product.giá"
                    :class="{ 'is-invalid': errors.giá }">
                <div class="invalid-feedback">{{ errors.giá }}</div>
            </div>

            <div class="mb-3">
                <label for="size" class="form-label">Kích Thước</label>
                <input type="text" class="form-control" id="size" v-model="product.kichThuoc"
                    :class="{ 'is-invalid': errors.kichThuoc }">
                <div class="invalid-feedback">{{ errors.kichThuoc }}</div>
            </div>

            <div class="mb-3">
                <label for="comment" class="form-label">Bình luận</label>
                <input type="text" class="form-control" id="comment" v-model="product.binhLuan">
            </div>

            <div class="mb-3">
                <label for="image" class="form-label">Hình Ảnh (URL)</label>
                <input type="text" class="form-control" id="image" v-model="product.hinhAnh"
                    :class="{ 'is-invalid': errors.hinhAnh }">
                <div class="invalid-feedback">{{ errors.hinhAnh }}</div>
            </div>

            <button type="submit" class="btn btn-primary">Thêm sản phẩm</button>
        </form>
    </div>
</template>
