<template>
  <section
    class="h-screen bg-[#f8f9fa] text-[#212529] relative"
  >
    <v-alert
      v-show="showAlert"
      :title="infoAlerts.title"
      :text="infoAlerts.description"
      :type="infoAlerts.severity"
      class="w-[80vw] max-w-[450px] !h-20 !top-0 mx-5 mt-5 !right-0 !absolute !z-10"
    ></v-alert>
    <div class="!flex h-full !flex-col !justify-between">
      <v-sheet
        class="!my-auto p-5 mx-auto bg-[#e9ecef] h-[45vh] w-[80vw] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] rounded-lg"
      >
        <v-form @submit.prevent="login" class="flex flex-col h-full">
          <h1 class="text-bold text-4xl border-b border-black mb-10 text-center">
            Login
          </h1>
          <div class="space-y-4">
            <v-text-field
              v-model="user.usuario"
              label="Usuário"
              required
              :rules="userRules"
            ></v-text-field>
            <v-text-field
              v-model="user.senha"
              label="Senha"
              type="password"
              required
              :rules="passwordRules"
            ></v-text-field>
          </div>
          <v-btn
            type="submit"
            class="text-white mt-10 !bg-blue-500 hover:!bg-blue-600 w-full"
          >
            Entrar
          </v-btn>
        </v-form>
      </v-sheet>
    </div>
  </section>
</template>

<script lang="ts">
import { ref } from 'vue';
import { AuthRequest } from '../../models/authenticate.model';
import { Service } from '../../api/Service';
import { useRouter } from 'vue-router';
import { userAuthStore } from '../../utils/auth-storage.util';
import { AlertInfo } from "../../models/alert-info.model";
export default {
  setup() {
    const user = ref(new AuthRequest('', ''));
    const showAlert = ref(false);
    const infoAlerts = ref(new AlertInfo());
    const router = useRouter();
    const authStore = userAuthStore();

    const userRules = [
      (value: string) => !!value || 'Nome de usuário é obrigatório.',
    ];

    const passwordRules = [
      (value: string) => !!value || 'Senha é obrigatória.',
    ];

    const login = async (): Promise<void> => {
      try {
        const response = await Service.login(user.value);
        
        if (response.length === 1) {
          authStore.login(response[0]);
          router.push('/');
        } else {
          infoAlerts.value = {
            title: 'Credenciais inválidas',
            description: 'Verifique usuário/senha e tente novamente.',
            severity: 'error',
          };
          showAlert.value = true;
        }
      } catch (error) {
        infoAlerts.value = {
          title: 'Erro de Conexão',
          description: 'Não foi possível conectar ao servidor.',
          severity: 'error',
        };
        showAlert.value = true;
      }
      setTimeout(() => {
        showAlert.value = false;
      }, 3000);
    };

    return {
      login,
      user,
      showAlert,
      infoAlerts,
      userRules,
      passwordRules,
    };
  },
};
</script>
