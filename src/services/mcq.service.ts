/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api";

class McqService {
  getMcqs() {
    return api.get("/mcqs");
  }

  getMcq(id: number) {
    return api.get(`/mcqs/${id}`);
  }

  createMcq(mcq: any) {
    return api.post("/mcqs", mcq);
  }

  updateMcq(id: number, mcq: any) {
    return api.put(`/mcqs/${id}`, mcq);
  }

  deleteMcq(id: number) {
    return api.delete(`/mcqs/${id}`);
  }
  getQuizMcqs(id:number){
        return api.get(`/quizzes/${id}/mcqs`)
    }
}

export default new McqService();