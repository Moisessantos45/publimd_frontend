import { ref } from "vue";
import { defineStore } from "pinia";
import type { AlertState } from "@/entities/alertState";
import { apiAuth } from "@/services/api";
import { type Auth, initialAuthState } from "@/entities/auth";
import { authMapper } from "@/helpers/mappers/auth";
import { useApiResult } from "@/composables/useApiResult";

type LoginFlowResult =
  | { status: "AUTHENTICATED"; token: string }
  | { status: "PENDING_2FA" };

const useAuthStore = defineStore("auth", () => {
  const { exec, loading } = useApiResult();
  const authenticated = ref(false);
  const alertMessage = ref<AlertState>({ error: false, msg: "" });
  const authData = ref<Auth>({ ...initialAuthState });
  const accountNotVerified = ref(false);
  const requiresTwoFactor = ref(false);
  const totpData = ref({ uri: "", secret: "" });
  const email = ref("");
  const password = ref("");
  const token = ref("");
  const suppressAutoRefresh = ref(false);
  let sessionRequest: Promise<void> | null = null;

  const setAuthenticated = (value: boolean) => {
    authenticated.value = value;
  };

  const setAlertMessage = (message: AlertState) => {
    alertMessage.value = message;

    setTimeout(() => {
      alertMessage.value = { error: false, msg: "" };
    }, 5000);
  };

  const getToken = () => {
    return token.value || authData.value.token || "";
  };

  const setToken = (newToken: string) => {
    token.value = newToken;
    authData.value.token = newToken;
    suppressAutoRefresh.value = false;
  };

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const clearAlert = () => {
    setTimeout(() => {
      alertMessage.value = { error: false, msg: "" };
    }, 5000);
  };

  const getRefreshToken = async () => {
    let refreshedToken = "";
    await exec(
      () =>
        apiAuth.post(
          "/auth/refresh-token",
          {},
          {
            withCredentials: true,
          },
        ),
      {
        mapper: (res) => {
          const extractedData = res.data.data ?? null;
          if (!extractedData || !extractedData.token) {
            throw new Error(
              "Error al refrescar el token. Por favor, intenta de nuevo.",
            );
          }

          return extractedData.token.toString() ?? "";
        },
        onSuccess: (mappedData) => {
          authData.value.token = mappedData;
          token.value = mappedData;
          refreshedToken = mappedData;
        },
        onError: (_) => {
          authenticated.value = false;
        },
      },
    );

    if (!refreshedToken) {
      throw new Error("No se pudo obtener un nuevo token");
    }

    return refreshedToken;
  };

  const getSession = async () => {
    if (sessionRequest) return sessionRequest;

    sessionRequest = (async () => {
      if (suppressAutoRefresh.value && !getToken()) {
        return;
      }

      if (!getToken()) {
        try {
          await getRefreshToken();
        } catch {
          clearAuthData();
          return;
        }
      }

      await exec(() => apiAuth.get("/auth/session"), {
        mapper: (res) => {
          const extractedData = res.data.data ?? null;
          return extractedData ? authMapper(extractedData) : null;
        },
        onSuccess: (mappedData) => {
          if (mappedData) {
            authData.value = mappedData;
            authenticated.value = true;
          } else {
            authenticated.value = false;
          }
        },
      });
    })();

    try {
      await sessionRequest;
    } finally {
      sessionRequest = null;
    }
  };

  const register = async (email: string, password: string) => {
    await exec(() => apiAuth.post("/auth/register", { email, password }), {
      mapper: (res) => res.data.message ?? "Registro exitoso...",
      onSuccess: (msg) => {
        alertMessage.value = { error: false, msg };
      },
      onError: (errorMsg) => {
        alertMessage.value = { error: true, msg: errorMsg.msg };
      },
    });
    clearAlert();
  };

  const forwardEmailVerification = async (email: string) => {
    await exec(
      () =>
        apiAuth.post("/auth/forward-email-verification", {
          email,
        }),
      {
        mapper: (res) =>
          res.data.message ?? "Correo de verificación reenviado...",
        onSuccess: (msg) => {
          alertMessage.value = { error: false, msg };
        },
        onError: (errorMsg) => {
          alertMessage.value = { error: true, msg: errorMsg.msg };
        },
      },
    );

    clearAlert();
  };

  const verifyAccount = async (token: string) => {
    await exec(
      () =>
        apiAuth.get(`/auth/confirm-account`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      {
        mapper: (res) =>
          res.data.message ?? "Cuenta verificada exitosamente...",
        onSuccess: (msg) => {
          alertMessage.value = { error: false, msg };
        },
        onError: (errorMsg) => {
          alertMessage.value = { error: true, msg: errorMsg.msg };
        },
      },
    );

    clearAlert();
  };

  const generateTwoFactor = async () => {
    return await exec(() => apiAuth.patch("/auth/enable-two-factor"), {
      mapper: (res) => {
        const extractedData = res.data.data ?? null;
        if (!extractedData || !extractedData.uri || !extractedData.secret) {
          throw new Error(
            "Error al generar datos de autenticación de dos factores. Por favor, intenta de nuevo.",
          );
        }
        return {
          uri: extractedData.uri.toString(),
          secret: extractedData.secret.toString(),
        };
      },
      onSuccess: (data) => {
        totpData.value.uri = data.uri;
        totpData.value.secret = data.secret;
      },
      onError: (errorMsg) => {
        alertMessage.value = { error: true, msg: errorMsg.msg };
      },
    });
  };

  const verifyTwoFactor = async (code: string) => {
    return await exec(
      () => apiAuth.post("/auth/verify-two-factor", { code: code.toString() }),
      {
        mapper: (res) =>
          res.data.message ??
          "Autenticación de dos factores verificada exitosamente.",
        onSuccess: (msg) => {
          alertMessage.value = { error: false, msg };
        },
        onError: (errorMsg) => {
          alertMessage.value = { error: true, msg: errorMsg.msg };
        },
      },
    );
  };

  const login = async (email: string, password: string) => {
    accountNotVerified.value = false;
    requiresTwoFactor.value = false;

    return await exec(() => apiAuth.post("/auth/login", { email, password }), {
      mapper: (res) => {
        const isPendingTwoFactor =
          res.status === 202 && res.data?.code === "PENDING_2FA";

        if (isPendingTwoFactor) {
          return { status: "PENDING_2FA" } as LoginFlowResult;
        }

        const extractedData = res.data?.data ?? null;
        const accessToken = extractedData?.token?.toString() ?? "";

        if (!accessToken) {
          throw new Error(
            "Error al iniciar sesión. Por favor, intenta de nuevo.",
          );
        }

        return {
          status: "AUTHENTICATED",
          token: accessToken,
        } as LoginFlowResult;
      },
      onSuccess: (mappedData) => {
        if (mappedData.status === "PENDING_2FA") {
          clearAuthData();
          requiresTwoFactor.value = true;
          alertMessage.value = {
            error: false,
            msg: "Verificación 2FA pendiente.",
          };
          return;
        }

        setToken(mappedData.token);
        authenticated.value = true;
        suppressAutoRefresh.value = false;
        requiresTwoFactor.value = false;
        alertMessage.value = {
          error: false,
          msg: "Inicio de sesión exitoso.",
        };
      },
      onError: (errorMsg) => {
        alertMessage.value = {
          error: true,
          msg:
            errorMsg.status === 403 && errorMsg.code === "EMAIL_NOT_VERIFIED"
              ? "EMAIL_NOT_VERIFIED"
              : errorMsg.msg,
        };
        accountNotVerified.value =
          errorMsg.status === 403 && errorMsg.code === "EMAIL_NOT_VERIFIED";
        requiresTwoFactor.value = false;
      },
    });
  };

  const verifyLoginTwoFactor = async (code: string) => {
    return await exec(() => apiAuth.post("/auth/2fa/verify", { code }), {
      mapper: (res) => {
        const extractedData = res.data?.data ?? null;
        const accessToken = extractedData?.token?.toString() ?? "";

        if (!accessToken) {
          throw new Error(
            "Error al verificar el código 2FA. Por favor, intenta de nuevo.",
          );
        }

        return accessToken;
      },
      onSuccess: (accessToken) => {
        setToken(accessToken);
        authenticated.value = true;
        suppressAutoRefresh.value = false;
        requiresTwoFactor.value = false;
        alertMessage.value = {
          error: false,
          msg: "Código 2FA verificado correctamente.",
        };
      },
      onError: (errorMsg) => {
        alertMessage.value = { error: true, msg: errorMsg.msg };
      },
    });
  };

  const disableTwoFactor = async () => {
    return await exec(() => apiAuth.patch("/auth/disable-two-factor"), {
      mapper: (res) =>
        res.data.message ?? "Autenticación de dos factores deshabilitada.",
      onSuccess: (msg) => {
        alertMessage.value = { error: false, msg };
        totpData.value = { uri: "", secret: "" };
      },
      onError: (errorMsg) => {
        alertMessage.value = { error: true, msg: errorMsg.msg };
      },
    });
  };

  const logout = async () => {
    await exec(
      () =>
        apiAuth.post("/auth/logout", null, {
          withCredentials: true,
        }),
      {
        mapper: () => "Logout exitoso.",
        onSuccess: (_) => {
          suppressAutoRefresh.value = true;
          clearAuthData();
        },
        onError: (_) => {
          alertMessage.value = {
            error: true,
            msg: "Hubo un error al cerrar sesión. Por favor, inténtalo de nuevo.",
          };
        },
      },
    );

    clearAlert();
  };

  const forgotPassword = async (email: string) => {
    return await exec(() => apiAuth.post("/auth/forgot-password", { email }), {
      mapper: (res) =>
        res.data.message ??
        "Se ha enviado un correo con un enlace para restablecer tu contraseña.",
      onSuccess: (msg) => {
        alertMessage.value = { error: false, msg };
      },
      onError: (errorMsg) => {
        alertMessage.value = { error: true, msg: errorMsg.msg };
      },
    });
  };

  const resetPassword = async (token: string, newPassword: string) => {
    return await exec(
      () =>
        apiAuth.patch(
          "/auth/reset-password",
          { new_password: newPassword },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
      {
        mapper: (res) =>
          res.data.message ??
          "Contraseña restablecida exitosamente. Ahora puedes iniciar sesión.",
        onSuccess: (msg) => {
          alertMessage.value = { error: false, msg };
        },
        onError: (errorMsg) => {
          alertMessage.value = { error: true, msg: errorMsg.msg };
        },
      },
    );
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    return await exec(
      () =>
        apiAuth.patch("/auth/change-password", {
          current_password: currentPassword,
          new_password: newPassword,
        }),
      {
        mapper: (res) =>
          res.data.message ?? "Contraseña actualizada exitosamente.",
        onSuccess: (msg) => {
          alertMessage.value = { error: false, msg };
        },
        onError: (errorMsg) => {
          alertMessage.value = { error: true, msg: errorMsg.msg };
        },
      },
    );
  };

  const clearAuthData = () => {
    authData.value = { ...initialAuthState };
    authenticated.value = false;
    token.value = "";
    requiresTwoFactor.value = false;
    accountNotVerified.value = false;
  };

  return {
    authData,
    loading,
    accountNotVerified,
    requiresTwoFactor,
    totpData,
    alertMessage,
    authenticated,
    token,
    email,
    password,
    setAuthenticated,
    setAlertMessage,
    setToken,
    getToken,
    getSession,
    getHeaders,
    getRefreshToken,
    register,
    forwardEmailVerification,
    verifyAccount,
    generateTwoFactor,
    verifyTwoFactor,
    verifyLoginTwoFactor,
    disableTwoFactor,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword,
    clearAuthData,
  };
});

export default useAuthStore;
