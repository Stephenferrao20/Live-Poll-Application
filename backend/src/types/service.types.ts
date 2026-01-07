export interface CreatePollInput {
  question: string;
  options: {
    optionId: string;
    text: string;
  }[];
  duration: number;
}

export interface SubmitVoteInput {
  pollId: string;
  studentId: string;
  optionId: string;
}