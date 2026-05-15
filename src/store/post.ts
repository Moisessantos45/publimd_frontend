import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import { useApiResult } from "@/composables/useApiResult";
import {
  initialPost,
  initialPostInfoDetailed,
  type Post,
  type PostInfoBasic,
  type PostInfoDetailed,
  type PostInfoGeneric,
  type PostInfoRecent,
} from "@/entities/post";
import type { StatusGeneric } from "@/entities/state";
import {
  mapperPost,
  mapperPostInfoBasic,
  mapperPostInfoDetailed,
  mapperPostInfoGeneric,
  mapperPostInfoRecent,
  postToJson,
} from "@/helpers/mappers/post";
import { mapperStateGeneric } from "@/helpers/mappers/state";
import { apiAuth } from "@/services/api";
import { initialPaginationState, type Pagination } from "@/entities/pagination";
import { mapperPagination } from "@/helpers/mappers/paginated";

const usePostStore = defineStore("post", () => {
  const { exec, loading, alertMessage } = useApiResult();
  const lock = ref(false);
  const statePost = reactive<StatusGeneric[]>([]);
  const postPublic = reactive<PostInfoBasic[]>([]);
  const postGenerics = reactive<PostInfoGeneric[]>([]);
  const postInfoRecent = reactive<PostInfoRecent[]>([]);
  const postInfoDetailed = reactive<PostInfoDetailed>(
    JSON.parse(JSON.stringify(initialPostInfoDetailed)),
  );
  const paginated = reactive<Pagination>({ ...initialPaginationState });
  const paginatedPostGeneric = reactive<Pagination>({
    ...initialPaginationState,
  });
  const dataForm = reactive<Post>(JSON.parse(JSON.stringify(initialPost)));

  const clearForm = () => {
    Object.assign(dataForm, JSON.parse(JSON.stringify(initialPost)));
  };

  const getStatePost = async () => {
    if (statePost.length > 0) return;
    await exec(() => apiAuth.get("/post/states"), {
      mapper(res) {
        const extractedData = res.data.data ?? [];
        return extractedData.map(mapperStateGeneric);
      },
      onSuccess: (data) => {
        statePost.splice(0, statePost.length, ...data);
      },
      onError: (_) => {},
    });
  };

  const getPostPublic = async (search: string) => {
    await exec(
      () =>
        apiAuth.get("/post/public", {
          params: {
            search,
            pageSize: paginated.pageSize,
            page: paginated.page,
          },
        }),
      {
        mapper(res) {
          if (!res.data.data) {
            throw new Error("Error al obtener los posts públicos.");
          }
          const extractedData = res.data.data.data ?? [];

          return {
            data: extractedData.map(mapperPostInfoBasic),
            pagination: mapperPagination(res.data.data.paginate),
          };
        },
        onSuccess: (data) => {
          postPublic.splice(0, postPublic.length, ...data.data);
          Object.assign(paginated, { ...data.pagination });
        },
        onError: (_) => {},
      },
    );
  };

  const getPostInfoRecent = async () => {
    await exec(() => apiAuth.get("/post/user/recent"), {
      mapper(res) {
        const extractedData = res.data.data ?? [];
        return extractedData.map(mapperPostInfoRecent);
      },
      onSuccess: (data) => {
        postInfoRecent.splice(0, postInfoRecent.length, ...data);
      },
      onError: (_) => {},
    });
  };

  const getPostGenerics = async () => {
    await exec(
      () =>
        apiAuth.get("/post/user", {
          params: {
            pageSize: paginatedPostGeneric.pageSize,
            page: paginatedPostGeneric.page,
          },
        }),
      {
        mapper(res) {
          if (!res.data.data) {
            throw new Error("Error al obtener los posts del usuario.");
          }

          const extractedData = res.data.data.data ?? [];
          return {
            data: extractedData.map(mapperPostInfoGeneric),
            pagination: mapperPagination(res.data.data.paginate),
          };
        },
        onSuccess: (data) => {
          postGenerics.splice(0, postGenerics.length, ...data.data);
          Object.assign(paginatedPostGeneric, { ...data.pagination });
        },
        onError: (_) => {},
      },
    );
  };

  const getPostInfoDetailed = async (slug: string) => {
    return await exec(() => apiAuth.get(`/post/slug/${slug}`), {
      mapper(res) {
        const extractedData = res.data.data ?? null;
        if (!extractedData) {
          throw new Error("Error al obtener el post.");
        }
        return mapperPostInfoDetailed(extractedData);
      },
      onSuccess: (data) => {
        Object.assign(postInfoDetailed, {
          ...JSON.parse(JSON.stringify(initialPostInfoDetailed)),
          ...data,
        });
      },
      onError: (_) => {},
    });
  };

  const getPostBySlug = async (slug: string) => {
    return await exec(() => apiAuth.get(`post/slug-private/${slug}`), {
      mapper(res) {
        const extractedData = res.data.data ?? null;
        if (!extractedData) {
          throw new Error("Error al obtener el post.");
        }
        return mapperPost(extractedData);
      },
      onSuccess: (data) => {
        Object.assign(dataForm, {
          ...JSON.parse(JSON.stringify(initialPost)),
          ...data,
        });
      },
      onError: (_) => {},
    });
  };

  const addPost = async () => {
    return await exec(() => apiAuth.post("/post", postToJson(dataForm)), {
      mapper(res) {
        const extractedData = res.data.data ?? null;
        if (!extractedData) {
          throw new Error("Error al agregar el post.");
        }
        return mapperPost(extractedData);
      },
      onSuccess: (data) => {
        Object.assign(dataForm, {
          ...JSON.parse(JSON.stringify(initialPost)),
          ...data,
        });
      },
      onError: (_) => {},
    });
  };

  const updatePost = async (slug: string) => {
    if (lock.value) return;
    return await exec(
      () => apiAuth.put(`/post/${dataForm.id}`, postToJson(dataForm)),
      {
        mapper(res) {
          const extractedData = res.data.message ?? "";
          if (!extractedData) {
            throw new Error("Error al actualizar el post.");
          }
          return extractedData;
        },
        onSuccess: (_) => {
          getPostInfoDetailed(slug);
        },
        onError: (_) => {},
      },
    );
  };

  const updatePostState = async (
    _: string,
    postId: number,
    stateId: number,
  ) => {
    return await exec(
      () =>
        apiAuth.patch(`/post/${postId}/state`, {
          status: stateId,
        }),
      {
        mapper(res) {
          const extractedData = res.data.message ?? "";
          if (!extractedData) {
            throw new Error("Error al actualizar el estado del post.");
          }
          return extractedData;
        },
        onSuccess: (_) => {
          getPostGenerics();
        },
        onError: (_) => {},
      },
    );
  };

  const updateEmbeddings = async (slug: string) => {
    return await exec(() => apiAuth.patch(`/post/vectorize/${slug}`), {
      mapper(res) {
        const extractedData = res.data.message ?? "";
        if (!extractedData) {
          throw new Error("Error al actualizar las embeddings del post.");
        }
        return extractedData;
      },
      onSuccess: (_) => {
        getPostGenerics();
      },
      onError: (_) => {},
    });
  };

  return {
    lock,
    statePost,
    postPublic,
    postInfoRecent,
    postInfoDetailed,
    postGenerics,
    dataForm,
    paginated,
    paginatedPostGeneric,
    loading,
    alertMessage,
    clearForm,
    getStatePost,
    getPostPublic,
    getPostGenerics,
    getPostInfoRecent,
    getPostInfoDetailed,
    getPostBySlug,
    addPost,
    updatePost,
    updatePostState,
    updateEmbeddings,
  };
});

export default usePostStore;
