export interface CreatePollPayload {
  question: string;
  options: {
    optionId: string;
    text: string;
    isCorrect: boolean;
  }[];
  duration: number;
}

export interface SubmitVotePayload {
  pollId: string;
  studentId: string;
  optionId: string;
}