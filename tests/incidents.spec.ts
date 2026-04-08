import dotenv from "dotenv";
import LoginData from "../Data/login.json";
import { test1 } from "../utility/customFixture";
import { sharedData } from "../utility/shared-data";
import path from "path";
import fs from "fs";

dotenv.config({ path: "Data/qa.env" });

test1.beforeEach(async ({ loginfix, homfix }) => {
  await loginfix.loadurl(process.env.BaseUrl as string);
  await (await loginfix.enterCredentials(LoginData[0].UserName, LoginData[0].Password)).clickLogin();
  await homfix.clickAllMenu();
  await homfix.enterfilterValue();
  await homfix.clickIncidentslink();
});


// SCENARIO 1 — Create New Incident

test1('TC_INC_001 - Create New Incident', async ({ incidentfix }) => {
  test1.setTimeout(60000);

  await incidentfix.clicknewbutton();

  const incNumber = await incidentfix.getincidentnumber();
  sharedData.incidentNumber = incNumber;
  console.log("New Incident Number:", incNumber);

  await incidentfix.urgencyandstate();
  await incidentfix.searchincident(incNumber);
  await incidentfix.verifyincidentcreated(incNumber);

  console.log(`TC_INC_001 Passed - New Incident ${incNumber} created successfully`);
});


// SCENARIO 2 — Mandatory Field Validation

test1('TC_INC_002 - Mandatory Field Validation', async ({ incidentfix }) => {
 test1.setTimeout(60000);
  await incidentfix.clicknewandsubmit();
  await incidentfix.verifymandatoryerror();
 
  console.log("TC_INC_002 Passed - Mandatory field validation successful");
});


// SCENARIO 3 — Auto Incident Number Validation

test1('TC_INC_003 - Auto Incident Number Validation', async ({ incidentfix }) => {
  test1.setTimeout(90000);
 
  const num1 = await incidentfix.createandgetincidentnumber();
  console.log("INC 1:", num1);
 
  await incidentfix.goback();
 
  const num2 = await incidentfix.createandgetincidentnumber();
  console.log("INC 2:", num2);
 
  await incidentfix.verifyautoincrement(num1, num2);
 
  console.log("TC_INC_003 Passed - Auto Incident Number Validation successful");
});


// SCENARIO 4, 5 & 8  — Update all sections Incident Details and activity validation

test1('TC_INC_004,005 and 008 - Update Incident Details, Incident State Transition & Activity log validation', async ({ incidentfix }) => {

  const incNumber1 = sharedData.incidentNumber;
  await incidentfix.openincident1(incNumber1);
 
  const act1 = await incidentfix.getactivitycount1();
  console.log("Number of activities at Initial stage  :", act1);
 
  await incidentfix.updateincidentdetails();
 
  const act2 = await incidentfix.getactivitycount1();
  console.log("Number of updated activity:", act2);
 
  await incidentfix.verifyactivityincreased(act1, act2);

  console.log("TC_INC_004_005_008 Passed - Incident details, state updated & Activity log validation successfully");
});


// SCENARIO 6 — Search Incident by Number

test1('TC_INC_006 - Search Incident by Number', async ({ incidentfix }) => {

  const incNumber = 'INC0010053';
  console.log("Using Incident Number:", incNumber);

  await incidentfix.searchandverifyincident(incNumber);

  console.log("TC_INC_006 Passed - Search Incident by Number successful");
});


// SCENARIO 7 — Filter Incident by Priority

test1('TC_INC_007 - Filter Incident by State', async ({ incidentfix }) => {

  await incidentfix.filterbypriority('=4');
  await incidentfix.verifyfilterresults('4 - Low');

  console.log("TC_INC_007 - Filter by Priority 4 validated successfully");
});


// SCENARIO 9 — Close Incident

test1('TC_INC_009 - Close Incident', async ({ incidentfix }) => {

  const incNumber = await incidentfix.openFirstIncident();
  console.log("Closing Incident:", incNumber);

  await incidentfix.closeincident(incNumber);

  console.log("TC_INC_009 Passed - Incident closed successfully");
});


// SCENARIO 10 — Incident Appears in List

test1('TC_INC_010 - Incident appears in list', async ({ incidentfix }) => {

  const incNumber = 'INC0010085';
  await incidentfix.searchincidentinlist(incNumber);

  console.log("TC_INC_010 Passed - Incident found in list successfully");
});


// SCENARIO 11 — Attachment Handling

test1('TC_INC_011 - Attachment Handling', async ({ incidentfix }) => {
  test1.setTimeout(90000);

  const filePath = path.resolve('tests/sample.txt');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, 'This is a sample attachment file for testing.');
  }

  await incidentfix.openincident1('INC0010053');
  await incidentfix.uploadattachment(filePath);
  await incidentfix.verifyattachment('sample.txt');

  console.log("TC_INC_011 Passed - Attachment uploaded & verified successfully");
});


// SCENARIO 12 — Delete Incident

test1('TC_INC_012 - Delete Incident', async ({ incidentfix }) => {
  test1.setTimeout(60000);

  const incNumber = sharedData.incidentNumber;
  console.log("Deleting Incident:", incNumber);

  await incidentfix.searchincident(incNumber);
  await incidentfix.lppage.waitForTimeout(3000);
  await incidentfix.openincident1(incNumber);
  await incidentfix.deleteincident();
  await incidentfix.verifyincidentdeleted(incNumber);

  console.log("TC_INC_012 Passed - Incident deleted successfully");
});
