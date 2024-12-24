<template>
  <section>
    <v-dialog v-model="showDialogFilter">
      <v-card>
        <template v-slot:text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="setDialogFilter">
              <v-icon
                icon="mdi-close-circle"
                color="red"
                size="xx-large"
              ></v-icon>
            </v-btn>
          </v-card-actions>
          <v-form
            @submit.prevent
            class="md:grid md:grid-cols-3 lg:grid-cols-5 gap-3 items-center justify-center h-full"
          >
            <v-text-field
              v-model="filters.nome"
              label="Nome"
              type="text"
              class="md:max-w-[270px]"
            ></v-text-field>
            <v-text-field
              v-model="filters.matricula"
              label="Matrícula"
              type="text"
              class="md:max-w-[270px]"
            ></v-text-field>
            <v-text-field
              v-model.number="filters.idade"
              label="Idade"
              type="number"
              class="md:max-w-[270px]"
            ></v-text-field>
            <v-text-field
              v-model.number="filters.tipo"
              label="Tipo"
              type="number"
              class="md:max-w-[270px]"
            ></v-text-field>
            <v-select
              v-model="filters.cargo"
              label="Cargo"
              :items="positions"
              class="md:max-w-[270px]"
            ></v-select>
          </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="!border !border-blue-600 !text-blue-500 hover:!text-blue-600"
              text="Limpar filtro"
              @click="clearFilter"
            ></v-btn>
            <v-btn
              class="!bg-blue-500 hover:!bg-blue-600 text-white"
              text="Pesquisar"
              @click="filterUsers"
            ></v-btn>
          </v-card-actions>
        </template>
      </v-card>
    </v-dialog>
    <v-btn
      variant="text"
      class="!flex !justify-end !mr-10 !mt-10"
      text="Filtrar"
      @click="setDialogFilter"
    >
      <v-icon icon="mdi-filter" />
    </v-btn>
    <div v-if="usuarios.length > 0">
      <Card
        v-for="user in usuarios"
        :user="user"
        :key="user.matricula"
        @getUsuarios="getUsuarios"
      ></Card>
      <v-pagination
        :length="totalPages"
        v-model="currentPage"
        @update:model-value="changePage"
        rounded="circle"
        class="mb-20"
      ></v-pagination>
    </div>
    <h1 v-else class="text-center">Nenhum usuário encontrado</h1>
    <v-btn
      v-if="isAdmin"
      class="!fixed !right-5 !bottom-5 !h-14 !w-14 bg-white shadow-md rounded-md !text-2xl"
      @click="redirectToRegisterForm"
      text="+"
    >
    </v-btn>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { Service } from "../../api/Service";
import Usuario from "../../models/usuario.model";
import Card from "../../components/Card/index.vue";
import { AlertInfo } from "../../models/alert-info.model";
import { useRouter } from "vue-router";
import { positions } from "../../utils/positions.util";
import { userAuthStore } from "../../utils/auth-storage.util";
export default defineComponent({
  components: {
    Card,
  },
  setup() {
    const showAlert = ref(false);
    const infoAlerts = ref(new AlertInfo());
    const usuarios = ref<Array<Usuario>>([]);
    const showDialogFilter = ref(false);
    const router = useRouter();
    const filters = ref(new Usuario());
    const currentPage = ref(1);
    const totalPages = ref(0);
    const usersPerPage = 10;
    const authStore = userAuthStore();

    const isAdmin = computed(() => {
      return authStore.user?.tipo === 1;
    });
    const getUsuarios = async (): Promise<void> => {
      try {
        const response = await Service.getUsuarios(filters.value);
        const startIndex = (currentPage.value - 1) * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        usuarios.value = response.slice(startIndex, endIndex);
        totalPages.value = Math.ceil(response.length / usersPerPage);
        showDialogFilter.value = false;
      } catch (error) {
        infoAlerts.value = {
          title: "Erro de Conexão",
          description: error as string,
          severity: "error",
        };
        showAlert.value = true;
        setTimeout(() => {
          showAlert.value = false;
        }, 3000);
      }
    };

    const filterUsers = (): void => {
      currentPage.value = 1;
      getUsuarios();
    };
    const redirectToRegisterForm = (): void => {
      router.push("/register");
    };
    const setDialogFilter = (): void => {
      showDialogFilter.value = !showDialogFilter.value;
    };
    const clearFilter = (): void => {
      filters.value = new Usuario();
      currentPage.value = 1;
      getUsuarios();
    };
    const changePage = (page: number): void => {
      currentPage.value = page;
      getUsuarios();
    };

    onMounted(() => {
      getUsuarios();
    });
    return {
      usuarios,
      showDialogFilter,
      filters,
      positions,
      currentPage,
      totalPages,
      isAdmin,
      filterUsers,
      changePage,
      clearFilter,
      setDialogFilter,
      getUsuarios,
      redirectToRegisterForm,
    };
  },
});
</script>
