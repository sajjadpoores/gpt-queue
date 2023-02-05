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
        completionParams: {
          model: "text-davinci-003",
          max_tokens: 800,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        },
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
      return await this.api.sendMessage(message, {
        promptPrefix: `You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Your answers must be maximum 400 words long. Knowledge cutoff: 2021-09 Current date: ${new Date().toISOString()}.\n\n.`,
        timeoutMs: 3 * 60 * 1000,
      }); // Send message
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
