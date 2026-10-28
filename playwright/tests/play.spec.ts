import { expect, test } from "../fixtures/testrpgfixture";
import { builds, type BuildName } from "./data/buildtypes";

const buildNames = Object.keys(builds) as BuildName[];

test.describe("FR-01 Character name and start", () => {
  test("does not start without a name", async ({ playPage }) => {
    await playPage.startButton.click();

    await expect(playPage.message("Name must be at least 3 characters")).toBeVisible();
    await expect(playPage.startButton).toBeVisible();
    await expect(playPage.adventureHeading).toBeHidden();
  });

  test("does not start with a name shorter than 3 characters", async ({ playPage }) => {
    await playPage.startCharacter("ab");

    await expect(playPage.message("Name must be at least 3 characters")).toBeVisible();
    await expect(playPage.adventureHeading).toBeHidden();
  });

  test("does not start with a name longer than 20 characters", async ({ playPage }) => {
    await playPage.startCharacter("a".repeat(21));

    await expect(playPage.message("Name cannot be longer than 20 characters")).toBeVisible();
    await expect(playPage.adventureHeading).toBeHidden();
  });

  for (const name of ["abc", "a".repeat(20)]) {
    test(`starts with a name of ${name.length} characters`, async ({ playPage }) => {
      await playPage.startCharacter(name);

      await expect(playPage.page.getByRole("heading", { name })).toBeVisible();
      await expect(playPage.adventureHeading).toBeVisible();
      await expect(playPage.startButton).toBeHidden();
    });
  }
});

test.describe("FR-02 Build changes stats", () => {
  test("shows thief stats by default", async ({ playPage }) => {
    const { level, stats } = builds.thief;

    await expect(playPage.buildSelect).toHaveText(builds.thief.label);
    await expect(playPage.characterDescription(level, "thief")).toBeVisible();
    await expect(playPage.statBar("Strength")).toHaveText(`Strength${stats.Strength}`);
    await expect(playPage.statBar("Agility")).toHaveText(`Agility${stats.Agility}`);
    await expect(playPage.statBar("Wisdom")).toHaveText(`Wisdom${stats.Wisdom}`);
    await expect(playPage.statBar("Magic")).toHaveText(`Magic${stats.Magic}`);
  });

  // Looping over each buildtype.
  for (const build of buildNames) {
    test(`shows ${build} stats when selected`, async ({ playPage }) => {
      await playPage.selectBuild(build);

      const { level, stats } = builds[build];
      await expect(playPage.characterDescription(level, build)).toBeVisible();
      await expect(playPage.statBar("Strength")).toHaveText(`Strength${stats.Strength}`);
      await expect(playPage.statBar("Agility")).toHaveText(`Agility${stats.Agility}`);
      await expect(playPage.statBar("Wisdom")).toHaveText(`Wisdom${stats.Wisdom}`);
      await expect(playPage.statBar("Magic")).toHaveText(`Magic${stats.Magic}`);
    });

    test(`keeps ${build} stats after starting`, async ({ playPage }) => {
      await playPage.startCharacter("Hero", build);

      const { level, stats } = builds[build];
      await expect(playPage.characterDescription(level, build)).toBeVisible();
      await expect(playPage.statBar("Strength")).toHaveText(`Strength${stats.Strength}`);
      await expect(playPage.statBar("Agility")).toHaveText(`Agility${stats.Agility}`);
      await expect(playPage.statBar("Wisdom")).toHaveText(`Wisdom${stats.Wisdom}`);
      await expect(playPage.statBar("Magic")).toHaveText(`Magic${stats.Magic}`);
    });
  }
});

test.describe("FR-03 Click task", () => {
  for (const build of buildNames) {
    test(`levels up a ${build} on the 5th click`, async ({ playPage }) => {
      await playPage.startCharacter("Hero", build);

      await playPage.clickTaskButton(4);

      await expect(playPage.characterDescription(builds[build].level, build)).toBeVisible();
      await expect(playPage.clickerMessage).toBeHidden();

      await playPage.clickTaskButton(1);

      await expect(playPage.characterDescription(builds[build].level + 1, build)).toBeVisible();
      await expect(playPage.toast("Click challenge complete! +1 Level")).toBeVisible();
      await expect(playPage.toast("Click challenge complete! +1 Level")).toBeHidden();
      await expect(playPage.clickerMessage).toBeVisible();
      await expect(playPage.clickerButton).toBeDisabled();
    });
  }
});

test.describe("FR-04 Upload task", () => {
  for (const build of buildNames) {
    test(`levels up a ${build} after selecting a file`, async ({ playPage }) => {
      await playPage.startCharacter("Hero", build);

      await expect(playPage.uploaderMessage).toBeHidden();

      await playPage.uploadFile();

      await expect(playPage.characterDescription(builds[build].level + 1, build)).toBeVisible();
      await expect(playPage.toast("File received! +1 Level")).toBeVisible();
      await expect(playPage.toast("File received! +1 Level")).toBeHidden();
      await expect(playPage.uploaderMessage).toBeVisible();
      await expect(playPage.uploaderInput).toBeDisabled();
    });
  }
});

test.describe("FR-05 Typer task", () => {
  for (const build of buildNames) {
    test(`levels up a ${build} after typing Lorem Ipsum`, async ({ playPage }) => {
      await playPage.startCharacter("Hero", build);

      await expect(playPage.typerMessage).toBeHidden();

      await playPage.typerInput.fill("Lorem Ipsum");

      await expect(playPage.characterDescription(builds[build].level + 1, build)).toBeVisible();
      await expect(playPage.toast("Spell cast! +1 Level")).toBeVisible();
      await expect(playPage.toast("Spell cast! +1 Level")).toBeHidden();
      await expect(playPage.typerMessage).toBeVisible();
      await expect(playPage.typerInput).toBeDisabled();
    });
  }
});

test.describe("FR-06 Slider task", () => {
  for (const build of buildNames) {
    test(`levels up a ${build} after sliding all the way to the right`, async ({ playPage }) => {
      await playPage.startCharacter("Hero", build);

      await expect(playPage.sliderMessage).toBeHidden();

      await playPage.sliderInput.focus();
      await playPage.sliderInput.press("End");

      await expect(playPage.characterDescription(builds[build].level + 1, build)).toBeVisible();
      await expect(playPage.toast("Balance mastered! +1 Level")).toBeVisible();
      await expect(playPage.toast("Balance mastered! +1 Level")).toBeHidden();
      await expect(playPage.sliderMessage).toBeVisible();
      await expect(playPage.sliderInput).toBeDisabled();
    });
  }
});

test.describe("FR-09 Berserk mode", () => {
  // Only checked for the default build (thief)
  test("maxes the stats of a thief on the next level-up after the easter egg", async ({ playPage }) => {
    await playPage.startCharacter("Hero", "thief");

    await playPage.typerInput.fill("all your base are belong to us");

    await expect(playPage.toast("BERSERK MODE ACTIVATED!")).toBeVisible();

    await playPage.clickTaskButton(5);

    await expect(playPage.characterDescription(builds.thief.level + 1, "thief")).toBeVisible();
    await expect(playPage.statBar("Strength")).toHaveText("Strength10");
    await expect(playPage.statBar("Agility")).toHaveText("Agility10");
    await expect(playPage.statBar("Wisdom")).toHaveText("Wisdom10");
    await expect(playPage.statBar("Magic")).toHaveText("Magic10");
  });
});
