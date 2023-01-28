export enum QuestionStatus {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  ASKED = "ASKED",
  ANSWERED = "ANSWERED",
  ERROR = "ERROR",
}

export class Question {
  id: number;
  title: string;
  content: string;
  answer: string;
  status: QuestionStatus;
  isAsked: boolean;
  error: any;
}
