import { ChatGPTAPIBrowser } from "chatgpt";

export class Account {
    email: string;
    password: string;
    isGoogleLogin: boolean;
    lastTimeGotToken: Date;

    async connect() {
        let api: ChatGPTAPIBrowser;
        try {
            api = new ChatGPTAPIBrowser({
                email: this.email,
                password: this.password,
                isGoogleLogin: this.isGoogleLogin,
            });
            await api.initSession();
            this.lastTimeGotToken = new Date();
            const result = await api.sendMessage("Hello World!");

            console.log(result);
            api.closeSession();
            return api;
        }
        catch(err) {
            if(err.statusCode === 429) {
                console.log("Too many requests");
            }
            api.closeSession();
            return null;
        }
    }
}