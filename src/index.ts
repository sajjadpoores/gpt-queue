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
  }

  console.log("now we start with the questions");
  for (let question of questions) {
    question = await accountManager.getAccountByPriority().askQuestion(question);
    if(question.status === QuestionStatus.ANSWERED) {
        questionManager.saveData(question);
        console.log("question answered: " + question.answer)
    }
    else if(question.status === QuestionStatus.ERROR) {
        console.log("question error: " + question.error)
    }
  }
}

await main();
