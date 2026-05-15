import type { Auth } from "@/entities/auth";
import { getNumber, getString } from "./formatters";

const authMapper = (data: Record<string, unknown>): Auth => {
  return {
    id: getNumber(data.id),
    email: getString(data.email),
    twoFactorEnabled: data.two_factor_enabled?.toString() === "true",
    firstSession: data.first_session?.toString() === "true",
    fullProfile: data.full_profile?.toString() === "true",
    emailConfirmed: data.email_confirmed?.toString() === "true",
    token: getString(data.token),
  };
};

const authToJson = (auth: Partial<Auth>) => ({
  id: auth.id,
  email: auth.email,
  two_factor_enabled: auth.twoFactorEnabled,
  first_session: auth.firstSession,
  full_profile: auth.fullProfile,
  email_confirmed: auth.emailConfirmed,
  token: auth.token,
});

export { authMapper, authToJson };
