import { ChatGPTAPIBrowser } from "chatgpt";

export class Account {
  email: string;
  password: string;
  isGoogleLogin: boolean;
  lastTimeGotToken: Date;

  async connect() {
    let api: ChatGPTAPIBrowser;
    try {
      console.log(
        "Connecting to ChatGPT API for account: " + this.email + " ..."
      );
      api = new ChatGPTAPIBrowser({
        email: this.email,
        password: this.password,
        isGoogleLogin: this.isGoogleLogin,
      });
      await api.initSession();
      this.lastTimeGotToken = new Date();
      
      return api;
    } catch (err) {
      api.closeSession();
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

  async sendMssg(api: ChatGPTAPIBrowser, mssg: string) {
    try {
      await api.sendMessage(mssg);
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  }
}
