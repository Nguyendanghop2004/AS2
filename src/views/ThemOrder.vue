<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Danh sách sản phẩm từ server
const products = ref([])
const users = ref([]) // Danh sách user
const selectedUserId = ref('') // ID user đang chọn

// Đơn hàng
const order = ref({
    name: '',
    code: '',
    customer: {
        name: '',
        phone: '',
        address: ''
    },
    items: [],
    status: 'todo',
    total: 0,
    discount: 0,
    shippingFee: 0,
    paymentMethod: 'COD',
})

// Sản phẩm đang chọn để thêm vào đơn
const selectedProductId = ref('')
const selectedQty = ref(1)

const fetchProducts = async () => {
    const res = await fetch('http://localhost:3000/products')
    products.value = await res.json()
}

const fetchUsers = async () => {
    const res = await fetch('http://localhost:3000/user')
    users.value = await res.json()
}

// Khi chọn user thì tự điền thông tin vào order.customer
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
    if (!product) return alert("Chưa chọn sản phẩm!")

    order.value.items.push({
        product,
        qty: parseInt(selectedQty.value)
    })

    selectedProductId.value = ''
    selectedQty.value = 1
}

const calculateTotal = () => {
    const total = order.value.items.reduce((sum, item) => {
        return sum + item.qty * item.product.giá
    }, 0)
    order.value.total = total
}

const submitOrder = async () => {
    // Nếu mã đơn rỗng thì tạo random
    if (!order.value.code) {
        order.value.code = 'DH' + Math.floor(100000 + Math.random() * 900000)
    }
   
       
    
    calculateTotal()
    try {
        const res = await fetch('http://localhost:3000/sale-orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order.value)
        })
        if (res.ok) {
            alert('✅ Đã thêm đơn hàng!')
            router.push('/OrderList')
        } else {
            alert('❌ Thêm thất bại!')
        }
    } catch (err) {
        console.error(err)
    }
}

onMounted(() => {
    fetchProducts()
    fetchUsers()
})
</script>

<template>
    <div class="container mt-5">
        <h2>🛒 Tạo đơn hàng mới</h2>

        <div class="card p-4 shadow mb-4">
            <h4>Thông tin đơn hàng</h4>
            <input v-model="order.code" class="form-control my-2" placeholder="Mã đơn hàng (tự tạo nếu bỏ trống)" />

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

            <!-- Chọn sản phẩm -->
            <h4 class="mt-4">Chọn sản phẩm</h4>
            <div class="row g-2 mb-3">
                <div class="col-6">
                    <select v-model="selectedProductId" class="form-select">
                        <option disabled value="">-- Chọn sản phẩm --</option>
                        <option v-for="p in products" :key="p.id" :value="p.id">
                            {{ p.name }} - {{ p.giá ?? p.price }} VNĐ
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

            <!-- Danh sách sản phẩm đã chọn -->
            <ul class="list-group">
                <li class="list-group-item" v-for="(item, index) in order.items" :key="index">
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

            <button class="btn btn-success mt-3" @click="submitOrder">💾 Lưu đơn</button>
            <router-link to="/OrderList" class="btn btn-secondary mt-3 ms-2">← Quay lại</router-link>
        </div>
    </div>
</template>
