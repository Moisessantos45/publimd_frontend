import type {
  Post,
  PostInfoGeneric,
  PostInfoDetailed,
  PostInfoRecent,
  PostInfoBasic,
} from "@/entities/post";
import { getDateToString, getNumber, getString } from "./formatters";
import { serializeToJson } from "./parse";

const mapperPost = (data: Record<string, unknown>): Post => {
  return {
    id: getNumber(data.id),
    slug: getString(data.slug),
    title: getString(data.title),
    content: getString(data.content),
    authorId: getNumber(data.author_id),
    tags: serializeToJson<string>(data.tags, []),
    category: getString(data.category),
    stateId: getNumber(data.state_id),
    isCollaborative: data.is_collaborative?.toString() === "true",
    permissionId: getNumber(data.permission_id),
    createdAt: getDateToString(data.created_at),
    updatedAt: getDateToString(data.updated_at),
  };
};

const mapperPostInfoBasic = (data: Record<string, unknown>): PostInfoBasic => {
  return {
    id: getNumber(data.id),
    slug: getString(data.slug),
    title: getString(data.title),
    content: getString(data.content),
    tags: serializeToJson<string>(data.tags, []),
    category: getString(data.category),
    author: getString(data.author),
    createdAt: getDateToString(data.created_at),
  };
};

const mapperPostInfoGeneric = (
  data: Record<string, unknown>,
): PostInfoGeneric => {
  return {
    id: getNumber(data.id),
    slug: getString(data.slug),
    title: getString(data.title),
    tags: serializeToJson<string>(data.tags, []),
    category: getString(data.category),
    state: getString(data.state),
    stateId: getNumber(data.state_id),
    isCollaborative: data.is_collaborative?.toString() === "true",
    collaboratorPermissionId: getNumber(data.collaborator_permission_id),
    isVectorized: data.is_vectorized?.toString() === "true",
    createdAt: getDateToString(data.created_at),
  };
};

const mapperPostInfoDetailed = (
  data: Record<string, unknown>,
): PostInfoDetailed => {
  return {
    id: getNumber(data.id),
    slug: getString(data.slug),
    title: getString(data.title),
    content: getString(data.content),
    tags: getString(data.tags),
    category: getString(data.category),
    author: getString(data.author),
    createdAt: getDateToString(data.created_at),
  };
};

const mapperPostInfoRecent = (
  data: Record<string, unknown>,
): PostInfoRecent => {
  return {
    id: getNumber(data.id),
    slug: getString(data.slug),
    title: getString(data.title),
    createdAt: getDateToString(data.created_at),
  };
};

const postToJson = (post: Partial<Post>) => ({
  title: post.title,
  content: post.content,
  tags: post.tags || [],
  category: post.category,
  state_id: post.stateId,
});

export {
  mapperPost,
  mapperPostInfoBasic,
  mapperPostInfoGeneric,
  mapperPostInfoDetailed,
  mapperPostInfoRecent,
  postToJson,
};
