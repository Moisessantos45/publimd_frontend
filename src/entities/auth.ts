interface Auth {
  id: number;
  email: string;
  twoFactorEnabled: boolean;
  firstSession: boolean;
  fullProfile: boolean;
  emailConfirmed: boolean;
  token: string;
}

const initialAuthState: Auth = {
  id: 0,
  email: "",
  twoFactorEnabled: false,
  firstSession: false,
  fullProfile: false,
  emailConfirmed: false,
  token: "",
};

export { initialAuthState };
export type { Auth };