import { Page } from "@playwright/test"
export const locators = {
}
export const locatorsusinggetby = {
  AllMenu: (page: Page) => page.getByRole('menuitem', { name: 'All' }),
  filter: (page: Page) => page.getByPlaceholder('Filter'),
  incidents: (page: Page) => page.getByText('Incidents').first()
 
};