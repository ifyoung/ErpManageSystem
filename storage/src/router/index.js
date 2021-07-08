import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/login.vue";
import PayCenter from "../views/payCenter.vue";
import ProductCome from "../views/productManage/productCome";
import ProductList from "../views/productManage/productList";
import ProductOut from "../views/productManage/productOut";
import ProductOutList from "../views/productManage/productOutList";

import BoxCome from "../views/boxManage/boxCome";
import BoxList from "../views/boxManage/boxList";
import BoxOut from "../views/boxManage/boxOut";
import BoxOutList from "../views/boxManage/boxOutList";

import PossessSystem from '../views/possessSystem/possessSystem'

import NoticeCenter from '../views/noticeCenter'

import CustomerManage from '../views/customerManage/customerManage'

import OutRecord from '../views/outRecord'
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/payCenter",
        component: PayCenter,
      },
      {
        path: "/noticeCenter",
        component: NoticeCenter,
      },
      {
        path: "/productCome",
        component: ProductCome,
      },
      {
        path: "/productList",
        component: ProductList,
      },

      {
        path: "/productOut",
        component: ProductOut,
      },
      {
        path: "/productOutList",
        component: ProductOutList,
      },
      {
        path: "/boxCome",
        component: BoxCome,
      },
      {
        path: "/boxList",
        component: BoxList,
      },

      {
        path: "/boxOut",
        component: BoxOut,
      },
      {
        path: "/boxOutList",
        component: BoxOutList,
      },
      {
        path: "/possessSystem",
        component: PossessSystem,
      },
      {
        path: "/customerManage",
        component: CustomerManage,
      },
      {
        path: "/outRecord",
        component:OutRecord,
      }
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
