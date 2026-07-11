import api from "./api";

class AuthService {
  login(credentials: {
    email: string;
    password: string;
  }) {
    return api.post("/login", credentials);
  }
}

export default new AuthService();