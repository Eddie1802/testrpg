# Steps

## Table of Contents

1. [Explore assingment](#explore-assingment)
2. [Explore app](#explore-app)
3. [Gather functional requirements and acceptance criteria](#gather-functional-requirements-and-acceptance-criteria)
4. [Setup VS Code workspace](#setup-vs-code-workspace)
5. [Setup Playwright](#setup-playwright)
6. [Setup Claude](#setup-claude)
7. [Create tests](#create-tests)
8. [Create github action](create-github-action)

## Explore assingment

- Create working test automation poc
  - Run: every test case you've created must be executable
  - Project should be transferable

- Present strategy
  - Code quality: which standards do you apply?
  - Structure of your code/project
  - Being able to explain why you made certain choices
  - What next steps have you thought of to further improve or extend your project?

## Explore app

- Manual exporation of the app and github repo
- Information on Pages, API, Acceptance criteria, TA hooks and Deployment lives in [Main README](../../README.md)

## Gather functional requirements and acceptance criteria

- [Requirements](requirements.md)

## Setup VS Code workspace

- Fork repo to personal github
- Clone repo in VS Code
- setup pnpm, install dependencies, first local run of app

## Setup Playwright

- Install Playwright in ./playwright
- Playwright config (keep chromium, firefox and webkit for now, add webserver property)
- Check that Playwright can open testrpg in the browsers

## Setup Claude

- init claude
- configure [CLAUDE.md](../CLAUDE.md) (requirements location)
- Create playwright test writing skill
  - Best practices
  - Locator strategy (user-facing attributes first)
  - Using pageobjects as fixtures

## Create tests

- /play tests
- /inventory tests
- /api/builds tests

## Create github action

- run on
