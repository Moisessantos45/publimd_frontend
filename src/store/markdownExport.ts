import { ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import html2canvas from "html2canvas-pro";
import { COLOR_ATTRS, INLINE_PROPS } from "@/utils/colors";
import usePostStore from "./post";

const useMarkdownExportStore = defineStore("markdownExport", () => {
  const postStore = usePostStore();
  const {dataForm} = storeToRefs(postStore);

  const previewRef = ref<HTMLDivElement | null>(null);

  const downloadMarkdown = () => {
    const contentValue = dataForm.value.content || "";
    const blob = new Blob([contentValue], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "document.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const OKLCH_REGEX = /oklch\([^)]*\)/gi;
  let oklchCtx: CanvasRenderingContext2D | null = null;

  const normalizeOklch = (value: string) => {
    if (!value || !value.includes("oklch(")) return value;
    if (!oklchCtx) {
      const canvas = document.createElement("canvas");
      oklchCtx = canvas.getContext("2d");
    }
    if (!oklchCtx) return value;

    return value.replace(OKLCH_REGEX, (match) => {
      try {
        oklchCtx!.fillStyle = "#000";
        oklchCtx!.fillStyle = match;
        return typeof oklchCtx!.fillStyle === "string"
          ? oklchCtx!.fillStyle
          : match;
      } catch {
        return match;
      }
    });
  };

  const sanitizeOklchAttributes = (doc: Document, root: HTMLElement) => {
    const walker = doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    let node = root as Element | null;
    while (node) {
      COLOR_ATTRS.forEach((attr) => {
        const raw = node?.getAttribute(attr);
        if (!raw || !raw.includes("oklch(")) return;
        const nextVal = normalizeOklch(raw);
        node?.setAttribute(attr, nextVal);
      });
      node = walker.nextNode() as Element | null;
    }
  };

  const inlineComputedStyles = (
    srcRoot: HTMLElement,
    clonedRoot: HTMLElement,
  ) => {
    const srcEls = [
      srcRoot,
      ...Array.from(srcRoot.querySelectorAll<HTMLElement>("*")),
    ];
    const clEls = [
      clonedRoot,
      ...Array.from(clonedRoot.querySelectorAll<HTMLElement>("*")),
    ];

    srcEls.forEach((src, i) => {
      const cl = clEls[i];
      if (!cl) return;
      const computed = window.getComputedStyle(src);
      INLINE_PROPS.forEach((prop) => {
        const val = computed.getPropertyValue(prop);
        if (!val) return;
        const nextVal = normalizeOklch(val);
        cl.style.setProperty(prop, nextVal, "important");
      });
    });
  };

  const downloadPreviewImage = async () => {
    if (!previewRef.value) return;

    try {
      const canvas = await html2canvas(previewRef.value, {
        backgroundColor: "#26262a",
        foreignObjectRendering: false,
        scale: Math.min(window.devicePixelRatio || 1, 2),
        useCORS: true,
        logging: false,
        onclone: (clonedDoc, clonedEl) => {
          clonedDoc
            .querySelectorAll('link[rel="stylesheet"], style')
            .forEach((s) => s.remove());

          inlineComputedStyles(previewRef.value!, clonedEl);
          sanitizeOklchAttributes(clonedDoc, clonedEl);

          clonedEl.style.setProperty(
            "background-color",
            "#26262a",
            "important",
          );
          clonedEl.style.setProperty("color", "#d4d4d8", "important");
        },
      });

      const url = canvas.toDataURL("image/jpeg", 0.92);
      const link = document.createElement("a");
      link.href = url;
      link.download = "preview.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      //console.error("No se pudo generar la imagen del preview.", error);
    }
  };

  return {
    downloadMarkdown,
    downloadPreviewImage,
    previewRef,
  };
});

export default useMarkdownExportStore;
