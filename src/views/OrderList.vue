<script setup>
import axios from 'axios';
import { ref, onMounted, watch } from 'vue';
import { RouterLink } from 'vue-router';

// Biến dữ liệu
const products = ref([]);
const currentPage = ref(1);
const perPage = 10;
const totalPages = ref(1);

// Hàm lấy danh sách sản phẩm có phân trang
const fetchProducts = async () => {
    try {
        const response = await axios.get('http://localhost:3000/sale-orders', {
            params: { _page: currentPage.value, _limit: perPage }
        });
        products.value = response.data;
        // Lấy tổng số sản phẩm từ header
        const totalCount = parseInt(response.headers['x-total-count'], 10);
        totalPages.value = totalCount ? Math.ceil(totalCount / perPage) : 1;
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
    }
};

onMounted(fetchProducts);
watch(currentPage, fetchProducts);

// Hàm chuyển trang
const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

// Xóa đơn hàng
const xoa = async (id) => {
    const confirmDelete = confirm("Bạn có chắc muốn xoá đơn hàng này không?");
    if (!confirmDelete) return;

    try {
        await axios.delete(`http://localhost:3000/sale-orders/${id}`);
        products.value = products.value.filter(product => product.id !== id);
        alert(" Xóa đơn hàng thành công!");
    } catch (error) {
        console.error("Lỗi khi xóa đơn hàng:", error);
        alert(" Có lỗi xảy ra khi xoá đơn hàng.");
    }
};

// Cập nhật trạng thái đơn hàng
const updateStatus = async (order, newStatus) => {
    // Nếu đơn đã bị huỷ
    if (order.status === 'cancelled') {
        alert('❌ Đơn hàng đã bị huỷ, không thể cập nhật trạng thái!');
        return;
    }

    // Không thể xác nhận lại đơn đã bị huỷ
    if (order.status === 'cancelled' && newStatus === 'confirmed') {
        alert('❌ Không thể xác nhận lại đơn hàng đã bị huỷ!');
        return;
    }

    // Không thể huỷ đơn đã hoàn tất
    if (order.status === 'done' && newStatus === 'cancelled') {
        alert('❌ Đơn hàng đã hoàn tất, không thể huỷ!');
        return;
    }

    // Không thể quay lại "todo" nếu đã được xác nhận
    if (order.status === 'confirmed' && newStatus === 'todo') {
        alert('❌ Đơn hàng đã xác nhận, không thể quay lại trạng thái "Chờ xử lý"!');
        return;
    }

    const confirmUpdate = confirm(`Bạn có chắc muốn chuyển trạng thái đơn hàng #${order.id} sang "${newStatus}"?`);
    if (!confirmUpdate) return;

    try {
        const updatedOrder = { ...order, status: newStatus };
        await axios.put(`http://localhost:3000/sale-orders/${order.id}`, updatedOrder);
        alert("✅ Trạng thái đã được cập nhật!");
        fetchProducts(); // Refresh lại dữ liệu
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        alert("❌ Không thể cập nhật trạng thái.");
    }
};
</script>

<template>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-2 p-3 bg-dark text-white vh-100">
                <h4 class="fw-bold text-center">📋 Quản lý</h4>
                <nav class="nav flex-column mt-4">
                    <router-link class="nav-link text-light hover-effect" :to="{ name: 'home' }">
                        Sản Phẩm
                    </router-link>
                    <router-link class="nav-link text-light hover-effect" :to="{ name: 'user' }">
                        Người Dùng
                    </router-link>
                    <router-link class="nav-link text-light hover-effect" :to="{ name: 'order' }">Đơn hàng
                    </router-link>
                    <router-link class="nav-link text-light hover-effect" :to="{ name: 'thongke' }">Thống kê
                    </router-link>
                </nav>
            </div>

            <!-- Nội dung chính -->
            <div class="col-10 p-4">
                <h2 class="text-center mb-4">Danh sách Order</h2>

                <router-link class="btn btn-success mb-3" :to="{ name: 'ThemOrder' }">➕ Thêm mới</router-link>

                <table class="table table-bordered text-center align-middle">
                    <thead class="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Sản phẩm</th>
                            <th>Địa chỉ</th>
                            <th>Trạng thái</th>
                            <th>Chức năng</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in products" :key="product.id">
                            <td>{{ product.id }}</td>
                            <td>{{ product.customer.name }}</td>
                            <li v-for="(item, j) in product.items" :key="j">{{ item.product.name }}</li>
                            <td>{{ product.customer.address }}</td>
                            <td>
                                <select class="form-select form-select-sm" v-model="product.status"
                                    @change="updateStatus(product, product.status)">
                                    <option value="todo">Chờ xử lý</option>
                                    <option value="confirmed">Đã xác nhận</option>
                                    <option value="shipping">Đang giao</option>
                                    <option value="done">Hoàn tất</option>
                                    <option value="cancelled">Đã huỷ</option>
                                </select>
                            </td>

                            <td>
                                <button class="btn btn-danger btn-sm me-2" @click="xoa(product.id)">🗑 Xóa</button>
                                <RouterLink class="btn btn-info btn-sm me-2"
                                    :to="{ name: 'orderList', params: { id: product.id } }">
                                    🔍 Chi tiết
                                </RouterLink>
                                <RouterLink v-if="product.status == 'todo'" class="btn btn-warning btn-sm"
                                    :to="{ name: 'editOrder', params: { id: product.id } }">
                                    ✏️ Sửa
                                </RouterLink>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Nút chuyển trang -->
                <div class="d-flex justify-content-center align-items-center mt-4">
                    <button class="btn btn-secondary mx-2" @click="changePage(currentPage.value - 1)"
                        :disabled="currentPage.value === 1">
                        ← Trước
                    </button>
                    <span class="fw-bold">Trang {{ currentPage.value }} / {{ totalPages.value }}</span>
                    <button class="btn btn-secondary mx-2" @click="changePage(currentPage.value + 1)"
                        :disabled="currentPage.value === totalPages.value">
                        Sau →
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.hover-effect:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transition: 0.3s ease-in-out;
}
</style>
