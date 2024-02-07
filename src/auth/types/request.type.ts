import { Payload } from './payload.type';

export interface UserRequest extends Request {
  user: Payload;
}
