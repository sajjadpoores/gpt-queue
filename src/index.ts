import { QuestionStatus } from "./entities/question";
import { AccountRepository } from "./repositories/account/account";
import { QuestionRepository } from "./repositories/question/question";

async function main() {
  const accountManager = new AccountRepository();
  const accounts = await accountManager.loadData();

  const questionManager = new QuestionRepository();
  const questions = await questionManager.loadData();

  console.log("app is ready to ask questions from chatGPT");
  console.log("first we start with the accounts");
  for (const account of accounts) {
    await account.connect();
    if(!account.lastTimeGotToken) {
        await account.refreshTokenIfNeeded();
    }
  }

  console.log("now we start with the answering the questions");
  console.log("total questions: " + questions.length);

  const promises = [];
  for (const account of accounts) {
    promises.push(account.startAskingQuestions(questionManager));
  }

  await Promise.all(promises);
}

await main();
