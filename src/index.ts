import { Account } from "./entities/account";
import { QuestionStatus } from "./entities/question";
import { AccountRepository } from "./repositories/account/account";
import { QuestionRepository } from "./repositories/question/question";

async function connectAccountAndStarAsking(
  account: Account,
  questionManager: QuestionRepository
) {
  console.log("connecting account: " + account.email);
  await account.connect();
  while(!account.lastTimeGotToken) {
    console.log("retrying to connect account: " + account.email);
    await account.connect();
  }
  await account.startAskingQuestions(questionManager);
}

async function main() {
  const accountManager = new AccountRepository();
  const accounts = await accountManager.loadData();

  const questionManager = new QuestionRepository();
  const questions = await questionManager.loadData();

  console.log("app is ready to ask questions from chatGPT");

  console.log("total questions: " + questions.length);
  const promises = [];
  for (const account of accounts) {
    promises.push(connectAccountAndStarAsking(account, questionManager));
  }

  await Promise.all(promises);
}

await main();
