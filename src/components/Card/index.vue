<template>
  <v-alert
    v-show="showAlert"
    :title="infoAlerts.title"
    :text="infoAlerts.description"
    :type="infoAlerts.severity"
    class="w-[80vw] max-w-[450px] !h-20 !top-0 mx-5 mt-1 !right-0 !absolute !z-10"
  ></v-alert>

  <v-dialog v-model="showDialogEdit" max-width="480" persistent>
    <v-card class="elevation-3">
      <v-card-title class="text-h6 font-weight-bold text-primary">
        Atualizar usuário
      </v-card-title>
      <v-divider class="my-2"></v-divider>
      <v-card-text>
        <v-form @submit.prevent="hasRegistration" class="flex flex-col h-full">
          <v-text-field
            v-model="userUpdated.nome"
            label="Nome"
            type="text"
            :rules="requiredRules"
          ></v-text-field>
          <v-text-field
            v-model="userUpdated.matricula"
            label="Matrícula"
            type="text"
            :rules="requiredRules"
          ></v-text-field>
          <v-text-field
            v-model.number="userUpdated.idade"
            label="Idade"
            type="number"
            :rules="idadeRules"
          ></v-text-field>
          <v-select
            v-model="userUpdated.cargo"
            label="Cargo"
            :items="positions"
            class="mb-2"
            :rules="requiredRules"
          ></v-select>
          <v-text-field
            v-model.number="userUpdated.tipo"
            label="Tipo"
            type="number"
            :rules="tipoRules"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-flex justify-end pa-3">
        <v-btn
          class="text-capitalize font-weight-bold text-secondary"
          variant="outlined"
          @click="setDialogEdit"
        >
          Cancelar
        </v-btn>
        <v-btn
          class="ml-3 text-capitalize bg-primary text-white font-weight-bold"
          @click="validation"
        >
          Atualizar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showDialogDelete" max-width="480">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold text-primary">
        Confirmação de Exclusão
      </v-card-title>
      <v-card-text class="break-all pa-4 text-body-2">
        Você tem certeza que deseja excluir este usuário? Esta ação não poderá
        ser desfeita.
      </v-card-text>
      <v-card-actions class="d-flex justify-end pa-3">
        <v-btn
          class="text-capitalize font-weight-bold text-secondary"
          variant="outlined"
          @click="setDialogDelete"
        >
          Cancelar
        </v-btn>
        <v-btn
          class="ml-3 bg-error text-white text-capitalize font-weight-bold"
          @click="deleter"
        >
          Confirmar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-container class="mb-10">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card :class="bgCardType">
          <v-card-title class="text-h5 text-center">
            Informações do Usuário
          </v-card-title>
          <v-divider></v-divider>
          <v-list :class="bgCardType">
            <v-list-item>
              <v-list-item-title>Nome</v-list-item-title>
              <v-list-item-subtitle>{{ user.nome }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Matrícula</v-list-item-title>
              <v-list-item-subtitle>{{ user.matricula }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Idade</v-list-item-title>
              <v-list-item-subtitle>{{ user.idade }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Cargo</v-list-item-title>
              <v-list-item-subtitle>{{ user.cargo }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Tipo</v-list-item-title>
              <v-list-item-subtitle>
                {{ user.tipo === 1 ? "Admin" : "Comum" }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <v-card-actions v-if="isAdmin" class="justify-center">
            <v-btn
              class="!bg-blue-500 hover:!bg-blue-600 !text-white"
              @click="setDialogEdit"
              >Editar</v-btn
            >
            <v-btn
              class="!bg-red-500 hover:!bg-red-600 !text-white"
              @click="setDialogDelete"
              >Excluir</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref } from "vue";
import Usuario from "../../models/usuario.model";
import { Service } from "../../api/Service";
import { AlertInfo } from "../../models/alert-info.model";
import { validateFields } from "../../utils/validate.util";
import { positions } from "../../utils/positions.util";
import { userAuthStore } from "../../utils/auth-storage.util";
export default defineComponent({
  emits: ["getUsuarios"],
  props: {
    user: {
      type: Object as PropType<Usuario>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const bgCardType = computed(() => {
      return props.user.tipo === 1 ? "!bg-blue-100" : "!bg-green-100";
    });

    const isAdmin = computed(() => {
      return authStore.user?.tipo === 1;
    });

    const timeOut = (): void => {
      setTimeout(() => {
        showAlert.value = false;
      }, 3000);
    };
    const userUpdated = ref(new Usuario());
    const showDialogDelete = ref(false);
    const showDialogEdit = ref(false);
    const authStore = userAuthStore();
    const showAlert = ref(false);
    const infoAlerts = ref(new AlertInfo());

    const requiredRules = [
      (value: string) => !!value || "Este campo é obrigatório.",
    ];
    const idadeRules = [
      (value: number) => !!value || "Este campo é obrigatório.",
      (value: number) =>
        (value >= 18 && value <= 60) || "A idade deve estar entre 18 e 60.",
    ];
    const tipoRules = [
      (value: number) => !!value || "Este campo é obrigatório.",
      (value: number) =>
        (value > 0 && value < 3) || "Selecione 1 para Admin e 2 para Comum.",
    ];

    const validation = async (): Promise<void> => {
      const isValid = validateFields(userUpdated.value);
      if (!isValid) {
        infoAlerts.value = {
          title: "Erro de validação",
          description: "Por favor, preencha todos os campos corretamente.",
          severity: "error",
        };
        showAlert.value = true;
        timeOut();
        return;
      } else {
        hasRegistration();
      }
    };

    const hasRegistration = async (): Promise<void> => {
      const response = await Service.getUsuarioByRegistration(
        userUpdated.value.matricula as string
      );
      if (response.length === 0 || response[0].id === userUpdated.value.id) {
        update();
      } else {
        infoAlerts.value = {
          title: "Credenciais inválidas",
          description: "Matrícula registrada em outro usuário.",
          severity: "error",
        };
        showAlert.value = true;
      }
      timeOut();
    };

    const setDialogDelete = (): void => {
      showDialogDelete.value = !showDialogDelete.value;
    };

    const setDialogEdit = (): void => {
      userUpdated.value = { ...props.user };
      showDialogEdit.value = !showDialogEdit.value;
    };

    const update = async (): Promise<void> => {
      try {
        const response = await Service.updateUsuario(userUpdated.value);
        if (response) {
          infoAlerts.value = {
            title: "Cadastro atualizado",
            description: "Atualização concluida com sucesso.",
            severity: "success",
          };
          showAlert.value = true;
          emit("getUsuarios");
          setDialogEdit();
        }
      } catch (error) {
        infoAlerts.value = {
          title: "Credenciais inválidas",
          description: error as string,
          severity: "error",
        };
        showAlert.value = true;
      }
      timeOut();
    };
    const deleter = async (): Promise<void> => {
      try {
        const response = await Service.deleteUsuario(props.user.id as string);
        if (response) {
          infoAlerts.value = {
            title: "Usuário excluido",
            description: "Usuário excluido com sucesso.",
            severity: "success",
          };
          showAlert.value = true;
          emit("getUsuarios");
          setDialogDelete();
        }
      } catch (error) {
        infoAlerts.value = {
          title: "Credenciais inválidas",
          description: error as string,
          severity: "error",
        };
        showAlert.value = true;
      }
      timeOut();
    };

    return {
      deleter,
      hasRegistration,
      setDialogDelete,
      setDialogEdit,
      validation,
      isAdmin,
      userUpdated,
      infoAlerts,
      showAlert,
      requiredRules,
      positions,
      idadeRules,
      tipoRules,
      showDialogEdit,
      showDialogDelete,
      bgCardType,
    };
  },
});
</script>
