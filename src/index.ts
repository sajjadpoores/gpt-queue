import { Account } from "./entities/account";
import { TaskType } from "./entities/task";
import { AccountRepository } from "./repositories/account";
import { QuestionRepository } from "./repositories/question";
import { TaskController } from "./repositories/task";

async function connectAccountAndStarAsking(
  account: Account,
  questionManager: QuestionRepository
) {
  const taskRepo = new TaskController();
  taskRepo.addTask(taskRepo.createTask(TaskType.NEW_CONNECTION, account));
  while (taskRepo.hasTask()) {
    await taskRepo.doTask(questionManager, taskRepo.getTask()!);
  }
  console.log("[" + account.email + "]: did all its tasks");
}

async function main() {
  const accountManager = new AccountRepository();
  const accounts = await accountManager.loadData();

  const questionManager = new QuestionRepository();
  const questions = await questionManager.loadData();

  console.log("app is ready to ask questions from chatGPT");

  console.log("total questions: " + questions.length);
  const promises: Promise<void>[] = [];
  for (const account of accounts) {
    promises.push(connectAccountAndStarAsking(account, questionManager));
  }

  await Promise.all(promises);
}

await main();
