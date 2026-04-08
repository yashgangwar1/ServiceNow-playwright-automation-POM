import dotenv from 'dotenv';
 
dotenv.config({ path: "Data/qa.env" });
 
export async function login(page: any) {
 
  await page.goto(process.env.BaseUrl as string);
 
  await page.getByRole('textbox', { name: 'User name' }).fill(process.env.LF_UserName as string);
 
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.LF_Password as string);
 
  await page.getByRole('button', { name: 'Log in' }).click();

  await page.getByRole('menuitem', { name: 'All' }).click();

  await page.getByPlaceholder('Filter').fill('incident');

  await page.getByText('Incidents').first().click();
  
  await page.waitForTimeout(2000);
}

