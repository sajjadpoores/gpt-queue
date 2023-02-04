import { Account } from "../entities/account";
import { Question, QuestionStatus } from "../entities/question";
import { Task, TaskType } from "../entities/task";
import { QuestionRepository } from "./question";

export class TaskController {
  constructor() {
    this.tasks = [];
  }

  private tasks: Task[];

  addTask(task: Task) {
    this.tasks.push(task);
  }

  createTask(type: TaskType, account: Account, question?: Question) {
    const task = new Task();
    task.type = type;
    task.account = account;
    if (question) {
      task.question = question;
    }
    return task;
  }

  getTask() {
    return this.tasks.shift();
  }

  hasTask() {
    return this.tasks.length > 0;
  }

  async getTaskByAccount(account) {
    return this.tasks.find((task) => task.account === account);
  }

  async doTask(questionManager: QuestionRepository, task: Task) {
    let nextTask: Task | null = null;
    if (task.type === TaskType.NEW_CONNECTION) {
      console.log("[" + task.account.email + "]: connecting...");
      await task.account.connect();
      while (!task.account.lastTimeGotToken) {
        console.log("[" + task.account.email + "]: retrying to connect...");
        await task.account.connect();
      }
    }
    if (task.question && task.type === TaskType.ASK) {
      const question = await task.account.askQuestion(task.question);
      questionManager.saveData(question, task.account);

      if (question.status === QuestionStatus.ERROR) {
        nextTask = await this.createNextTask(
          questionManager,
          TaskType.CONNECTION,
          task.account
        );
      }

    } else if (task.type === TaskType.CONNECTION) {
      while (!(await task.account.resetSession()));
    }


    if(!nextTask) {
      nextTask = await this.createNextTask(
        questionManager,
        TaskType.ASK,
        task.account
      );
    }

    if (nextTask) {
      this.addTask(nextTask);
    }
    return nextTask;
  }

  async createNextTask(
    questionManager: QuestionRepository,
    taskType: TaskType,
    account: Account
  ) {
    if (taskType === TaskType.ASK) {
      const question = questionManager.getNextUnansweredQuestion();
      if (question) {
        return this.createTask(TaskType.ASK, account, question);
      }
      return null;
    } else {
      return this.createTask(TaskType.CONNECTION, account);
    }
  }
}
