import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from "@/views/Login";
import Register from "@/views/Register";
import ManageProducts from "@/views/ManageProducts";
import Product from "@/views/Product";
import About from "@/views/About";

Vue.use(VueRouter)

function checkAuth(to, from, next) {
    if (!localStorage.getItem('token')) {
        next({
            name: 'Login',
            params: {nextUrl: to.fullPath}
        })
    } else {
        next()
    }
}

function checkGuest(to, from, next) {
    if (!localStorage.getItem('token')) {
        next()
    } else {
        next({name: 'Home'})
    }
}

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        beforeEnter: checkGuest
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        beforeEnter: checkGuest
    },
    {
        path: '/products',
        name: 'ManageProducts',
        component: ManageProducts,
        beforeEnter: checkAuth
    },
    {
        path: '/products/:productId',
        name: 'Product',
        component: Product,
        beforeEnter: checkAuth
    },
    {
        path: '/about',
        name: 'About',
        component: About,
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
