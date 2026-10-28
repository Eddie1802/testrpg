import type { Locator, Page } from "@playwright/test";
import { builds, type BuildName } from "../tests/data/buildtypes";

export type SlotId = "weapon-1" | "weapon-2" | "armor-1" | "armor-2";

export class InventoryPage {
  readonly page: Page;
  readonly buildSelect: Locator;
  readonly buildOptions: Locator;
  readonly bag: Locator;
  readonly bagItems: Locator;
  readonly allEquippedMessage: Locator;
  readonly equippedItems: Locator;
  readonly toasts: Locator;

  constructor(page: Page) {
    this.page = page;
    this.buildSelect = page.getByRole("combobox", { name: "Build" });
    this.buildOptions = this.buildSelect.getByRole("option");
    this.bag = page.getByTestId("inventory-bag");
    this.bagItems = this.bag.getByTestId("inventory-item");
    this.allEquippedMessage = this.bag.getByText("All items equipped");
    this.equippedItems = page.getByTestId("equipped-item");
    this.toasts = page.getByTestId("toast");
  }

  async goto() {
    await this.page.goto("/inventory");
  }

  async selectBuild(build: BuildName) {
    await this.buildSelect.selectOption({ label: builds[build].label });
  }

  slot(slotId: SlotId) {
    return this.page.getByTestId(`inventory-slot-${slotId}`);
  }

  equippedItem(slotId: SlotId) {
    return this.slot(slotId).getByTestId("equipped-item");
  }

  toast(message: string) {
    return this.toasts.filter({ hasText: message });
  }

  async dragToSlot(item: Locator, slotId: SlotId) {
    await item.dragTo(this.slot(slotId));
  }

  // The bag keeps its order (weapons first), so the first item is always the next one to equip
  async equipAll() {
    const slotIds: SlotId[] = ["weapon-1", "weapon-2", "armor-1", "armor-2"];
    for (const slotId of slotIds) {
      await this.dragToSlot(this.bagItems.first(), slotId);
    }
  }
}
