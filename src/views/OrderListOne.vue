<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const order = ref(null)

const fetchOrderDetail = async () => {
  try {
    const res = await fetch(`http://localhost:3000/sale-orders/${route.params.id}`)
    order.value = await res.json()
  } catch (err) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', err)
  }
}

onMounted(fetchOrderDetail)

const formatCurrency = (value) => {
  return value?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}
</script>

<template>
  <div class="container mt-5">
    <div v-if="order" class="card p-4 shadow">
      <h2 class="mb-3">🧾 {{ order.name }} - {{ order.code }}</h2>
      <p><strong>Ngày tạo:</strong> {{ new Date(order.createdAt).toLocaleString("vi-VN") }}</p>
      <p><strong>Trạng thái:</strong> {{ order.status }}</p>
      <p><strong>Phương thức thanh toán:</strong> {{ order.paymentMethod }}</p>

      <hr>

      <h4>👤 Khách hàng</h4>
      <p><strong>Tên:</strong> {{ order.customer.name }}</p>
      <p><strong>SĐT:</strong> {{ order.customer.phone }}</p>
      <p><strong>Địa chỉ:</strong> {{ order.customer.address }}</p>

      <hr>

      <h4>📦 Sản phẩm trong đơn</h4>
      <table class="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in order.items" :key="index">
            <td>{{ item.product.name }}</td>
            <td>{{ formatCurrency(item.product.giá) }}</td>
            <td>{{ item.qty }}</td>
            <td>{{ formatCurrency(item.qty * item.product.giá) }}</td>
            <td>
              <span :class="item.product.status === 'active' ? 'text-success' : 'text-danger'">
                {{ item.product.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <hr>

      <div class="text-end">
        <p><strong>Tạm tính:</strong> {{ formatCurrency(order.total) }}</p>
        <p><strong>Giảm giá:</strong> {{ formatCurrency(order.discount) }}</p>
        <p><strong>Phí vận chuyển:</strong> {{ formatCurrency(order.shippingFee) }}</p>
        <p class="text-primary fs-5">
          <strong>Tổng thanh toán:</strong>
          {{ formatCurrency(order.total - order.discount + order.shippingFee) }}
        </p>
      </div>

      <router-link to="/OrderList" class="btn btn-secondary mt-3">← Quay lại danh sách</router-link>
    </div>

    <div v-else class="text-center">
      <p>Đang tải chi tiết đơn hàng...</p>
    </div>
  </div>
</template>
