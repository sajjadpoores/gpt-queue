import { ChatGPTAPIBrowser } from "chatgpt";
async function main() {
  const api = new ChatGPTAPIBrowser({
    email: "sajjadpooresq@gmail.com",
    password: "SerooP@75",
    isGoogleLogin: true,
  });
  await api.initSession();

  const result = await api.sendMessage("Hello World!");
  console.log(result.response);
}


main()