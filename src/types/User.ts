export interface Role {
  roleId: number;
  roleName: string;
  users?: any[];
}

export interface User {
  userId: number;
  fullName: string;
  email: string;
  roleId: number;
  role: Role | null;
  roleName: string;
}
