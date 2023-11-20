const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
  await driver.get("http://localhost:8000");
});

afterEach(async () => {
  await driver.quit();
});

describe("Initial Environment", () => {
  test("page loads with title", async () => {
    await driver.wait(until.titleIs("Duel Duo"), 1000);
  });

  test("CSS is Applied", async () => {
    const titleHeader = await driver.findElement(By.id("title"));
    const backgroundColor = await titleHeader.getCssValue("background-color");
    const textAlign = await titleHeader.getCssValue("text-align");

    expect(backgroundColor).toBe("rgba(38, 169, 224, 1)");
    expect(textAlign).toBe("center");
  });
});

describe("Dueling", () => {
  const clickDraw = async () => {
    const drawButton = await driver.findElement(By.id("draw"));
    await drawButton.click();
    await driver.wait(
      until.elementsLocated(By.className("bot-card outline")),
      5000
    );
  };

  const chooseBots = async () => {
    const botButton1 = await driver.findElement(By.className("bot-btn"));
    await botButton1.click();
    const botButton2 = await driver.findElement(By.className("bot-btn"));
    await botButton2.click();
  };

  const duel = async () => {
    const duelButton = await driver.findElement(By.id("duel"));
    await duelButton.click();
  };

  test("Draw Button Populates 5 Bots", async () => {
    await clickDraw();
    const choices = await driver.findElements(By.className("bot-card outline"));
    expect(choices.length).toBe(5);
  });

  // Test Scoreboard 5 Times to allow for Wins and Losses
  for (let i = 0; i < 5; i++) {
    test("Scoreboard Updated Correctly", async () => {
      // Check the Starting Scoreboard
      const startingWins = await driver.findElement(By.id("wins")).getText();
      const startingLosses = await driver
        .findElement(By.id("losses"))
        .getText();

      await clickDraw();
      await chooseBots();
      await duel();

      // Wait for Duel to Finish
      const results = await driver.findElement(By.id("results"));
      await driver.wait(async () => {
        const text = await results.getText();
        return text === "You won!" || text === "You lost!";
      }, 10000);

      // Check the Ending Scoreboard
      const endingWins = await driver.findElement(By.id("wins")).getText();
      const endingLosses = await driver.findElement(By.id("losses")).getText();

      // Compare
      console.log(i + 1, await results.getText());
      if ((await results.getText()) === "You won!") {
        expect(startingWins).not.toBe(endingWins);
        expect(startingLosses).toBe(endingLosses);
      } else {
        expect(startingWins).toBe(endingWins);
        expect(startingLosses).not.toBe(endingLosses);
      }
    });
  }
});
