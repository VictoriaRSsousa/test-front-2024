<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar/index.vue';

export default defineComponent({
  components: {
    Navbar
  },
  setup() {
    const route = useRoute();

    const hasNavbar = (): boolean => !!route.meta.hasNavbar;
    
    return {
      hasNavbar
    };
  }
});
</script>

<template>
  <Navbar v-if="hasNavbar()" />
  <RouterView />
</template>
