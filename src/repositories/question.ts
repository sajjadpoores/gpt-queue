import exceljs from "exceljs";
import { Account } from "../entities/account";
import { Question, QuestionStatus } from "../entities/question";
export class QuestionRepository {
  constructor() {
    this.fileName = "questions.xlsx";
    this.workbook = new exceljs.Workbook();
    this.questions = [];
  }

  private fileName: string;
  private workbook: exceljs.Workbook;
  private questions: Question[];

  async loadData() {
    try {
      this.workbook = new exceljs.Workbook();
      this.workbook = await this.workbook.xlsx.readFile(
        "./data/" + this.fileName
      );

      this.questions = [];
      await this.workbook
        .getWorksheet(1)
        .eachRow((row: exceljs.Row, rowNumber) => {
          if (rowNumber > 1) {
            const question = new Question();
            question.index = rowNumber - 1;
            question.text = row.getCell(1).toString();
            question.answer = row.getCell(2).toString();
            if (question.answer) {
              question.status = QuestionStatus.ANSWERED;
            } else {
              question.status = QuestionStatus.NEW;
            }

            this.questions.push(question);
          }
        });
      return this.questions;
    } catch (error) {
      if (error.message.includes("File not found")) {
        console.log("excel file for questions not found");
      } else {
        console.log(error);
      }
      return [];
    }
  }

  async saveData(question: Question, account: Account) {
    if (!this.workbook) {
      console.log("workbook not loaded, you need to call loadData() first");
      return;
    }

    const worksheet = this.workbook.getWorksheet(1);
    worksheet.eachRow((row: exceljs.Row) => {
      if (row.getCell(1).toString() === question.text) {
        if (question.status === QuestionStatus.ANSWERED) {
          row.splice(2, 2, question.answer, account.email);
        } else if (question.status === QuestionStatus.ERROR) {
          row.splice(3, 2, account.email, question.error);
        }
        this.workbook.xlsx.writeFile("./data/" + this.fileName);
      }
    });
  }

  getNextUnansweredQuestion() {
    const question = this.questions.find((q) => {
      return q.status !== QuestionStatus.ANSWERED;
    });
    if (question) {
      question.status = QuestionStatus.IN_PROGRESS;
      return question;
    }

    console.log("All questions answered");
    return null;
  }
}
