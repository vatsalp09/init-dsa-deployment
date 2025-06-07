import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useSubmissionStore = create((set, get) => ({
  isLoading: false,
  submission: [],
  submission: null,
  submissionCount: null,

  getAllSubmissions: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/submission/get-all-submission");

      set({ submission: res.data.submission });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error getting all submission", error);
      toast.error("Error getting all submission");
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionForProblem: async (problemId) => {
    try {
      const res = await axiosInstance.get(
        `/submission/get-submission/${problemId}`
      );

      set({ submission: res.data.submissions });

    } catch (error) {
      console.log("Error getting submission for problem", error);

      toast.error("Error getting submission for problem");
      
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionCountForProblem: async (problemId) => {
    try {
      const res = await axiosInstance.get(
        `/submission/get-submissions-count/${problemId}`
      );                

      set({ submissionCount: res.data.count });
    } catch (error) {
      console.log("Error getting submission count for problem", error);
      toast.error("Error getting submission count for problem");
    }
  },
}));
