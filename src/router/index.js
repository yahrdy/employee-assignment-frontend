import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from "@/views/Login";
import Register from "@/views/Register";
import ManageProducts from "@/views/ManageProducts";
import Product from "@/views/Product";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/products',
        name: 'ManageProducts',
        component: ManageProducts
    },
    {
        path: '/products/:productId',
        name: 'Product',
        component: Product
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
