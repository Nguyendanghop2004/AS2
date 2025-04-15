import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ListView from '@/views/ListView.vue';
import Them from '@/views/them.vue';
import Sua from '@/views/Sua.vue';
import UserThem from '@/views/UserThem.vue';
import UserSua from '@/views/UserSua.vue';
import UserList from '@/views/UserList.vue';
import User from '@/views/User.vue';
import OrderList from '@/views/orderList.vue';
import OrderListOne from '@/views/OrderListOne.vue';
import ThemOrder from '@/views/ThemOrder.vue';
import OrderUser from '@/views/OrderUser.vue';
import OrderEdit from '@/views/OrderEdit.vue';
import Thongke from '@/views/Thongke.vue';
import LoginView from '@/views/loginView.vue';
import DangKy from '@/views/DangKy.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true } // Chỉ cho phép truy cập nếu đã đăng nhập
    },
    {
      path: '/listView/:id',
      name: 'listView',
      component: ListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/ThemMoi',
      name: 'them',
      component: Them,
      meta: { requiresAuth: true }
    },
    {
      path: '/Sua/:id',
      name: 'sua',
      component: Sua,
      meta: { requiresAuth: true }
    },
    {
      path: '/user',
      name: 'user',
      component: User,
      meta: { requiresAuth: true }
    },
    {
      path: '/ThemMoiUser',
      name: 'themUser',
      component: UserThem,
      meta: { requiresAuth: true }
    },
    {
      path: '/SuaUser/:id',
      name: 'suaUser',
      component: UserSua,
      meta: { requiresAuth: true }
    },
    {
      path: '/listViewUser/:id',
      name: 'listViewUser',
      component: UserList,
      meta: { requiresAuth: true }
    },
    {
      path: '/OrderList',
      name: 'order',
      component: OrderList,
      meta: { requiresAuth: true }
    },
    {
      path: '/orderList/:id',
      name: 'orderList',
      component: OrderListOne,
      meta: { requiresAuth: true }
    },
    {
      path: '/ThemOrder',
      name: 'ThemOrder',
      component: ThemOrder,
      meta: { requiresAuth: true }
    },
    {
      path: '/OrderUser/:id',
      name: 'orderUser',
      component: OrderUser,
      meta: { requiresAuth: true }
    },
    {
      path: '/editOrder/:id',
      name: 'editOrder',
      component: OrderEdit,
      meta: { requiresAuth: true }
    },
    {
      path: '/thongke',
      name: 'thongke',
      component: Thongke,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/dangky',
      name: 'dangky',
      component: DangKy
    }
  ]
});

// Đảm bảo phải đăng nhập trước khi vào các route yêu cầu auth
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('userRole'); // Kiểm tra xem đã đăng nhập chưa

  // Nếu route yêu cầu auth mà người dùng chưa đăng nhập, chuyển hướng đến trang login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login'); // Chuyển đến trang login
  }

  next(); // Tiếp tục với route bình thường
});

export default router;
