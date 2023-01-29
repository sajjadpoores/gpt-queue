export enum QuestionStatus {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  ASKED = "ASKED",
  ANSWERED = "ANSWERED",
  ERROR = "ERROR",
}

export class Question {
  text: string;
  answer: string;
  status: QuestionStatus = QuestionStatus.NEW;
  isAsked: boolean = false;
  error: any;
}
