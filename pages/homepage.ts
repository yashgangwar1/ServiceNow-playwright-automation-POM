import { LoginPage } from "./loginpage";
import { Page } from "@playwright/test"
import {locators} from "./locators"
import {locatorsusinggetby} from "./locators"
//import { incidentpage } from "./incidentpage";


export class HomePage extends LoginPage{

    async clickAllMenu(){
        await locatorsusinggetby.AllMenu(this.lppage).click();
    }


   async enterfilterValue(){
   await locatorsusinggetby.filter(this.lppage).fill("incident")     
    
    }
    async clickIncidentslink() {
    await locatorsusinggetby.incidents(this.lppage).waitFor({ state: 'visible', timeout: 15000 });
    await locatorsusinggetby.incidents(this.lppage).click();
    await this.lppage.waitForTimeout(3000);
}
} 