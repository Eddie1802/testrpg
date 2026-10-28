import type { Locator, Page } from "@playwright/test";
import { builds, type BuildName } from "../tests/data/buildtypes";

export class PlayPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly buildSelect: Locator;
  readonly startButton: Locator;
  readonly adventureHeading: Locator;
  readonly clickerButton: Locator;
  readonly clickerMessage: Locator;
  readonly uploaderInput: Locator;
  readonly uploaderMessage: Locator;
  readonly typerInput: Locator;
  readonly typerMessage: Locator;
  readonly sliderInput: Locator;
  readonly sliderMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByRole("textbox", { name: "Character name" });
    this.buildSelect = page.getByRole("combobox", { name: "Build" });
    this.startButton = page.getByRole("button", { name: "Start!" });
    this.adventureHeading = page.getByRole("heading", { name: "Adventure time" });
    this.clickerButton = page.getByRole("button", { name: /^Click me/ });
    this.clickerMessage = page.getByText("Great job! You levelled up");
    this.uploaderInput = page.getByTestId("uploader-input");
    this.uploaderMessage = page.getByText("File selected, level up!");
    this.typerInput = page.getByTestId("adventure-typer").getByRole("textbox");
    this.typerMessage = page.getByText("Dolar sit amet!");
    this.sliderInput = page.getByRole("slider");
    this.sliderMessage = page.getByText("Slid to the next level!");
  }

  async goto() {
    await this.page.goto("/play");
  }

  async selectBuild(build: BuildName) {
    await this.buildSelect.click();
    await this.page.getByRole("option", { name: builds[build].label }).click();
  }

  async startCharacter(name: string, build?: BuildName) {
    await this.nameInput.fill(name);
    if (build) {
      await this.selectBuild(build);
    }
    await this.startButton.click();
  }

  message(text: string) {
    return this.page.getByText(text);
  }

  async clickTaskButton(times: number) {
    for (let i = 0; i < times; i++) {
      await this.clickerButton.click();
    }
  }

  async uploadFile() {
    await this.uploaderInput.setInputFiles({
      name: "test.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("test"),
    });
  }

  toast(message: string) {
    return this.page.getByText(message);
  }

  characterDescription(level: number, build: BuildName) {
    return this.page.getByText(`A level ${level} ${build}`);
  }

  statBar(stat: string) {
    // The stat bars expose no accessible name, so use the data-character-stats hook
    return this.page.locator(`[data-character-stats="${stat}"]`);
  }
}
