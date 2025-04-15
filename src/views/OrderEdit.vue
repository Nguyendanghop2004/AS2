<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const orderId = route.params.id

const order = ref(null)
const products = ref([])
const users = ref([])
const selectedUserId = ref('')
const selectedProductId = ref('')
const selectedQty = ref(1)

const fetchOrder = async () => {
  const res = await fetch(`http://localhost:3000/sale-orders/${orderId}`)
  order.value = await res.json()
  selectedUserId.value = order.value.name
}

const fetchProducts = async () => {
  const res = await fetch('http://localhost:3000/products')
  products.value = await res.json()
}

const fetchUsers = async () => {
  const res = await fetch('http://localhost:3000/user')
  users.value = await res.json()
}

watch(selectedUserId, (id) => {
  const user = users.value.find(u => u.id === id)
  if (user) {
    order.value.customer = {
      name: user.name,
      phone: user.Sdt,
      address: user.address
    }
    order.value.name = id
  }
})

const addItem = () => {
  const product = products.value.find(p => p.id === selectedProductId.value)
  if (!product) return alert('Chưa chọn sản phẩm!')

  order.value.items.push({
    product,
    qty: parseInt(selectedQty.value)
  })

  selectedProductId.value = ''
  selectedQty.value = 1
}

const calculateTotal = () => {
  const total = order.value.items.reduce((sum, item) => sum + item.qty * item.product.giá, 0)
  order.value.total = total
}

const updateOrder = async () => {
  calculateTotal()
  try {
    const res = await fetch(`http://localhost:3000/sale-orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order.value)
    })

    if (res.ok) {
      alert('✅ Đã cập nhật đơn hàng!')
      router.push('/OrderList')
    } else {
      alert('❌ Cập nhật thất bại!')
    }
  } catch (err) {
    console.error(err)
    alert('❌ Lỗi server!')
  }
}

onMounted(() => {
  fetchOrder()
  fetchProducts()
  fetchUsers()
})
</script>

<template>
  <div class="container mt-5" v-if="order">
    <h2>✏️ Chỉnh sửa đơn hàng</h2>

    <div class="card p-4 shadow mb-4">
      <input v-model="order.code" class="form-control my-2" placeholder="Mã đơn hàng" />

      <h4 class="mt-4">Chọn khách hàng</h4>
      <select v-model="selectedUserId" class="form-select my-2">
        <option disabled value="">-- Chọn khách hàng --</option>
        <option v-for="user in users" :key="user.id" :value="user.id">
          {{ user.name }} - {{ user.Sdt }}
        </option>
      </select>

      <input v-model="order.customer.name" class="form-control my-2" placeholder="Tên khách" />
      <input v-model="order.customer.phone" class="form-control my-2" placeholder="SĐT" />
      <input v-model="order.customer.address" class="form-control my-2" placeholder="Địa chỉ" />

      <h4 class="mt-4">Chọn sản phẩm</h4>
      <div class="row g-2 mb-3">
        <div class="col-6">
          <select v-model="selectedProductId" class="form-select">
            <option disabled value="">-- Chọn sản phẩm --</option>
            <option v-for="p in products" :key="p.id" :value="p.id">
              {{ p.name }} - {{ p.giá }} VNĐ
            </option>
          </select>
        </div>
        <div class="col-2">
          <input type="number" v-model="selectedQty" min="1" class="form-control" placeholder="Số lượng" />
        </div>
        <div class="col-auto">
          <button @click="addItem" class="btn btn-primary">+ Thêm</button>
        </div>
      </div>

      <!-- Danh sách sản phẩm -->
      <ul class="list-group">
        <li class="list-group-item d-flex justify-content-between align-items-center" v-for="(item, index) in order.items" :key="index">
          {{ item.product.name }} - SL: {{ item.qty }} - Giá: {{ item.product.giá }} × {{ item.qty }} =
          {{ item.qty * item.product.giá }} VNĐ
        </li>
      </ul>

      <!-- Thanh toán -->
      <h4 class="mt-4">Thanh toán</h4>
      <input v-model="order.discount" type="number" class="form-control my-2" placeholder="Giảm giá" />
      <input v-model="order.shippingFee" type="number" class="form-control my-2" placeholder="Phí vận chuyển" />
      <select v-model="order.paymentMethod" class="form-select my-2">
        <option value="COD">COD</option>
        <option value="Momo">Momo</option>
        <option value="Bank">Chuyển khoản</option>
      </select>

      <button class="btn btn-success mt-3" @click="updateOrder">💾 Cập nhật đơn</button>
      <router-link to="/OrderList" class="btn btn-secondary mt-3 ms-2">← Quay lại</router-link>
    </div>
  </div>
</template>
