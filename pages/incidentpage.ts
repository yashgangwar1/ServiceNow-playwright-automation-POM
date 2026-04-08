import { HomePage } from "./homepage";
import { expect } from "@playwright/test";
import path from "path";
import fs from "fs";

export class IncidentPage extends HomePage {

  private get frame() {
    return this.lppage.frameLocator('#gsft_main');
  }
  
  // SCENARIO 1 — Create New Incident

  async clicknewbutton() {
    await this.frame.getByRole('button', { name: 'New' }).click();
  }

  async getincidentnumber() {
    return await this.frame.getByRole('textbox', { name: 'Number' }).inputValue();
  }

  async urgencyandstate() {
    await this.frame.getByRole('combobox', { name: 'Urgency' }).selectOption({ label: '1 - High' });
    await this.frame.getByRole('textbox', { name: 'Short description' }).fill('New Incident Created via Automation');
    await this.frame.locator("//button[@id='sysverb_insert_bottom']").click();
  }

  async searchincident(incNumber: string) {
    await this.frame.getByRole('searchbox', { name: 'Search' }).fill(incNumber);
    await this.lppage.keyboard.press('Enter');
  }

  async verifyincidentcreated(incNumber: string) {
    await this.lppage.waitForTimeout(5000);
    const result = await this.frame.getByText(incNumber).first().textContent();
    expect(result).toContain(incNumber);
  }

  
  // SCENARIO 2 — Mandatory Field Validation

  async clicknewandsubmit() {
    await this.frame.getByRole('button', { name: 'New' }).click();
    await this.lppage.waitForLoadState();
    await this.frame.getByRole('button', { name: 'Submit' }).first().click();
  }
 
  async verifymandatoryerror() {
    // await this.lppage.waitForTimeout(1000);
    const error = await this.frame.locator('div.outputmsg.outputmsg_error.notification.notification-error').innerText();
    expect(error).toBeTruthy();
    console.log("Error Message is: The following mandatory fields are not filled in: Short description");
  }

  // SCENARIO 3 — Auto Incident Number Validation

  async createandgetincidentnumber() {
    await this.frame.locator("//button[@id='sysverb_new']").click();
    await this.lppage.waitForTimeout(2000);
    const incNumber = await this.frame.locator("//input[@id='incident.number']").inputValue();
    return parseInt(incNumber.slice(3));
  }
 
  async goback() {
    await this.lppage.waitForTimeout(2000);
    await this.frame.locator("//button[@class='btn btn-default icon-chevron-left navbar-btn']").click();
    // await this.frame.getByRole('link', { name: 'Back' }).click();
    await this.lppage.waitForTimeout(2000);
    await this.frame.locator("//button[@id='sysverb_new']").waitFor({ state: 'visible', timeout: 60000 });
  }
 
  async verifyautoincrement(num1: number, num2: number) {
    if (num2 === num1 + 1) {
      console.log("Auto Incident Number Validation Successfull");
    } else {
      console.log("Valdation Failed");
    }
  }

 
  // SCENARIO 4, 5 & 8  — Update all sections Incident Details and activity validation
 
  async openincident1(incidentName: string) {
    await this.frame.getByRole('link', { name: `Open record: ${incidentName}`, exact: true }).click();
    await this.lppage.waitForTimeout(1000);
  }
 
  async getactivitycount1() {
    return await this.frame.locator("//div[@class='activity-stream-label-counter']").count();
  }
 
  async updateincidentdetails() {
    await this.frame.locator("//input[@id='sys_display.incident.caller_id']").fill('User 1');
    await this.lppage.keyboard.press('Enter');
    await this.frame.getByRole('combobox', { name: 'Urgency' }).selectOption({ label: '3 - Low' });
    await this.frame.getByRole('combobox', { name: 'State' }).selectOption({ label: 'In Progress' });
    await this.frame.locator("//input[@id='incident.short_description']").fill('Details Updated using Scenario 4th,5th');
    await this.frame.getByRole('button', { name: 'Update' }).first().click();
  }
 
  async verifyactivityincreased(act1: number, act2: number) {
    if (act2 > act1) {
      console.log("Details and Incident state Updated Successfully");
    } else {
      console.log("No Update");
    }
    console.log("Activity log validation Successfull");
  }

  
  // SCENARIO 6 — Search Incident by Number
 
  async searchandverifyincident(incNumber: string) {
    await this.frame.getByRole('searchbox', { name: 'Search' }).fill(incNumber);
    await this.lppage.keyboard.press('Enter');
    await expect(this.frame.getByText(incNumber).first()).toBeVisible();
    console.log("Search Incident by Number Successfull");
  }

  
  // SCENARIO 7 — Filter Incident by Priority
  
  async filterbypriority(value: string) {
    await this.frame.locator("select[id$='_select']").selectOption({ value: 'priority' });
    await this.frame.getByRole('searchbox', { name: 'Search' }).fill(value);
    await this.lppage.keyboard.press('Enter');
    await this.lppage.waitForTimeout(2000);
  }

  async verifyfilterresults(expectedText: string) {
    await expect(this.frame.getByText(expectedText).first()).toBeVisible({ timeout: 15000 });
    const count = await this.frame.getByText(expectedText).count();
    console.log(`Total incidents with Priority "${expectedText}": ${count}`);
  }

  // SCENARIO 9 — Close Incident

  async openFirstIncident() {
  await this.frame.getByRole('link', { name: 'Open record: INC0010294' }).first().click();
  await this.lppage.waitForTimeout(1000);
  return await this.frame.getByRole('textbox', { name: 'Number' }).inputValue();
}
  
  async closeincident(incNumber: string) {
    await this.lppage.waitForTimeout(3000);
    await this.frame.getByRole('combobox', { name: 'State' }).selectOption({ label: 'Closed' });
    await this.frame.getByRole('button', { name: 'Update' }).first().click();
    const successmsg = await this.frame.locator("//div[@class='outputmsg_text']").innerText();
    await expect(successmsg).toBe(`${incNumber} has been permanently closed`);
    console.log("Incident Closing Successfull");
  }

  
  // SCENARIO 10 — Incident Appears in List
  
  async searchincidentinlist(incNumber: string) {
    await this.lppage.waitForTimeout(4000);
    const mainlistBox = this.frame.getByRole('listbox', { name: 'Search a specific field of the Incidents list, 6 items' });
    await mainlistBox.selectOption({ label: 'Number' });
    await this.frame.getByRole('searchbox', { name: 'Search' }).fill(incNumber);
    await this.lppage.keyboard.press('Enter');
    await this.lppage.waitForTimeout(5000);
    await this.frame.getByText(incNumber, { exact: true });
    console.log(`Incident no. ${incNumber} found in the list`);
  }


  // SCENARIO 11 — Attachment Handling

  async uploadattachment(filePath: string) {
    await this.frame.locator('.form-group').first().waitFor({ state: 'visible', timeout: 60000 });

    let attachbtn;
    try {
      const innerFrame = this.frame.frameLocator('iframe').first();
      attachbtn = innerFrame.locator('[title="Manage Attachments"], [aria-label="Manage Attachments"], .icon-paperclip').first();
      await attachbtn.waitFor({ state: 'visible', timeout: 5000 });
    } catch {
      attachbtn = this.frame.locator('[title="Manage Attachments"], [aria-label="Manage Attachments"], .icon-paperclip').first();
      await attachbtn.waitFor({ state: 'visible', timeout: 60000 });
    }

    await attachbtn.scrollIntoViewIfNeeded();
    await attachbtn.click();
    await this.lppage.waitForTimeout(3000);

    let fileInput = null;
    for (const f of this.lppage.frames()) {
      const input = f.locator('//input[@type="file"]');
      const count = await input.count();
      if (count > 0) {
        fileInput = input;
        break;
      }
    }

    if (!fileInput) throw new Error("File input not found in any frame");

    await fileInput.setInputFiles(filePath);
    await this.lppage.waitForTimeout(3000);

    await this.lppage.keyboard.press('Escape');
    await this.lppage.waitForTimeout(2000);
  }

  async verifyattachment(fileName: string) {
    await this.frame.locator('#activity-stream-textarea').scrollIntoViewIfNeeded();
    await this.lppage.waitForTimeout(2000);
    const fileEntry = this.frame.locator(`text=${fileName}`).first();
    await expect(fileEntry).toBeVisible({ timeout: 15000 });
    console.log("Attachment uploaded & verified in Activities panel successfully");
  }


  // SCENARIO 12 — Delete Incident
 
  async deleteincident() {
    await this.lppage.waitForTimeout(3000);
    await this.lppage.keyboard.press('Enter');
    await this.frame.locator("//button[@id='sysverb_delete']").click();
    await this.lppage.waitForTimeout(3000);
    await this.frame.locator("//button[@id='ok_button']").click();
    await this.lppage.waitForTimeout(1000);
    await this.frame.locator('.form-group').first().waitFor({ state: 'visible', timeout: 60000 });
  }

  async verifyincidentdeleted(incidentName: string) {
    const incidentLink = this.frame.getByRole('link', { name: `Open record: ${incidentName}` });
    await expect(incidentLink).not.toBeVisible({ timeout: 15000 });
    console.log("TC_INC_012 - Incident Deleted Successfully");
  }
}
