import { useApiResult } from "@/composables/useApiResult";
import { defineStore } from "pinia";
import { reactive } from "vue";
import {
  initialUserDashboardMetrics,
  initialUserState,
  type User,
  type UserDashboardMetrics,
} from "@/entities/user";
import { apiAuth } from "@/services/api";
import {
  mapperUser,
  mapperUserDashboardMetrics,
  userToJson,
} from "@/helpers/mappers/user";
import useAuthStore from "./auth";

const useUserStore = defineStore("user", () => {
  const { exec, loading } = useApiResult();
  const authStore = useAuthStore();
  const dataForm = reactive<User>({ ...initialUserState });
  const userDashboardMetrics = reactive<UserDashboardMetrics>({
    ...initialUserDashboardMetrics,
  });

  const getUserDashboardMetrics = async () => {
    return await exec(() => apiAuth.get("/user/dashboard-metrics"), {
      mapper(res) {
        const extractedData = res.data.data ?? null;
        if (!extractedData) {
          throw new Error(
            "Error al obtener las métricas del dashboard. Por favor, intenta de nuevo.",
          );
        }
        return mapperUserDashboardMetrics(extractedData);
      },
      onSuccess: (data) => {
        Object.assign(userDashboardMetrics, data);
      },
      onError: (_) => {},
    });
  };

  const getUser = async () => {
    return await exec(() => apiAuth.get("/user"), {
      mapper(res) {
        const extractedData = res.data.data ?? null;
        if (!extractedData) {
          throw new Error(
            "Error al obtener el usuario. Por favor, intenta de nuevo.",
          );
        }
        return mapperUser(extractedData);
      },
      onSuccess: (data) => {
        Object.assign(dataForm, data);
      },
      onError: (_) => {},
    });
  };

  const addUser = async () => {
    return await exec(() => apiAuth.post("/user", userToJson(dataForm)), {
      mapper(res) {
        const extractedData = res.data.data ?? null;
        if (!extractedData) {
          throw new Error(
            "Error al iniciar sesión. Por favor, intenta de nuevo.",
          );
        }
        return mapperUser(extractedData);
      },
      onSuccess: (data) => {
        Object.assign(dataForm, data);
        authStore.getSession();
      },
      onError: (_) => {},
    });
  };

  const updateUser = async () => {
    return await exec(() => apiAuth.put("/user", userToJson(dataForm)), {
      mapper(res) {
        const extractedData = res.data.message ?? "";
        if (!extractedData) {
          throw new Error(
            "Error al actualizar el usuario. Por favor, intenta de nuevo.",
          );
        }
        return extractedData;
      },
      onSuccess: () => {
        getUser();
      },
      onError: (_) => {},
    });
  };

  return {
    dataForm,
    loading,
    userDashboardMetrics,
    getUserDashboardMetrics,
    getUser,
    addUser,
    updateUser,
  };
});

export default useUserStore;
