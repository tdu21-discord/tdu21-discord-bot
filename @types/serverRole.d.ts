export type ServerRoles = {
  member: ServerRole
  evenNumber: ServerRole
  oddNumber: ServerRole
  others?: ServerRole[]
}

export interface ServerRole {
  name: string;
  roleId: string;
}