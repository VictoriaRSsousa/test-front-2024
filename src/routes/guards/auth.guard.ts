import { RouteLocationNormalizedGeneric, RouteLocationNormalizedLoadedGeneric, NavigationGuardNext } from 'vue-router'
import { AuthResponse, Tipo } from '../../models/authenticate.model';
import { userAuthStore } from "../../utils/auth-storage.util";



export function authGuard(
    to: RouteLocationNormalizedGeneric,
    from: RouteLocationNormalizedLoadedGeneric,
    next: NavigationGuardNext
  ) {
    const authStore = userAuthStore(); 
  
    if (to.meta.auth) {
      const user = authStore.user;
  
      if (authStore.isAuthenticated) {
        checkType(to, user as AuthResponse, next);
      } else {
        next("/login");
      }
    } else {
      next();
    }
  }
  
  function checkType(
    to: RouteLocationNormalizedGeneric,
    user: AuthResponse,
    next: NavigationGuardNext
  ): void {
    const allowedUserTypes = to.meta.tipo as Tipo[];
    const userType = user.tipo === 1 ? Tipo.Admin : Tipo.Comum;
  
    if (allowedUserTypes.includes(userType)) {
      next();
    } else {
      next('/');
    }
  }