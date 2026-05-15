import { getNumber, getString } from "./formatters";

const mapperOutgoingMessage = (data: Record<string, unknown>) => {
  return {
    type: getString(data.type),
    kind: getString(data.kind),
    message: getString(data.message),
    postId: getString(data.postId),
    userId: getNumber(data.userId),
    content: getString(data.content),
    position: getNumber(data.position),
    length: getNumber(data.length),
    version: getNumber(data.version),
    timestamp: getNumber(data.timestamp),
  };
};

export { mapperOutgoingMessage };
