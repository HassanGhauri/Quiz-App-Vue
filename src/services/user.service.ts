import api from "./api";

class UserService {
  getUsers() {
    return api.get("/users");
  }

  getUser(id: number) {
    return api.get(`/users/${id}`);
  }

  createUser(user: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
  }) {
    return api.post("/users", user);
  }

  updateUser(
    id: number,
    user: Partial<{
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      role: string;
    }>
  ) {
    return api.put(`/users/${id}`, user);
  }

  deleteUser(id: number) {
    return api.delete(`/users/${id}`);
  }
}

export default new UserService();