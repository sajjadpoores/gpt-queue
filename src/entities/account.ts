import { ChatGPTAPIBrowser } from "chatgpt";
import { Question, QuestionStatus } from "./question";

export class Account {
  email: string;
  password: string;
  isGoogleLogin: boolean;
  lastTimeGotToken: Date;
  api: ChatGPTAPIBrowser;

  async connect() {
    try {
      console.log(
        "Connecting to ChatGPT API for account: " + this.email + " ..."
      );
      this.api = new ChatGPTAPIBrowser({
        email: this.email,
        password: this.password,
        isGoogleLogin: this.isGoogleLogin,
      });
      await this.api.initSession();
      this.lastTimeGotToken = new Date();

      return this.api;
    } catch (err) {
      this.api.closeSession();
      if (err.statusCode === 429) {
        // TODO: handle too many requests by waiting 5 seconds
        console.log("Too many requests");
        return null;
      } else if (
        err.message.includes(
          "Navigation failed because browser has disconnected!"
        ) ||
        err.message.includes(
          "Protocol error (Runtime.callFunctionOn): Target closed."
        )
      ) {
        console.log("Browser has disconnected");
        // TODO: Handle this error by restarting the browser
        return null;
      }
      console.log(err.message);
    }
  }

  async refreshTokenIfNeeded() {
    const diff = new Date().getTime() - this.lastTimeGotToken.getTime();

    if (diff > 1000 * 60 * 60) {
      // 1 hour
      await this.api.refreshSession();
      this.lastTimeGotToken = new Date();
    }
  }

  async sendMessage(message: string) {
    try {
      await this.refreshTokenIfNeeded(); // Refresh token if needed
      return await this.api.sendMessage(message); // Send message
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  async askQuestion(question: Question) {
    try {
      const result = await this.sendMessage(question.text); // Send message
      question.answer = result.response;
      question.status = QuestionStatus.ANSWERED;
      return question;
    } catch (err) {
      console.log(err.message);
      question.error = err;
      question.status = QuestionStatus.ERROR;
      return question;
    }
  }
}
