export interface IAdminUser {
  id: number;
  name: string;
  email: string;
  role: "admin";
  token: string;
}

export interface IAuthContextValue {
  user: IAdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}