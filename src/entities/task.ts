import { Account } from "./account";
import { Question } from "./question";

export enum TaskStatus {
    NEW = "NEW",
    RUNNING = "RUNNING",
    DONE = "DONE",
    ERROR = "ERROR",
}

export enum TaskType {
    NEW_CONNECTION = "NEW_CONNECTION",
    CONNECTION = "CONNECTION",
    ASK = "Ask",
}

export class Task {
    satus: TaskStatus;
    type: TaskType;
    account: Account;
    question?: Question;
}