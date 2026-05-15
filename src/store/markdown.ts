import { defineStore,storeToRefs } from "pinia";
import { ref } from "vue";
import useWebSocketStore from "./webSocket";
import usePostStore from "./post";
import type { TextOp } from "@/entities/message";

const useMarkdownStore = defineStore("markdown", () => {
  const webSocketStore = useWebSocketStore();
    const postStore = usePostStore();
    const { dataForm } = storeToRefs(postStore);

  const editorRef = ref<HTMLTextAreaElement | null>(null);

  const editor = ref("");
  const textareaRef = ref<HTMLTextAreaElement | null>(null);

  const previousValue = ref("");
  const suppressLocalEvent = ref(false);

  function handleBeforeInput(currentText?: string) {
    previousValue.value = currentText !== undefined ? currentText : editor.value;
  }

  function handleInput(slug: string, currentText?: string) {
    if (suppressLocalEvent.value) return;

    const currentValue = currentText !== undefined ? currentText : editor.value;
    const op = getTextOperation(previousValue.value, currentValue);

    if (!op) {
      previousValue.value = currentValue;
      return;
    }

    webSocketStore.sendEdit(
      op.kind === "replace" || op.kind === "insert" ? op.text : "",
      slug,
      op.kind,
      op.index,
      op.kind === "delete" ? op.length : 0,
    );

    previousValue.value = currentValue;
  }

  function getTextOperation(oldText: string, newText: string): TextOp | null {
    if (oldText === newText) return null;

    let start = 0;
    while (
      start < oldText.length &&
      start < newText.length &&
      oldText[start] === newText[start]
    ) {
      start++;
    }

    let oldEnd = oldText.length - 1;
    let newEnd = newText.length - 1;

    while (
      oldEnd >= start &&
      newEnd >= start &&
      oldText[oldEnd] === newText[newEnd]
    ) {
      oldEnd--;
      newEnd--;
    }

    const deletedText = oldText.slice(start, oldEnd + 1);
    const insertedText = newText.slice(start, newEnd + 1);

    if (deletedText.length > 0 && insertedText.length === 0) {
      return {
        kind: "delete",
        index: start,
        length: deletedText.length,
      };
    }

    if (insertedText.length > 0 && deletedText.length === 0) {
      return {
        kind: "insert",
        index: start,
        text: insertedText,
      };
    }

    return {
      kind: "replace",
      index: start,
      length: deletedText.length,
      text: insertedText,
    };
  }

  function applyRemoteOperation(op: TextOp) {
    if (!textareaRef.value) return;
    if (suppressLocalEvent.value) return;
    suppressLocalEvent.value = true;

    const textarea = textareaRef.value;
    const selStart = textarea.selectionStart;
    const selEnd = textarea.selectionEnd;
    const value = textarea.value;

    let newValue = value;

    if (op.kind === "insert") {
      newValue = value.slice(0, op.index) + op.text + value.slice(op.index);

      const delta = op.text.length;
      textarea.value = newValue;
      textarea.selectionStart = transformCursor(selStart, op.index, 0, delta);
      textarea.selectionEnd = transformCursor(selEnd, op.index, 0, delta);
    }

    if (op.kind === "delete") {
      newValue = value.slice(0, op.index) + value.slice(op.index + op.length);

      const delta = -op.length;
      textarea.value = newValue;
      textarea.selectionStart = transformCursor(selStart, op.index, op.length, delta);
      textarea.selectionEnd = transformCursor(selEnd, op.index, op.length, delta);
    }

    if (op.kind === "replace") {
      newValue = value.slice(0, op.index) + op.text + value.slice(op.index + op.length);

      const delta = op.text.length - op.length;
      textarea.value = newValue;
      textarea.selectionStart = transformCursor(selStart, op.index, op.length, delta);
      textarea.selectionEnd = transformCursor(selEnd, op.index, op.length, delta);
    }

    dataForm.value.content = newValue;
    previousValue.value = newValue;
    editor.value = newValue;

    textarea.dispatchEvent(new Event("input", { bubbles: true }));

    suppressLocalEvent.value = false;
  }

  function transformCursor(
    cursor: number,
    opIndex: number,
    removedLength: number,
    delta: number,
  ) {
    const opEnd = opIndex + removedLength;

    if (cursor <= opIndex) return cursor;
    if (cursor >= opEnd) return cursor + delta;
    return opIndex;
  }

  return {
    editorRef,
    editor,
    textareaRef,
    previousValue,
    handleBeforeInput,
    handleInput,
    applyRemoteOperation,
  };
});

export default useMarkdownStore;
