interface OutgoingMessage {
  type: string;
  kind?: string;
  message?: string;
  postId?: string;
  userId?: number;
  content?: string;
  position?: number;
  length?: number;
  version?: number;
  timestamp?: number;
}

type TextOp =
  | { kind: "insert"; index: number; text: string }
  | { kind: "delete"; index: number; length: number }
  | { kind: "replace"; index: number; length: number; text: string };

export type { OutgoingMessage, TextOp };
