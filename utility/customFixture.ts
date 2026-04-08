import { test as bT } from "@playwright/test";
import { LoginPage } from "../pages/loginpage.ts";
import { HomePage } from "../pages/homepage.ts";
import { IncidentPage } from "../pages/incidentpage.ts";

type myFixture = {
  loginfix: LoginPage;
  homfix: HomePage;
  incidentfix: IncidentPage;
};

export const test1 = bT.extend<myFixture>({

  loginfix: async ({ page }, use) => {
    const login = new LoginPage(page);
    await use(login);
  },

  homfix: async ({ page }, use) => {
    const hp = new HomePage(page);
    await use(hp);
  },

  incidentfix: async ({ page }, use) => {
    const wp = new IncidentPage(page);
    await use(wp);
  },

});