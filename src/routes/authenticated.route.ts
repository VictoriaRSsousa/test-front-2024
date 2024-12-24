import { RouteRecordRaw } from "vue-router";
import { Tipo } from "../models/authenticate.model";

export const authenticatedRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: ()=> import('../views/Home/index.vue'),
        name: 'home',
        meta: { auth: true, tipo: [Tipo.Admin, Tipo.Comum] ,hasNavbar:true}
      },
      {
        path: '/register',
        component: ()=> import('../views/Register/index.vue'),
        name: 'register',
        meta: { auth: true, tipo: [Tipo.Admin],hasNavbar:true }
      },
  
  ]