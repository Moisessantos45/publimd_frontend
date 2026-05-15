import { getDateToString, getNumber, getString } from "./formatters";

const mapperCollaborator = (data: Record<string, unknown>) => {
  return {
    id: getNumber(data.id),
    userId: getNumber(data.user_id),
    postId: getNumber(data.post_id),
    permissionId: getNumber(data.permission_id),
    confirmed: data.confirmed?.toString() === "true",
    createdAt: getDateToString(data.created_at),
    updatedAt: getDateToString(data.updated_at),
  };
};

const mapperCollaboratorInfoBasic = (data: Record<string, unknown>) => {
  return {
    userId: getNumber(data.user_id),
    username: getString(data.user_name),
    email: getString(data.email),
    avatar: getString(data.avatar),
    permissionId: getNumber(data.permission_id),
    confirmed: data.confirmed?.toString() === "true",
  };
};

const mapperPostCollaboratorsData = (data: Record<string, unknown>) => {
  return {
    isAuthor: data.is_author?.toString() === "true",
    permissionId: getNumber(data.permission_id),
    collaborators: Array.isArray(data.collaborators)
      ? data.collaborators.map(mapperCollaboratorInfoBasic)
      : [],
  };
};

const mapperCollaboratorInviteRequest = (data: Record<string, unknown>) => {
  return {
    id: getNumber(data.id),
    name: getString(data.name),
    email: getString(data.email),
  };
};

export {
  mapperCollaborator,
  mapperCollaboratorInfoBasic,
  mapperCollaboratorInviteRequest,
  mapperPostCollaboratorsData,
};
