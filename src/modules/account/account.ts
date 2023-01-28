import exceljs from "exceljs";
import { Account } from "../../entities/account";

export class AccountController {
  constructor() {
    this.fileName = "accounts.xlsx";
    this.workbook = new exceljs.Workbook();
    this.accounts = [];
  }

  private fileName: string;
  private workbook: exceljs.Workbook;
  private accounts: Account[];

  async loadData() {
    this.workbook = new exceljs.Workbook();
    this.workbook = await this.workbook.xlsx.readFile(
      "./data/" + this.fileName
    );

    this.accounts = [];
    await this.workbook.getWorksheet("Sheet1").eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const account = new Account();
        account.email = row.getCell(2).toString();
        account.password = row.getCell(3).toString();
        account.isGoogleLogin = row.getCell(4).toString() === "1";
        this.accounts.push(account);
      }
    });
    return this.accounts;
  }

  getAccounts() {
    return this.accounts;
  }
}
