import { expect, test } from "../fixtures/testrpgfixture";
import { builds, type BuildName } from "./data/buildtypes";

const buildNames = Object.keys(builds) as BuildName[];

// Another build to switch to, so every build is the starting point once
const otherBuild = (build: BuildName) => buildNames[(buildNames.indexOf(build) + 1) % buildNames.length];

test.describe("FR-10 Build selector", () => {
  test("offers the four builds with thief selected by default", async ({ inventoryPage }) => {
    await expect.soft(inventoryPage.buildOptions).toHaveText(["Thief", "Knight", "Mage", "Brigadier"]);
    await expect.soft(inventoryPage.buildSelect).toHaveValue("thief");
  });
});

test.describe("FR-11 Changing build resets the inventory", () => {
  for (const build of buildNames) {
    const next = otherBuild(build);

    test(`resets the slots and bag when switching from ${build} to ${next}`, async ({ browserName, inventoryPage }) => {
      test.fixme("webkit" === browserName, "fixme: drag and drop not working on webkit. See ./notes/issues_found.md");

      await inventoryPage.selectBuild(build);
      await inventoryPage.dragToSlot(inventoryPage.bagItems.first(), "weapon-1");
      await expect(inventoryPage.equippedItems).toHaveCount(1);

      await inventoryPage.selectBuild(next);

      await expect(inventoryPage.equippedItems).toHaveCount(0);
      await expect(inventoryPage.bagItems).toHaveCount(4);
      await expect(inventoryPage.bagItems.nth(0)).toHaveAttribute("data-item-name", builds[next].items[0].name);
      await expect(inventoryPage.bagItems.nth(1)).toHaveAttribute("data-item-name", builds[next].items[1].name);
      await expect(inventoryPage.bagItems.nth(2)).toHaveAttribute("data-item-name", builds[next].items[2].name);
      await expect(inventoryPage.bagItems.nth(3)).toHaveAttribute("data-item-name", builds[next].items[3].name);
    });

    test(`unequips the items when switching back from ${next} to ${build}`, async ({ browserName, inventoryPage }) => {
      test.fixme("webkit" === browserName, "fixme: drag and drop not working on webkit. See ./notes/issues_found.md");

      await inventoryPage.selectBuild(build);
      await inventoryPage.dragToSlot(inventoryPage.bagItems.first(), "weapon-1");
      await inventoryPage.dragToSlot(inventoryPage.bagItems.last(), "armor-1");
      await expect(inventoryPage.equippedItems).toHaveCount(2);

      await inventoryPage.selectBuild(next);
      await inventoryPage.selectBuild(build);

      await expect(inventoryPage.equippedItems).toHaveCount(0);
      await expect(inventoryPage.bagItems).toHaveCount(4);
      await expect(inventoryPage.bagItems.nth(0)).toHaveAttribute("data-item-name", builds[build].items[0].name);
      await expect(inventoryPage.bagItems.nth(1)).toHaveAttribute("data-item-name", builds[build].items[1].name);
      await expect(inventoryPage.bagItems.nth(2)).toHaveAttribute("data-item-name", builds[build].items[2].name);
      await expect(inventoryPage.bagItems.nth(3)).toHaveAttribute("data-item-name", builds[build].items[3].name);
    });
  }
});

test.describe("FR-12 Bag contents", () => {
  for (const build of buildNames) {
    test(`${build} bag has two weapons and two armor pieces`, async ({ inventoryPage }) => {
      const items = builds[build].items;
      await inventoryPage.selectBuild(build);

      await expect(inventoryPage.bagItems).toHaveCount(4);
      await expect.soft(inventoryPage.bagItems.nth(0)).toHaveAttribute("data-item-name", items[0].name);
      await expect.soft(inventoryPage.bagItems.nth(0)).toHaveAttribute("data-item-type", "weapon");
      await expect.soft(inventoryPage.bagItems.nth(1)).toHaveAttribute("data-item-name", items[1].name);
      await expect.soft(inventoryPage.bagItems.nth(1)).toHaveAttribute("data-item-type", "weapon");
      await expect.soft(inventoryPage.bagItems.nth(2)).toHaveAttribute("data-item-name", items[2].name);
      await expect.soft(inventoryPage.bagItems.nth(2)).toHaveAttribute("data-item-type", "armor");
      await expect.soft(inventoryPage.bagItems.nth(3)).toHaveAttribute("data-item-name", items[3].name);
      await expect.soft(inventoryPage.bagItems.nth(3)).toHaveAttribute("data-item-type", "armor");
    });
  }
});

test.describe("FR-13 Equipment slots", () => {
  test("shows two weapon slots and two armor slots", async ({ inventoryPage }) => {
    await expect.soft(inventoryPage.slot("weapon-1")).toBeVisible();
    await expect.soft(inventoryPage.slot("weapon-2")).toBeVisible();
    await expect.soft(inventoryPage.slot("armor-1")).toBeVisible();
    await expect.soft(inventoryPage.slot("armor-2")).toBeVisible();
  });

  for (const build of buildNames) {
    test(`equips all four ${build} items simultaneously`, async ({ browserName, inventoryPage }) => {
      test.fixme("webkit" === browserName, "fixme: drag and drop not working on webkit. See ./notes/issues_found.md");

      const items = builds[build].items;
      await inventoryPage.selectBuild(build);

      await inventoryPage.equipAll();

      await expect(inventoryPage.equippedItems).toHaveCount(4);
      await expect.soft(inventoryPage.equippedItem("weapon-1")).toHaveAttribute("data-item-name", items[0].name);
      await expect.soft(inventoryPage.equippedItem("weapon-2")).toHaveAttribute("data-item-name", items[1].name);
      await expect.soft(inventoryPage.equippedItem("armor-1")).toHaveAttribute("data-item-name", items[2].name);
      await expect.soft(inventoryPage.equippedItem("armor-2")).toHaveAttribute("data-item-name", items[3].name);
    });
  }
});

test.describe("FR-14 Equip a weapon", () => {
  for (const build of buildNames) {
    test(`equips the ${build} weapon in a weapon slot`, async ({ browserName, inventoryPage }) => {
      test.fixme("webkit" === browserName, "fixme: drag and drop not working on webkit. See ./notes/issues_found.md");

      const weapon = builds[build].items[0];
      await inventoryPage.selectBuild(build);

      await inventoryPage.dragToSlot(inventoryPage.bagItems.first(), "weapon-1");

      await expect(inventoryPage.equippedItem("weapon-1")).toHaveAttribute("data-item-name", weapon.name);
      await expect(inventoryPage.bagItems).toHaveCount(3);
      await expect(inventoryPage.toast(`${weapon.label} equipped!`)).toBeVisible();
      await expect(inventoryPage.toast(`${weapon.label} equipped!`)).toHaveAttribute("data-toast-type", "success");
    });

    test(`equips the ${build} upgraded weapon in the second weapon slot`, async ({ browserName, inventoryPage }) => {
      test.fixme("webkit" === browserName, "fixme: drag and drop not working on webkit. See ./notes/issues_found.md");

      const weapon = builds[build].items[1];
      await inventoryPage.selectBuild(build);

      await inventoryPage.dragToSlot(inventoryPage.bagItems.nth(1), "weapon-2");

      await expect(inventoryPage.equippedItem("weapon-2")).toHaveAttribute("data-item-name", weapon.name);
      await expect(inventoryPage.bagItems).toHaveCount(3);
      await expect(inventoryPage.toast(`${weapon.label} equipped!`)).toHaveAttribute("data-toast-type", "success");
    });
  }
});

test.describe("FR-15 Equip an armor piece", () => {
  for (const build of buildNames) {
    test(`equips the ${build} armor in an armor slot`, async ({ browserName, inventoryPage }) => {
      test.fixme("webkit" === browserName, "fixme: drag and drop not working on webkit. See ./notes/issues_found.md");

      const armor = builds[build].items[2];
      await inventoryPage.selectBuild(build);

      await inventoryPage.dragToSlot(inventoryPage.bagItems.nth(2), "armor-1");

      await expect(inventoryPage.equippedItem("armor-1")).toHaveAttribute("data-item-name", armor.name);
      await expect(inventoryPage.bagItems).toHaveCount(3);
      await expect(inventoryPage.toast(`${armor.label} equipped!`)).toBeVisible();
      await expect(inventoryPage.toast(`${armor.label} equipped!`)).toHaveAttribute("data-toast-type", "success");
    });

    test(`equips the ${build} upgraded armor in the second armor slot`, async ({ browserName, inventoryPage }) => {
      test.fixme("webkit" === browserName, "fixme: drag and drop not working on webkit. See ./notes/issues_found.md");

      const armor = builds[build].items[3];
      await inventoryPage.selectBuild(build);

      await inventoryPage.dragToSlot(inventoryPage.bagItems.nth(3), "armor-2");

      await expect(inventoryPage.equippedItem("armor-2")).toHaveAttribute("data-item-name", armor.name);
      await expect(inventoryPage.bagItems).toHaveCount(3);
      await expect(inventoryPage.toast(`${armor.label} equipped!`)).toHaveAttribute("data-toast-type", "success");
    });
  }
});

test.describe("FR-16 Wrong slot type", () => {
  for (const build of buildNames) {
    test(`rejects a ${build} weapon in an armor slot`, async ({ browserName, inventoryPage }) => {
      test.fixme("webkit" === browserName, "fixme: drag and drop not working on webkit. See ./notes/issues_found.md");

      await inventoryPage.selectBuild(build);

      await inventoryPage.dragToSlot(inventoryPage.bagItems.first(), "armor-1");

      const toast = inventoryPage.toast("A weapon cannot be equipped in the armor slot.");
      await expect(toast).toBeVisible();
      await expect(toast).toHaveAttribute("data-toast-type", "error");
      await expect(inventoryPage.bagItems).toHaveCount(4);
      await expect(inventoryPage.equippedItems).toHaveCount(0);
    });

    test(`rejects ${build} armor in a weapon slot`, async ({ browserName, inventoryPage }) => {
      test.fixme("webkit" === browserName, "fixme: drag and drop not working on webkit. See ./notes/issues_found.md");

      await inventoryPage.selectBuild(build);

      await inventoryPage.dragToSlot(inventoryPage.bagItems.nth(2), "weapon-1");

      const toast = inventoryPage.toast("A armor cannot be equipped in the weapon slot.");
      await expect(toast).toBeVisible();
      await expect(toast).toHaveAttribute("data-toast-type", "error");
      await expect(inventoryPage.bagItems).toHaveCount(4);
      await expect(inventoryPage.equippedItems).toHaveCount(0);
    });
  }
});

test.describe("FR-17 Occupied slot", () => {
  for (const build of buildNames) {
    test(`rejects a second ${build} weapon in an occupied weapon slot`, async ({ browserName, inventoryPage }) => {
      test.fixme("webkit" === browserName, "fixme: drag and drop not working on webkit. See ./notes/issues_found.md");

      const weapon = builds[build].items[0];
      await inventoryPage.selectBuild(build);
      await inventoryPage.dragToSlot(inventoryPage.bagItems.first(), "weapon-1");
      await expect(inventoryPage.equippedItem("weapon-1")).toBeVisible();

      await inventoryPage.dragToSlot(inventoryPage.bagItems.first(), "weapon-1");

      const toast = inventoryPage.toast("This slot is already occupied.");
      await expect(toast).toBeVisible();
      await expect(toast).toHaveAttribute("data-toast-type", "error");
      await expect(inventoryPage.bagItems).toHaveCount(3);
      await expect(inventoryPage.equippedItems).toHaveCount(1);
      await expect(inventoryPage.equippedItem("weapon-1")).toHaveAttribute("data-item-name", weapon.name);
    });

    test(`rejects a second ${build} armor in an occupied armor slot`, async ({ browserName, inventoryPage }) => {
      test.fixme("webkit" === browserName, "fixme: drag and drop not working on webkit. See ./notes/issues_found.md");

      const armor = builds[build].items[2];
      await inventoryPage.selectBuild(build);
      await inventoryPage.dragToSlot(inventoryPage.bagItems.nth(2), "armor-1");
      await expect(inventoryPage.equippedItem("armor-1")).toBeVisible();

      await inventoryPage.dragToSlot(inventoryPage.bagItems.last(), "armor-1");

      const toast = inventoryPage.toast("This slot is already occupied.");
      await expect(toast).toBeVisible();
      await expect(toast).toHaveAttribute("data-toast-type", "error");
      await expect(inventoryPage.bagItems).toHaveCount(3);
      await expect(inventoryPage.equippedItems).toHaveCount(1);
      await expect(inventoryPage.equippedItem("armor-1")).toHaveAttribute("data-item-name", armor.name);
    });
  }
});

test.describe("FR-18 All items equipped", () => {
  test("does not show the message while items are in the bag", async ({ inventoryPage }) => {
    await expect(inventoryPage.allEquippedMessage).toBeHidden();
  });

  for (const build of buildNames) {
    test(`shows the message once all ${build} items are equipped`, async ({ browserName, inventoryPage }) => {
      test.fixme("webkit" === browserName, "fixme: drag and drop not working on webkit. See ./notes/issues_found.md");

      await inventoryPage.selectBuild(build);

      await inventoryPage.equipAll();

      await expect(inventoryPage.allEquippedMessage).toBeVisible();
      await expect(inventoryPage.bagItems).toHaveCount(0);
    });
  }
});
