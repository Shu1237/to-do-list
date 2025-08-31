export type User = {
    id: string;
    fullname: string;
    username: string;
    role: 'user' | 'admin';
    exp?: number; 
    iat?: number; 
}

export type AuthProviderProps = {
  children: React.ReactNode;
  initialToken?: string | null;
  initialUser?: User | null;
};

export type AuthContextType = {
  token: string | null;
  user: User | null;
  setToken: (t: string) => void;
  logout: () => void;
};
export type ResponseLogin ={
  msg:string;
  token:string;
}