import { Role } from "../enums"

export type SignUpResponse = {
  accessToken: string,
  user: {
    id: number,
    name: string,
    role: Role
  }
}