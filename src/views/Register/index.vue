<template>
  <section class="h-screen mt- bg-[#f8f9fa] text-[#212529] relative">
    <v-alert
      v-show="showAlert"
      :title="infoAlerts.title"
      :text="infoAlerts.description"
      :type="infoAlerts.severity"
      class="w-[80vw] max-w-[450px] !h-20 !top-0 mx-5 !right-0 !absolute !z-10"
    ></v-alert>
    <div class="!flex pt-10 !flex-col !justify-between">
      <v-sheet
        class="!my-auto p-5 mx-auto bg-[#e9ecef] w-[80vw] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] rounded-lg"
      >
        <v-form @submit.prevent="validation" class="flex flex-col h-full">
          <h1 class="text-bold text-4xl border-b border-black mb-10 text-center">
            Registro de usuário
          </h1>
          <v-text-field
            v-model="user.nome"
            label="Nome"
            type="text"
            :rules="requiredRules"
          ></v-text-field>
          <v-text-field
            v-model="user.matricula"
            label="Matrícula"
            type="text"
            :rules="requiredRules"
          ></v-text-field>
          <v-text-field
            v-model.number="user.idade"
            label="Idade"
            type="number"
            :rules="idadeRules"
          ></v-text-field>
          <v-select
            v-model="user.cargo"
            label="Cargo"
            :items="positions"
            class="mb-2"
            :rules="requiredRules"
          ></v-select>
          <v-text-field
            v-model.number="user.tipo"
            label="Tipo"
            type="number"
            :rules="tipoRules"
          ></v-text-field>
          <v-btn
            type="submit"
            class="mt-10 text-white !bg-blue-500 hover:!bg-blue-600 w-full"
          >
            Registrar
          </v-btn>
        </v-form>
      </v-sheet>
    </div>
  </section>
</template>

<script lang="ts">
import { ref } from 'vue';
import { Service } from '../../api/Service';
import { AlertInfo } from "../../models/alert-info.model";
import Usuario from '../../models/usuario.model';
import { VNumberInput } from 'vuetify/labs/VNumberInput';
import { validateFields } from '../../utils/validate.util';
import { positions } from '../../utils/positions.util';

export default {
  components: {
    VNumberInput,
  },
  setup() {
    const user = ref(new Usuario());
    const showAlert = ref(false);
    const infoAlerts = ref(new AlertInfo());

    const requiredRules = [
      (value: string) => !!value || 'Este campo é obrigatório.',
    ];
    const idadeRules = [
      (value: number) => !!value || 'Este campo é obrigatório.',
      (value: number) =>
        (value >= 18 && value <= 60) || 'A idade deve estar entre 18 e 60.',
    ];
    const tipoRules = [
      (value: number) => !!value || 'Este campo é obrigatório.',
      (value: number) =>
        (value > 0 && value < 3) || 'Selecione 1 para Admin e 2 para Comum.',
    ];

    const validation = async (): Promise<void> => {
      const isValid = validateFields(user.value);
      if (!isValid) {
        infoAlerts.value = {
          title: 'Erro de validação',
          description: 'Por favor, preencha todos os campos corretamente.',
          severity: 'error',
        };
        showAlert.value = true;
        setTimeout(() => {
          showAlert.value = false;
        }, 3000);
        return;
      } else {
        await hasRegistration();
      }
    };

    const hasRegistration = async (): Promise<void> => {
      const response = await Service.getUsuarioByRegistration(
        user.value.matricula as string
      );
      if (response.length === 0) {
        await register();
      } else {
        infoAlerts.value = {
          title: 'Credenciais inválidas',
          description: 'Matrícula registrada em outro usuário.',
          severity: 'error',
        };
        showAlert.value = true;
        setTimeout(() => {
          showAlert.value = false;
        }, 3000);
      }
    };

    const register = async (): Promise<void> => {
      try {
        const response = await Service.createUsuario(user.value);
        if (response) {
          infoAlerts.value = {
            title: 'Cadastro realizado',
            description: 'Usuário cadastrado com sucesso.',
            severity: 'success',
          };
          showAlert.value = true;
          user.value = new Usuario();
        }
      } catch (error) {
        infoAlerts.value = {
          title: 'Erro',
          description: 'Erro ao tentar cadastrar o usuário.',
          severity: 'error',
        };
        showAlert.value = true;
      }
      setTimeout(() => {
        showAlert.value = false;
      }, 3000);
    };

    return {
      user,
      showAlert,
      infoAlerts,
      positions,
      requiredRules,
      idadeRules,
      tipoRules,
      validation,
    };
  },
};
</script>
