/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api";

class ResultService {
  getResults() {
    return api.get("/results");
  }

  getResult(id: number) {
    return api.get(`/results/${id}`);
  }

  createResult(result: any) {
    return api.post("/results", result);
  }

  updateResult(id: number, result: any) {
    return api.put(`/results/${id}`, result);
  }

  deleteResult(id: number) {
    return api.delete(`/results/${id}`);
  }
}

export default new ResultService();