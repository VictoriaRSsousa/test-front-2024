import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { authenticatedRoutes } from './authenticated.route';
import { unauthenticatedRoutes } from './unauthenticated.route';
import { authGuard } from './guards/auth.guard';
const routes: Array<RouteRecordRaw> = [
  ...authenticatedRoutes,...unauthenticatedRoutes
];
 
const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) =>{
  authGuard(to, from, next)

})
export default router;