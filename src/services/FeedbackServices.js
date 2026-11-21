import Api from "./Api";

const FeedbackService = {
  addFeedback(data) {
    return Api.post("/feedback", data);
  },
};

export default FeedbackService;
