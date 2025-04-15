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
    const response = await axios.get('http://localhost:3000/products', {
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
const xoa = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/products/${id}`);
    products.value = products.value.filter(product => product.id !== id);
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
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
         
          <router-link class="nav-link text-light hover-effect" :to="{ name: 'home' }">Sản Phẩm </router-link>
          <router-link class="nav-link text-light hover-effect" :to="{ name: 'user' }">Người Dùng </router-link>
          <router-link class="nav-link text-light hover-effect" :to="{ name: 'order' }">Đơn hàng </router-link>
          <router-link class="nav-link text-light hover-effect" :to="{ name: 'thongke' }">Thống kê </router-link>
        </nav>
      </div>

      <!-- Nội dung chính -->
      <div class="col-10 p-4">
        <h2 class="text-center mb-4">Danh sách Sản phẩm</h2>

        <router-link class="btn btn-success mb-3" :to="{ name: 'them' }">➕ Thêm mới</router-link>

        <table class="table table-bordered text-center align-middle">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Giá</th>
              <th>Bình Luận</th>
              <th>Kích Thước</th>
              <th>Ảnh</th>
              <th>Chức năng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.giá }}</td>
              <td>{{ product.binhLuan }}</td>
              <td>{{ product.kichThuoc }}</td>
              <td>
                <img :src="product.hinhAnh" alt="Hình ảnh sản phẩm" class="img-thumbnail" width="80">
              </td>
              <td>
                <button class="btn btn-danger btn-sm me-2" @click="xoa(product.id)">🗑 Xóa</button>
                <RouterLink class="btn btn-info btn-sm me-2" :to="{ name: 'listView', params: { id: product.id } }">
                  🔍 Chi tiết
                </RouterLink>
                <RouterLink class="btn btn-warning btn-sm" :to="{ name: 'sua', params: { id: product.id } }">
                  ✏️ Sửa
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Nút chuyển trang -->
        <div class="d-flex justify-content-center align-items-center mt-4">
          <button class="btn btn-secondary mx-2" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
            ← Trước
          </button>
          <span class="fw-bold">Trang {{ currentPage }} / {{ totalPages }}</span>
          <button class="btn btn-secondary mx-2" @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages">
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

<style>
.hover-effect:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transition: background-color 0.3s ease-in-out;
}
</style>
