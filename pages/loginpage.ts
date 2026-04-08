import {Page,chromium} from "@playwright/test"
import { HomePage } from "./homepage"

export class LoginPage{

lppage : Page

constructor(Lpage:Page){ 

    this.lppage=Lpage 

}

async loadurl(url:string){

    await this.lppage.goto(url)

    return this

}

async enterCredentials(username:string,password:string){

    await this.lppage.locator(this.selectors.usernameField).fill(username)
    await this.lppage.locator(this.selectors.PwdField).fill(password)

    return this
}

async clickLogin(){

    await this.lppage.locator(this.selectors.lgbtn).click()
   return this
}


public selectors = {
    "usernameField":"#user_name",
    "PwdField":"#user_password",
    "lgbtn":`#sysverb_login`
}
}
