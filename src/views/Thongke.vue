<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const totalOrders = ref(0);
const todoOrders = ref(0);
const confirmedOrders = ref(0);
const doneOrders = ref(0);
const cancelledOrders = ref(0);
const totalRevenue = ref(0);

const totalUsers = ref(0);
const totalProducts = ref(0);

// Lấy thông tin người dùng từ localStorage
const currentUser = ref(JSON.parse(localStorage.getItem('userLogin')));

// Khởi tạo router để điều hướng
const router = useRouter();

// Hàm xử lý đăng xuất
const logout = () => {
  localStorage.removeItem('userLogin'); // Xóa thông tin người dùng
  router.push('/login'); // Chuyển hướng về trang đăng nhập
};

// Hàm lấy thông tin thống kê
const fetchStats = async () => {
  try {
    // Fetch orders
    const ordersRes = await axios.get('http://localhost:3000/sale-orders');
    const orders = ordersRes.data;

    totalOrders.value = orders.length;
    todoOrders.value = orders.filter(o => o.status === 'todo').length;
    confirmedOrders.value = orders.filter(o => o.status === 'confirmed').length;
    doneOrders.value = orders.filter(o => o.status === 'done').length;
    cancelledOrders.value = orders.filter(o => o.status === 'cancelled').length;

    // Tổng doanh thu từ đơn đã hoàn tất
    totalRevenue.value = orders
      .filter(o => o.status === 'done')
      .reduce((sum, order) => {
        return sum + order.items.reduce((sub, item) => sub + (item.qty * item.product.giá), 0);
      }, 0);

    // Fetch users
    const usersRes = await axios.get('http://localhost:3000/user');
    totalUsers.value = usersRes.data.length;

    // Fetch products
    const productsRes = await axios.get('http://localhost:3000/products');
    totalProducts.value = productsRes.data.length;

  } catch (error) {
    console.error('Lỗi khi lấy thống kê:', error);
  }
};

onMounted(fetchStats);
</script>


<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-2 p-3 bg-dark text-white vh-100">
        <h4 class="fw-bold text-center">📋 Quản lý</h4>
        <nav class="nav flex-column mt-4">
          <router-link class="nav-link text-light hover-effect" :to="{ name: 'home' }">Sản Phẩm</router-link>
          <router-link class="nav-link text-light hover-effect" :to="{ name: 'user' }">Người Dùng</router-link>
          <router-link class="nav-link text-light hover-effect" :to="{ name: 'order' }">Đơn hàng</router-link>
          <router-link class="nav-link text-light hover-effect" :to="{ name: 'thongke' }">Thống kê</router-link>
        </nav>
      </div>

      <!-- Main content -->
      <div class="col-10 p-5">
        <h2 class="text-center mb-4">📊 Thống kê hệ thống</h2>

        <!-- Hiển thị thông tin người dùng nếu đã đăng nhập -->
        <div v-if="currentUser" class="d-flex justify-content-between mb-4">
          <div>
            <p><strong>Xin chào:</strong> {{ currentUser.username }}</p>
          </div>
          <div>
            <button class="btn btn-danger" @click="logout">Đăng xuất</button>
          </div>
        </div>

        <div class="row text-center mb-4">
          <div class="col-md-3" v-for="(stat, index) in [
            { title: 'Tổng đơn hàng', value: totalOrders, color: 'primary' },
            { title: 'Chờ xử lý', value: todoOrders, color: 'secondary' },
            { title: 'Đã xác nhận', value: confirmedOrders, color: 'success' },
            { title: 'Hoàn tất', value: doneOrders, color: 'info' },
            { title: 'Đã huỷ', value: cancelledOrders, color: 'danger' },
          ]" :key="index">
            <div class="card text-white mb-3" :class="'bg-' + stat.color">
              <div class="card-body">
                <h5 class="card-title">{{ stat.title }}</h5>
                <h3>{{ stat.value }}</h3>
              </div>
            </div>
          </div>
        </div>

        <div class="row text-center">
          <div class="col-md-4">
            <div class="card bg-warning text-dark mb-3">
              <div class="card-body">
                <h5 class="card-title">👤 Tổng người dùng</h5>
                <h3>{{ totalUsers }}</h3>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card bg-dark text-white mb-3">
              <div class="card-body">
                <h5 class="card-title">📦 Tổng sản phẩm</h5>
                <h3>{{ totalProducts }}</h3>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card bg-success text-white mb-3">
              <div class="card-body">
                <h5 class="card-title">💰 Tổng doanh thu</h5>
                <h3>{{ totalRevenue.toLocaleString() }}₫</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.card {
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
</style>
