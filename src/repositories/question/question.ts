import exceljs from "exceljs";
import { Question, QuestionStatus } from "../../entities/question";
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
        await this.workbook.getWorksheet(1).eachRow((row: exceljs.Row, rowNumber) => {
          if (rowNumber > 1) {
              const question = new Question();
              question.text = row.getCell(1).toString();
              question.status = QuestionStatus.NEW;
              this.questions.push(question);
          }
        });
        return this.questions;
    }
    catch(error) {
        if(error.message.includes("File not found")) {
            console.log("excel file for questions not found")
        }
        else {
            console.log(error)
        }
        return [];
    }
  }
}
