import { AccountController } from "./modules/account/account";

const accountManager = new AccountController();
const accounts = await accountManager.loadData();


accounts.forEach(async account => {
    await account.connect()
})