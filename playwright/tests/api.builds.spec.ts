import { expect, test } from "../fixtures/testrpgfixture";
import { builds, type BuildName } from "./data/buildtypes";

const buildNames = Object.keys(builds) as BuildName[];
const validStats = { strength: 3, agility: 3, wisdom: 2, magic: 2 };

// Custom builds are in memory and shared by all tests, so every test needs its own name
const uniqueName = () => `api-${crypto.randomUUID().slice(0, 8)}`;

test.describe("FR-19 Get all builds", () => {
  test("returns the built-in builds", async ({ request }) => {
    const response = await request.get("/api/builds");

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Object.keys(body)).toEqual(expect.arrayContaining(buildNames));
  });

  test("includes a custom build that was created", async ({ request }) => {
    const name = uniqueName();
    await request.post("/api/builds", { data: { build: { name, ...validStats } } });

    const response = await request.get("/api/builds");

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect.soft(body[name]).toEqual({ name, ...validStats });
    expect.soft(Object.keys(body)).toEqual(expect.arrayContaining(buildNames));
  });
});

test.describe("FR-20 Get one build", () => {
  for (const build of buildNames) {
    test(`returns only the ${build} build with its stats`, async ({ request }) => {
      const { stats } = builds[build];

      const response = await request.get("/api/builds", { params: { build } });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect.soft(Object.keys(body)).toEqual([build]);
      expect.soft(body[build]).toMatchObject({
        strength: stats.Strength,
        agility: stats.Agility,
        wisdom: stats.Wisdom,
        magic: stats.Magic,
      });
    });
  }

  test("returns only a custom build that was created", async ({ request }) => {
    const name = uniqueName();
    await request.post("/api/builds", { data: { build: { name, ...validStats } } });

    const response = await request.get("/api/builds", { params: { build: name } });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ [name]: { name, ...validStats } });
  });
});

test.describe("FR-21 Get an unknown build", () => {
  test("returns 404 for a build that does not exist", async ({ request }) => {
    const name = uniqueName();

    const response = await request.get("/api/builds", { params: { build: name } });

    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ error: `Build '${name}' not found` });
  });
});

test.describe("FR-22 Create a custom build", () => {
  test("creates a build and returns it", async ({ request }) => {
    const name = uniqueName();

    const response = await request.post("/api/builds", { data: { build: { name, ...validStats } } });

    expect(response.status()).toBe(201);
    expect(await response.json()).toEqual({ build: { name, ...validStats } });
  });

  test("makes the new build available through GET", async ({ request }) => {
    const name = uniqueName();
    await request.post("/api/builds", { data: { build: { name, ...validStats } } });

    const response = await request.get("/api/builds", { params: { build: name } });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ [name]: { name, ...validStats } });
  });

  test("trims and lowercases the name", async ({ request }) => {
    const name = uniqueName();

    const response = await request.post("/api/builds", {
      data: { build: { name: `  ${name.toUpperCase()}  `, ...validStats } },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.build.name).toBe(name);
  });
});

test.describe("FR-23 Missing build object", () => {
  test("rejects an empty body", async ({ request }) => {
    const response = await request.post("/api/builds", { data: {} });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ error: "Request body must contain a 'build' object" });
  });

  test("rejects a body without a build object", async ({ request }) => {
    const response = await request.post("/api/builds", { data: { name: uniqueName(), ...validStats } });

    expect(response.status()).toBe(400);
  });
});

test.describe("FR-24 Invalid name", () => {
  const invalidNames: Array<[string, unknown]> = [
    ["missing", undefined],
    ["empty", ""],
    ["whitespace only", "   "],
    ["a number", 123],
  ];

  for (const [description, name] of invalidNames) {
    test(`rejects a name that is ${description}`, async ({ request }) => {
      const response = await request.post("/api/builds", { data: { build: { name, ...validStats } } });

      expect(response.status()).toBe(400);
      expect(await response.json()).toEqual({ error: "'name' must be a non-empty string" });
    });
  }
});

test.describe("FR-25 Invalid stats", () => {
  const stats = ["strength", "agility", "wisdom", "magic"] as const;
  const invalidValues: Array<[string, unknown]> = [
    ["missing", undefined],
    ["a string", "3"],
    ["a decimal", 1.5],
    ["negative", -1],
    ["greater than 10", 11],
  ];

  for (const stat of stats) {
    for (const [description, value] of invalidValues) {
      test(`rejects ${stat} that is ${description}`, async ({ request }) => {
        const name = uniqueName();

        const response = await request.post("/api/builds", {
          data: { build: { name, ...validStats, [stat]: value } },
        });

        expect(response.status()).toBe(400);
        const lookup = await request.get("/api/builds", { params: { build: name } });
        expect(lookup.status()).toBe(404);
      });
    }
  }

  test("accepts the boundary values 0 and 10", async ({ request }) => {
    const name = uniqueName();
    const boundaryStats = { strength: 10, agility: 0, wisdom: 0, magic: 0 };

    const response = await request.post("/api/builds", { data: { build: { name, ...boundaryStats } } });

    expect(response.status()).toBe(201);
    expect(await response.json()).toEqual({ build: { name, ...boundaryStats } });
  });
});

test.describe("FR-26 Total stats limit", () => {
  test("rejects stats that add up to more than 10", async ({ request }) => {
    const name = uniqueName();

    const response = await request.post("/api/builds", {
      data: { build: { name, strength: 3, agility: 3, wisdom: 3, magic: 2 } },
    });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ error: "The sum of all stats cannot exceed 10" });
    const lookup = await request.get("/api/builds", { params: { build: name } });
    expect(lookup.status()).toBe(404);
  });

  test("accepts stats that add up to exactly 10", async ({ request }) => {
    const name = uniqueName();

    const response = await request.post("/api/builds", {
      data: { build: { name, strength: 3, agility: 3, wisdom: 2, magic: 2 } },
    });

    expect(response.status()).toBe(201);
  });
});

test.describe("FR-27 Unique build names", () => {
  for (const build of buildNames) {
    test(`rejects the built-in name ${build}`, async ({ request }) => {
      const response = await request.post("/api/builds", { data: { build: { name: build, ...validStats } } });

      expect(response.status()).toBe(409);
    });

    test(`rejects the built-in name ${build} in another letter case`, async ({ request }) => {
      const response = await request.post("/api/builds", {
        data: { build: { name: build.toUpperCase(), ...validStats } },
      });

      expect(response.status()).toBe(409);
    });
  }

  test("rejects a custom name that is already taken, in another letter case", async ({ request }) => {
    const name = uniqueName();
    await request.post("/api/builds", { data: { build: { name, ...validStats } } });

    const response = await request.post("/api/builds", {
      data: { build: { name: name.toUpperCase(), strength: 1, agility: 1, wisdom: 1, magic: 1 } },
    });

    expect(response.status()).toBe(409);
    const lookup = await request.get("/api/builds", { params: { build: name } });
    expect(await lookup.json()).toEqual({ [name]: { name, ...validStats } });
  });
});
