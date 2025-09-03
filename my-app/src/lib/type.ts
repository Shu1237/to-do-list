import { Exo } from "next/font/google";
import { ReactNode } from "react";

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
export type ResponseLogin = {
  msg: string;
  token: string;
}
export type IUserRef = {
  _id: string;
  fullname: string;
  username: string;
}

export type ITask = {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  status: "todo" | "done" | "cancel";
  assignedTo: IUserRef;
  createdBy: IUserRef;
  createdAt: string;
  updatedAt: string;
}
export type Task = Omit<ITask, '_id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'status' | 'assignedTo'>;

export type IUser = {
  _id: string;
  fullname: string;
  username: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  __v: number;
}



export type BaseFormCreateProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: {
    title: string;
    description: string;
    startDate: string;
    dueDate: string;
    assignedTo?: string[];
  };
  onChange: (fields: any) => void;
  onSubmit: () => void;
  users?: IUser[];
  role?: "admin" | "user";
  loading?: boolean;
  fieldErrors?: Record<string, string>;
};

export type BaseFormUpdateProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: {
    title: string;
    description: string;
    startDate: string;
    dueDate: string;
    assignedTo?: string[];
  };
  onChange: (fields: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  users?: IUser[];
  role?: "admin" | "user";
  loading?: boolean;
  fieldErrors?: Record<string, string>;
};
export type BaseViewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: ITask | null;
  users?: IUser[];
};

export type TaskBoardProps = {
  initialTasks: ITask[];
};
export type TasksTableProps = {
  initialTasks: ITask[];
  users: IUser[];
};

export type UserTableProps = {
  initialUsers: IUser[];
};

export type AdminSectionSwitcherProps = {
  sections: { label: string; content: ReactNode }[];
};

export type BackendFieldError = {
  type: "field";
  value: any;
  msg: string;
  path: string;
  location: "body" | "query" | "params" | "headers";
};
export type BackendErrorResponse = {
  error: BackendFieldError[];
};

export type BaseFormUserProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	value: string;
	onChange: (val: string) => void;
	onSubmit: () => void;
	loading?: boolean;
	fieldErrors?: Record<string, string>;
}