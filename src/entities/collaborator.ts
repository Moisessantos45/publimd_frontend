interface Collaborator {
  id: number;
  userId: number;
  postId: number;
  permissionId: number;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CollaboratorInfoBasic {
  userId: number;
  username: string;
  email: string;
  avatar: string;
  permissionId: number;
  confirmed: boolean;
}

interface PostCollaboratorsData {
  isAuthor: boolean;
  permissionId: number;
  collaborators: CollaboratorInfoBasic[];
}

interface CollaboratorInviteRequest {
  id: number;
  name: string;
  email: string;
}

const initialCollaborator: Collaborator = {
  id: -1,
  userId: -1,
  postId: -1,
  permissionId: -1,
  confirmed: false,
  createdAt: "2024-06-01T00:00:00.000Z",
  updatedAt: "2024-06-01T00:00:00.000Z",
};

const initialCollaboratorInviteRequest: CollaboratorInviteRequest = {
  id: -1,
  name: "",
  email: "",
};

const initialCollaboratorInfoBasic: CollaboratorInfoBasic = {
  userId: -1,
  username: "",
  avatar: "",
  email: "",
  permissionId: -1,
  confirmed: false,
};

const initPostCollaboratorsData: PostCollaboratorsData = {
  isAuthor: false,
  permissionId: 1,
  collaborators: [],
};

export {
  type CollaboratorInfoBasic,
  type Collaborator,
  type CollaboratorInviteRequest,
  type PostCollaboratorsData,
  initialCollaboratorInfoBasic,
  initialCollaboratorInviteRequest,
  initialCollaborator,
  initPostCollaboratorsData,
};
