<template>
  <header
    class="flex py-4 px-6 md:px-10 justify-between items-center bg-gray-50 border-b border-gray-200 shadow-sm"
  >
    <h2
      @click="redirectToHomeView"
      class="flex items-center cursor-pointer w-10 text-lg font-bold text-gray-800"
    >
      Olá, {{ name }}
    </h2>

    <v-btn
      @click="logout"
      class="!bg-blue-500 hover:!bg-blue-600 text-white rounded-md px-4 py-2 text-sm md:text-base transition-all duration-300 ease-in-out shadow-sm hover:shadow-md focus:outline-none focus:ring focus:ring-blue-300"
    >
      Sair
    </v-btn>
  </header>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { userAuthStore } from "../../utils/auth-storage.util";
import { computed } from "vue";

export default {
  setup() {
    const router = useRouter();
    const authStore = userAuthStore();

    const name = computed((): string | undefined => {
      const user = authStore.user;
      return user?.usuario || undefined;
    });

    const logout = (): void => {
      authStore.logout();
      window.location.reload();
    };

    const redirectToHomeView = (): void => {
      router.push("/");
    };

    return {
      logout,
      redirectToHomeView,
      name,
    };
  },
};
</script>
