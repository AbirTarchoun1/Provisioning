import { LoginHistory } from "./LoginHistory";

export interface UserLoginHistoryResponse {
  userId: number;
  username: string;
  email: string;
  loginHistory: LoginHistory[];
}





