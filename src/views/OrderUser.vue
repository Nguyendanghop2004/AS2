<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userId = route.params.id

const orders = ref([])

const fetchOrdersByUser = async () => {
  try {
    const res = await fetch('http://localhost:3000/sale-orders')
    const allOrders = await res.json()
    orders.value = allOrders.filter(order => order.name === userId)
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng:', error)
  }
}

const cancelOrder = async (order) => {
  if (order.status === 'confirmed') {
    return alert('❌ Đơn đã xác nhận, không thể huỷ!')
  }

  if (order.status === 'cancelled') {
    return alert('❌ Đơn đã bị huỷ trước đó!')
  }

  if (!confirm(`Bạn chắc chắn muốn huỷ đơn ${order.code}?`)) return

  const updatedOrder = { ...order, status: 'cancelled' }

  try {
    const res = await fetch(`http://localhost:3000/sale-orders/${order.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedOrder)
    })

    if (res.ok) {
      alert('✅ Đơn hàng đã được huỷ.')
      fetchOrdersByUser()
    } else {
      alert('❌ Huỷ thất bại.')
    }
  } catch (err) {
    console.error(err)
    alert('❌ Lỗi server khi huỷ đơn.')
  }
}

onMounted(() => {
  fetchOrdersByUser()
})
</script>

<template>
  <div class="container mt-4">
    <h3>📦 Đơn hàng của người dùng ID: {{ userId }}</h3>

    <table class="table table-bordered mt-3">
      <thead>
        <tr>
          <th>Mã đơn</th>
          <th>Tên khách</th>
          <th>Trạng thái</th>
          <th>Tổng tiền</th>
          <th>Thanh toán</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.code }}</td>
          <td>{{ order.customer.name }}</td>
          <td>{{ order.status }}</td>
          <td>{{ order.total.toLocaleString() }} VNĐ</td>
          <td>{{ order.paymentMethod }}</td>
          <td>
            <button
              class="btn btn-danger btn-sm"
              @click="cancelOrder(order)"
              :disabled="order.status === 'confirmed' || order.status === 'cancelled'"
            >
              ❌ Huỷ
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <router-link to="/user" class="btn btn-secondary mt-3">← Quay lại trang chủ</router-link>
  </div>
</template>
