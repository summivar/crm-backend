import { Role } from '../enums';

export interface UserRequest extends Request {
  user: {
    id: number;
    phone: string;
    role: Role;
    company: number;
  };
}
