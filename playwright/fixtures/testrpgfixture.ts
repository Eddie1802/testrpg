import { test as base } from "@playwright/test";
import { InventoryPage } from "../pageobjects/inventory.page";
import { PlayPage } from "../pageobjects/play.page";

type Fixtures = {
  playPage: PlayPage;
  inventoryPage: InventoryPage;
};

export const test = base.extend<Fixtures>({
  playPage: async ({ page }, use) => {
    const playPage = new PlayPage(page);
    await playPage.goto();
    await use(playPage);
  },
  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();
    await use(inventoryPage);
  },
});

export { expect } from "@playwright/test";
