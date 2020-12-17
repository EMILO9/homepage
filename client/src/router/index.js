import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import Account from "../views/Account.vue";
import cantReach from "../views/cantReach.vue";
import store from '../store/index'
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup
  },
  {
    path: "/account",
    name: "Account",
    component: Account
  },
  {
    path: "*",
    component: cantReach
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.name === 'Account' && !store.state.user) next({ name: 'Login' }) 
  else next()
})

export default router;
