/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api";

class QuizService {
  getQuizzes() {
    return api.get("/quizzes");
  }

  getQuiz(id: number) {
    return api.get(`/quizzes/${id}`);
  }

  createQuiz(quiz: any) {
    return api.post("/quizzes", quiz);
  }

  updateQuiz(id: number, quiz: any) {
    return api.put(`/quizzes/${id}`, quiz);
  }

  deleteQuiz(id: number) {
    return api.delete(`/quizzes/${id}`);
  }
}

export default new QuizService();