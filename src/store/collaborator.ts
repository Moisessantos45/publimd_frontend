import { useApiResult } from "@/composables/useApiResult";
import {
  initialCollaboratorInviteRequest,
  initPostCollaboratorsData,
  type CollaboratorInviteRequest,
  type PostCollaboratorsData,
} from "@/entities/collaborator";
import type { StatusGeneric } from "@/entities/state";
import type { UserBasicInfo } from "@/entities/user";
import {
  mapperCollaboratorInviteRequest,
  mapperPostCollaboratorsData,
} from "@/helpers/mappers/collaborator";
import { mapperStateGeneric } from "@/helpers/mappers/state";
import { apiAuth } from "@/services/api";
import { defineStore } from "pinia";
import { reactive } from "vue";

const useCollaboratorStore = defineStore("collaborator", () => {
  const { exec, loading, alertMessage } = useApiResult();
  const postCollaborators = reactive<PostCollaboratorsData>({
    ...initPostCollaboratorsData,
  });
  const permissionsCollaborators = reactive<StatusGeneric[]>([]);
  const collaboratorsBasicInfo = reactive<UserBasicInfo[]>([]);
  const dataForm = reactive<CollaboratorInviteRequest>({
    ...initialCollaboratorInviteRequest,
  });

  const clearForm = () => {
    Object.assign(dataForm, { ...initialCollaboratorInviteRequest });
  };

  const getPermissionsCollaborators = async (slug: string) => {
    await exec(() => apiAuth.get(`/collaborator/permissions/${slug}`), {
      mapper(res) {
        const extractedData = res.data.data ?? [];
        return extractedData.map(mapperStateGeneric);
      },
      onSuccess: (data) => {
        permissionsCollaborators.splice(
          0,
          permissionsCollaborators.length,
          ...data,
        );
      },
      onError: (_) => {},
    });
  };

  const getCollaborators = async (slug: string) => {
    await exec(() => apiAuth.get(`/collaborator/users/${slug}`), {
      mapper(res) {
        const extractedData = res.data.data ?? [];
        return mapperPostCollaboratorsData(extractedData);
      },
      onSuccess: (data) => {
        Object.assign(postCollaborators, {
          ...postCollaborators,
          ...data,
        });
      },
      onError: (_) => {},
    });
  };

  const getCollaboratorsBasicInfo = async (slug: string) => {
    await exec(() => apiAuth.get(`/collaborator/user-info/${slug}`), {
      mapper(res) {
        const extractedData = res.data.data ?? [];
        return extractedData.map((item: any) => ({
          userId: item.user_id,
          avatar: item.avatar,
        }));
      },
      onSuccess: (data) => {
        collaboratorsBasicInfo.splice(
          0,
          collaboratorsBasicInfo.length,
          ...data,
        );
      },
      onError: (_) => {},
    });
  };

  const getCollaboratorByEmail = async (email: string, slug: string) => {
    return await exec(
      () => apiAuth.get(`/collaborator/invite/${slug}?email=${email}`),
      {
        mapper(res) {
          const extractedData = res.data.data ?? null;
          if (!extractedData) {
            throw new Error("Error al obtener el colaborador por email.");
          }

          return mapperCollaboratorInviteRequest(extractedData);
        },
        onSuccess: (data) => {
          Object.assign(dataForm, {
            ...data,
          });
        },
        onError: (_) => {},
      },
    );
  };

  const addCollaborator = async (
    slug: string,
    userId: number,
    permissionId: number,
  ) => {
    return await exec(
      () =>
        apiAuth.post(`/collaborator/${slug}`, {
          target_user_id: userId,
          permission_id: permissionId,
        }),
      {
        mapper(res) {
          const extractedData = res.data.message ?? "";
          if (!extractedData) {
            throw new Error("Error al agregar el post.");
          }
          return extractedData;
        },
        onSuccess: (_) => {
          getCollaborators(slug);
        },
        onError: (_) => {},
      },
    );
  };

  const updateCollaborator = async (
    slug: string,
    userId: number,
    permissionId: number,
  ) => {
    return await exec(
      () =>
        apiAuth.put(`/collaborator/${slug}`, {
          target_user_id: userId,
          permission_id: permissionId,
        }),
      {
        mapper(res) {
          const extractedData = res.data.message ?? "";
          if (!extractedData) {
            throw new Error("Error al actualizar el post.");
          }
          return extractedData;
        },
        onSuccess: (_) => {
          Object.assign(postCollaborators, {
            ...postCollaborators,
            collaborators: postCollaborators.collaborators.map(
              (collaborator) =>
                collaborator.userId === userId
                  ? {
                      ...collaborator,
                      permissionId: permissionId ?? collaborator.permissionId,
                    }
                  : collaborator,
            ),
          });
        },
        onError: (_) => {},
      },
    );
  };

  const deleteCollaborator = async (slug: string, userId: number) => {
    return await exec(() => apiAuth.delete(`/collaborator/${slug}/${userId}`), {
      mapper(res) {
        const extractedData = res.data.message ?? "";
        if (!extractedData) {
          throw new Error("Error al eliminar el colaborador.");
        }

        return extractedData;
      },
      onSuccess: () => {
        Object.assign(postCollaborators, {
          ...postCollaborators,
          collaborators: postCollaborators.collaborators.filter(
            (collaborator) => collaborator.userId !== userId,
          ),
        });
      },
      onError: (_) => {},
    });
  };

  const confirmInvitation = async (token: string) => {
    return await exec(() => apiAuth.post(`/collaborator/confirm/${token}`), {
      mapper(res) {
        const extractedData = res.data.message ?? "";
        if (!extractedData) {
          throw new Error("Error al confirmar la invitación.");
        }
        return extractedData;
      },
      onSuccess: (_) => {},
      onError: (_) => {},
    });
  };

  const resendInvitation = async (slug: string, userId: number) => {
    return await exec(
      () =>
        apiAuth.post(`/collaborator/resend/${slug}`, {
          target_user_id: userId,
        }),
      {
        mapper(res) {
          const extractedData = res.data.message ?? "";
          if (!extractedData) {
            throw new Error("Error al reenviar la invitación.");
          }
          return extractedData;
        },
        onSuccess: (_) => {},
        onError: (_) => {},
      },
    );
  };

  return {
    postCollaborators,
    permissionsCollaborators,
    collaboratorsBasicInfo,
    dataForm,
    alertMessage,
    loading,
    getPermissionsCollaborators,
    getCollaboratorsBasicInfo,
    getCollaboratorByEmail,
    getCollaborators,
    addCollaborator,
    updateCollaborator,
    deleteCollaborator,
    confirmInvitation,
    resendInvitation,
    clearForm,
  };
});

export { useCollaboratorStore };
