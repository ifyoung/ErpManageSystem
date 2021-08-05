import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/login.vue";
import Welcome from "../views/welcome.vue";
import PayCenter from "../views/payCenter.vue";
import ProductCome from "../views/productManage/productCome";
import ProductList from "../views/productManage/productList";
import ProductOut from "../views/productManage/productOut";
import ProductOutList from "../views/productManage/productOutList";

import BoxCome from "../views/boxManage/boxCome";
import BoxList from "../views/boxManage/boxList";
import BoxOut from "../views/boxManage/boxOut";
import BoxOutList from "../views/boxManage/boxOutList";

import CusProductList from "../views/customer/cusProductList";
import OnlyReadProductCome from '../views/customer/onlyRead/onlyReadProductCome'
import OnlyReadProductList from '../views/customer/onlyRead/onlyReadProductList'
import OnlyReadBoxCome from '../views/customer/onlyRead/onlyReadBoxCome'
import OnlyReadBoxList from '../views/customer/onlyRead/onlyReadBoxList'
import OnlyReadOutRecord from '../views/customer/onlyRead/onlyReadOutRecord'

import PossessSystem from "../views/possessSystem/possessSystem";

// import ProductOrderCenter from '../views/orderCenter/productOrderCenter'
// import BoxOrderCenter from '../views/orderCenter/boxOrderCenter'
import OrderCenter from "../views/orderCenter/orderCenter";

import CustomerManage from "../views/customerManage/customerManage";

import OutRecord from "../views/outRecord";
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
        path: "/",
        component: Welcome,
      },
      {
        path: "/payCenter",
        component: PayCenter,
      },
      // {
      //   path: "/productOrderCenter",
      //   component: ProductOrderCenter,
      // },
      // {
      //   path: "/boxOrderCenter",
      //   component: BoxOrderCenter,
      // },
      {
        path: "/orderCenter",
        component: OrderCenter,
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
        component: OutRecord,
      },
      {
        path: "/cusProductList",
        component: CusProductList,
      },

      {
        path: "/onlyReadProductCome",
        component: OnlyReadProductCome,
      },

      {
        path: "/onlyReadProductList",
        component: OnlyReadProductList,
      },

      {
        path: "/onlyReadBoxCome",
        component: OnlyReadBoxCome,
      },

      {
        path: "/onlyReadBoxList",
        component: OnlyReadBoxList,
      },

      {
        path: "/onlyReadOutRecord",
        component: OnlyReadOutRecord,
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
