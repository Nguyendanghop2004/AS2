<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute(); // Lấy thông tin route hiện tại
const product = ref(null); // Chứa dữ liệu sản phẩm

// Hàm lấy dữ liệu sản phẩm theo ID
const fetchProductDetail = async () => {
    try {
        const response = await fetch(`http://localhost:3000/products/${route.params.id}`);
        product.value = await response.json(); // Chuyển dữ liệu thành JSON
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    }
};

onMounted(fetchProductDetail);
</script>

<template>
    <div class="container mt-5">
        <div v-if="product" class="card">
            <div class="row g-0">
                <div class="col-md-4">
                    <img :src="product.hinhAnh" class="img-fluid rounded-start" alt="Product Image">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h2 class="card-title">{{ product.name }}</h2>
                        <h4 class="text-danger">Giá: {{ product.giá }} VNĐ</h4>
                        <p><strong>Kích thước:</strong> {{ product.kichThuoc }}</p>
                        <p><strong>Bình luận:</strong> {{ product.binhLuan }}</p>
                        <router-link to="/" class="btn btn-secondary">Quay lại</router-link>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="text-center">
            <p>Đang tải dữ liệu...</p>
        </div>
    </div>
</template>
