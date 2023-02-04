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
      console.log("[" + this.email + "]: Connecting to ChatGPT API...");
      this.api = new ChatGPTAPIBrowser({
        email: this.email,
        password: this.password,
        isGoogleLogin: this.isGoogleLogin,
      });
      await this.api.initSession();
      this.lastTimeGotToken = new Date();
      return this.api;
    } catch (err) {
      if (err.statusCode === 429) {
        console.log("[" + this.email + "]: Too many requests.");
      } else if (
        err.message.includes(
          "Navigation failed because browser has disconnected!"
        ) ||
        err.message.includes(
          "Protocol error (Runtime.callFunctionOn): Target closed."
        )
      ) {
        console.log("[" + this.email + "]: Browser has disconnected.");
      }
      console.log(
        "[" + this.email + "]: could not connect, got error: ",
        err.message
      );
      return false;
    }
  }

  async resetSession() {
    console.log("[" + this.email + "]: " + "account: trying to reset session");
    try {
      await this.api.resetSession();
      return true;
    } catch (err) {
      console.log(
        "[" +
          this.email +
          "]: could not reset session for account " +
          this.email,
        err.message
      );
      return false;
    }
  }

  async refreshTokenIfNeeded() {
    if (!this.lastTimeGotToken) {
      await this.resetSession();
      this.lastTimeGotToken = new Date();
      return;
    }
    const diff = new Date().getTime() - this.lastTimeGotToken.getTime();

    if (diff > 1000 * 60 * 60) {
      // 1 hour
      await this.api.refreshSession();
      this.lastTimeGotToken = new Date();
    }
  }

  async sendMessageOrThrowError(message: string) {
    try {
      await this.refreshTokenIfNeeded(); // Refresh token if needed
      return await this.api.sendMessage(message); // Send message
    } catch (err) {
      if (err.message.includes("error 429")) {
        console.log("[" + this.email + "] " + "account: is being rate limited");
      }

      throw err;
    }
  }


  async askQuestion(question: Question) {
    try {
      console.log(
        "[" + this.email + "] " + " asking question " + question.index
      );
      const result = await this.sendMessageOrThrowError(question.text); // Send message
      console.log(
        "[" + this.email + "] " + " got answer for question " + question.index
      );
      question.answer = result.response;
      question.status = QuestionStatus.ANSWERED;
      return question;
    } catch (err) {
      console.log(
        "[" + this.email + "] " + " got error for question " + question.index
      );
      console.log("error:", err.message);
      question.error = err;
      question.status = QuestionStatus.ERROR;
      return question;
    }
  }
}
