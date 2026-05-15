import { ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import useAuthStore from "./auth";
import { mapperOutgoingMessage } from "@/helpers/mappers/message";

export const useWebSocketStore = defineStore("webSocket", () => {
  const authStore = useAuthStore();

  const { token } = storeToRefs(authStore);
  const ws = ref<WebSocket | null>(null);
  const isConnected = ref(false);
  const error = ref<string | null>(null);
  //const url = ref(import.meta.env.VITE_API_WS);

  const currentVersion = ref<number>(0);

  function buildWsUrl() {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host}/api/v1/ws/editor`;
  }

  function connect(slug: string) {
    if (ws.value) {
      ws.value.close();
    }

    ws.value = new WebSocket(buildWsUrl());

    ws.value.onopen = () => {
      isConnected.value = true;
      error.value = null;
      if (token.value && ws.value) {
        ws.value.send(
          JSON.stringify({
            type: "auth",
            token: token.value,
          }),
        );
      }
    };

    ws.value.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        const msg = mapperOutgoingMessage(data);

        switch (msg.type) {
          case "auth_ok":
            ws.value?.send(
              JSON.stringify({
                type: "join_post",
                postId: slug,
              }),
            );
            break;

          case "join_ok":
            if (msg.version !== undefined) currentVersion.value = msg.version;
            break;

          case "save_ok":
            if (msg.version !== undefined) currentVersion.value = msg.version;
            break;

          case "post_saved":
            if (msg.version !== undefined) currentVersion.value = msg.version;
            break;

          case "post_edited": {
            if (msg.version !== undefined) currentVersion.value = msg.version;
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { default: useMarkdownStore } = await import("./markdown");
            const markdownStore = useMarkdownStore();

            let op = null;
            if (msg.kind === "insert") {
              op = {
                kind: "insert",
                index: msg.position || 0,
                text: msg.content || "",
              };
            } else if (msg.kind === "delete") {
              op = {
                kind: "delete",
                index: msg.position || 0,
                length: msg.length || 0,
              };
            } else if (msg.kind === "replace") {
              op = {
                kind: "replace",
                index: msg.position || 0,
                length: msg.length || 0,
                text: msg.content || "",
              };
            }

            if (op) {
              markdownStore.applyRemoteOperation(op as any);
            }
            break;
          }

          case "saving_in_progress":
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { default: usePostStore } = await import("./post");
            const markdownStore = usePostStore();
            markdownStore.lock = true;
            break;

          case "save_finished":
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { default: usePostStore2 } = await import("./post");
            const postStore = usePostStore2();
            postStore.lock = false;
            break;

          case "conflict":
            if (msg.version !== undefined) currentVersion.value = msg.version;
            break;

          case "refresh_ok":
            break;

          case "update_permissions_ok":
            break;

          case "error":
            error.value = msg.message;
            break;

          default:
            break;
        }
      } catch (err) {
        //console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.value.onerror = (_) => {
      error.value = "WebSocket error";
      //console.error("WebSocket error:", event);
    };

    ws.value.onclose = () => {
      isConnected.value = false;
      //console.log("WebSocket connection closed");
    };
  }

  function sendEdit(
    content: string,
    slug: string,
    kind: string,
    position?: number,
    length?: number,
  ) {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
      //console.error("WebSocket is not connected");
      return;
    }

    ws.value.send(
      JSON.stringify({
        type: "edit",
        postId: slug,
        content,
        kind,
        clientVersion: currentVersion.value,
        position,
        length,
      }),
    );
  }

  function save(content: string, slug: string) {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
      //console.error("WebSocket is not connected");
      return;
    }

    ws.value.send(
      JSON.stringify({
        type: "save",
        postId: slug,
        content,
        clientVersion: currentVersion.value,
      }),
    );
  }

  function lockSave(slug: string) {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return;
    ws.value.send(
      JSON.stringify({
        type: "lock_save",
        postId: slug,
      }),
    );
  }

  function unlockSave(slug: string) {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return;
    ws.value.send(
      JSON.stringify({
        type: "unlock_save",
        postId: slug,
      }),
    );
  }

  function refreshToken() {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return;
    if (token.value) {
      ws.value.send(
        JSON.stringify({
          type: "refresh_auth",
          token: token.value,
        }),
      );
    }
  }

  function refresh(slug: string) {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return;
    ws.value.send(
      JSON.stringify({
        type: "refresh",
        postId: slug,
      }),
    );
  }

  function updatePermissions(slug: string) {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return;
    ws.value.send(
      JSON.stringify({
        type: "update_permissions",
        postId: slug,
      }),
    );
  }

  function close() {
    if (ws.value) {
      ws.value.close();
    }
  }

  return {
    isConnected,
    error,
    currentVersion,
    connect,
    sendEdit,
    save,
    lockSave,
    unlockSave,
    refresh,
    refreshToken,
    updatePermissions,
    close,
  };
});

export default useWebSocketStore;
