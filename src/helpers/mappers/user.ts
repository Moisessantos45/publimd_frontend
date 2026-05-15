import type { User } from "@/entities/user";
import { getDateToString, getNumber, getString } from "./formatters";

const mapperUser = (data: Record<string, unknown>): User => {
  return {
    id: getNumber(data.id),
    name: getString(data.name),
    lastName: getString(data.last_name),
    bio: getString(data.bio),
    avatar: getString(data.avatar),
    authId: getNumber(data.auth_id),
    createdAt: getDateToString(data.created_at),
    updatedAt: getDateToString(data.updated_at),
  };
};

const mapperUserDashboardMetrics = (data: Record<string, unknown>) => {
  return {
    totalPosts: getNumber(data.total_posts),
    totalCollaborations: getNumber(data.total_collaborations),
    totalLikes: getNumber(data.total_likes),
    totalComments: getNumber(data.total_comments),
  };
}

const userToJson = (user: Partial<User>) => ({
  name: user.name,
  last_name: user.lastName,
  bio: user.bio,
  avatar: user.avatar,
});

export { mapperUser, mapperUserDashboardMetrics, userToJson };
