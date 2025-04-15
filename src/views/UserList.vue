<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute(); // Lấy thông tin route hiện tại
const user = ref(null); // Chứa dữ liệu người dùng

// Hàm lấy dữ liệu người dùng theo ID
const fetchUserDetail = async () => {
    try {
        const response = await fetch(`http://localhost:3000/user/${route.params.id}`);
        user.value = await response.json(); // Chuyển dữ liệu thành JSON
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết người dùng:", error);
    }
};

onMounted(fetchUserDetail);
</script>

<template>
    <div class="container mt-5">
        <div v-if="user" class="card">
            <div class="row g-0">
                <div class="col-md-4">
                    <img :src="user.hinhAnh" class="img-fluid rounded-start" alt="User Image">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h2 class="card-title">{{ user.name }}</h2>
                        <h4 class="text-primary">Tuổi: {{ user.tuoi }}</h4>
                        <p><strong>Số điện thoại:</strong> {{ user.Sdt }}</p>
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
