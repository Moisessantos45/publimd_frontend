interface BasePost {
  id: number;
  slug: string;
  title: string;
  createdAt: string;
}

interface Post extends BasePost {
  content: string;
  authorId: number;
  tags: string[];
  category: string;
  stateId: number;
  isCollaborative: boolean;
  permissionId: number;
  updatedAt: string;
}

interface PostInfoBasic extends BasePost {
  content: string;
  author: string;
  tags: string[];
  category: string;
}

interface PostInfoGeneric extends BasePost {
  tags: string[];
  category: string;
  state: string;
  stateId: number;
  isCollaborative: boolean;
  collaboratorPermissionId: number;
  isVectorized: boolean;
}

interface PostInfoDetailed extends BasePost {
  content: string;
  tags: string;
  category: string;
  author: string;
}

interface PostInfoRecent extends BasePost {}

const initialPost: Post = {
  id: -1,
  slug: "",
  title: "",
  content: "",
  authorId: -1,
  tags: [],
  category: "",
  stateId: 1,
  isCollaborative: false,
  permissionId: -1,
  createdAt: "",
  updatedAt: "",
};

const initialPostInfoGeneric: PostInfoGeneric = {
  id: -1,
  slug: "",
  title: "",
  tags: [],
  category: "",
  state: "",
  stateId: -1,
  isCollaborative: false,
  collaboratorPermissionId: -1,
  isVectorized: false,
  createdAt: "",
};

const initialPostInfoDetailed: PostInfoDetailed = {
  id: -1,
  slug: "",
  title: "",
  content: "",
  tags: "",
  category: "",
  author: "",
  createdAt: "",
};

export {
  type BasePost,
  type Post,
  type PostInfoGeneric,
  type PostInfoDetailed,
  type PostInfoRecent,
  type PostInfoBasic,
  initialPost,
  initialPostInfoGeneric,
  initialPostInfoDetailed,
};
