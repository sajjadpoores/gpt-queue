import { AccountRepository } from "./repositories/account/account";
import { QuestionRepository } from "./repositories/question/question";

const accountManager = new AccountRepository();
const accounts = await accountManager.loadData();


// accounts.forEach(async account => {
//     await account.connect()
// })

const questionManager = new QuestionRepository()
const questions = await questionManager.loadData()
console.log(questions)