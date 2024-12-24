import { RouteRecordRaw } from "vue-router";

export const unauthenticatedRoutes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        component: ()=> import('../views/Login/index.vue'),
        name: 'login',
        meta: { auth: false, hasNavbar:false }
      },
  ]