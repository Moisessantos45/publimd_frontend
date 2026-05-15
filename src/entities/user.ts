interface User {
  id: number;
  name: string;
  lastName: string;
  bio: string;
  avatar: string;
  authId: number;
  createdAt: string;
  updatedAt: string;
}

interface UserDashboardMetrics {
  totalPosts: number;
  totalCollaborations: number;
  totalLikes: number;
  totalComments: number;
}

interface UserBasicInfo {
  userId: number;
  avatar: string;
}

const initialUserState: User = {
  id: -1,
  name: "",
  lastName: "",
  bio: "",
  avatar: "",
  authId: -1,
  createdAt: "",
  updatedAt: "",
};

const initialUserDashboardMetrics: UserDashboardMetrics = {
  totalPosts: 0,
  totalCollaborations: 0,
  totalLikes: 0,
  totalComments: 0,
};

export {type User, type UserDashboardMetrics, type UserBasicInfo, initialUserState ,initialUserDashboardMetrics};