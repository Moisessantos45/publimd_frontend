import type { AlertState } from "@/entities/alertState";
import ErrorHandler from "@/services/errorHandler";
import Result from "@/services/result";
import { ref } from "vue";

interface ApiError {
  msg: string;
  code?: string | number;
  status?: number;
}

export const useApiResult = () => {
  const loading = ref(false);
  const alertMessage = ref<AlertState>({ error: false, msg: "" });

  const setAlert = (params: { error: boolean; msg: string }) => {
    alertMessage.value = { error: params.error, msg: params.msg };

    setTimeout(() => {
      alertMessage.value = { error: false, msg: "" };
    }, 5000);
  };

  const clearAlert = () => {
    setTimeout(() => {
      alertMessage.value = { error: false, msg: "" };
    }, 5000);
  };

  async function apiCall<T, U>(
    apiFn: () => Promise<U>,
    mapper: (data: U) => T,
  ): Promise<Result<T, ApiError>> {
    try {
      const response = await apiFn();
      return Result.ok(mapper(response));
    } catch (error) {
      const { msg, code, status } = ErrorHandler(error);
      return Result.fail({ msg, code, status });
    }
  }

  const exec = async <T, U>(
    apiFn: () => Promise<U>,
    options: {
      mapper: (data: U) => T;
      getCache?: () => T | null;
      onSuccess?: (data: T) => void;
      onError?: (error: ApiError) => void;
    },
  ): Promise<Result<T, ApiError>> => {
    const cachedData = options.getCache?.();
    if (cachedData != null) return Result.ok(cachedData);

    loading.value = true;

    try {
      const result = await apiCall(apiFn, options.mapper);

      result.match({
        success: (data) => {
          options.onSuccess?.(data);
        },
        error: (errorObj) => {
          setAlert({ error: true, msg: errorObj.msg });
          options.onError?.(errorObj);
        },
      });

      return result;
    } finally {
      loading.value = false;
    }
  };

  return {
    exec,
    loading,
    alertMessage,
     setAlert,
     clearAlert,
  };
};
