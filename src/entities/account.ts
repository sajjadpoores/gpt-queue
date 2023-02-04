import { ChatGPTAPI } from "chatgpt";
import { Question, QuestionStatus } from "./question";

export class Account {
  index: number;
  apiKey: string;
  api: ChatGPTAPI;
  
  async connect() {
    try {
      console.log("[" + this.index + "]: Connecting to ChatGPT API...");
      this.api = new ChatGPTAPI({
        apiKey: this.apiKey,
      });
      return this.api;
    } catch (err) {
      console.log(
        "[" + this.index + "]: could not connect, got error: ",
        err.message
      );
      return false;
    }
  }

  async sendMessageOrThrowError(message: string) {
    try {
      return await this.api.sendMessage(message); // Send message
    } catch (err) {
      console.log("[" + this.index + "] " + "got error: ", err.message);
    }
  }

  async askQuestion(question: Question) {
    try {
      console.log(
        "[" + this.index + "] " + " asking question " + question.index
      );
      const result = await this.sendMessageOrThrowError(question.text); // Send message
      console.log(
        "[" + this.index + "] " + " got answer for question " + question.index
      );
      question.answer = result.text;
      question.status = QuestionStatus.ANSWERED;
      return question;
    } catch (err) {
      console.log(
        "[" + this.index + "] " + " got error for question " + question.index
      );
      console.log("error:", err.message);
      question.error = err;
      question.status = QuestionStatus.ERROR;
      return question;
    }
  }
}
