import { defineStore } from 'pinia'
import { AuthResponse } from "../models/authenticate.model";

export const userAuthStore = defineStore("auth", {
    state: () => ({
      user: null as AuthResponse | null,
      isAuthenticated: false,
    }),
  
    actions: {
      login(userLogin: AuthResponse) {
        this.user = userLogin;
        this.isAuthenticated = true;
  
      },
  
      logout() {
        this.user = null;
        this.isAuthenticated = false;
      },
    },

  });