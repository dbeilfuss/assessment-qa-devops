const shuffle = require("../src/shuffle");

describe("shuffle should return a shuffled array", () => {
  it("should return an array", () => {
    const result = shuffle([1, 2, 3]);
    expect(Array.isArray(result)).toBe(true);
  });

  it("should return an array with the same length as the input array", () => {
    const originalArray = [1, 2, 3, 4, 5];
    const resultArray = shuffle(originalArray);
    expect(originalArray.length === resultArray.length);
  });

  it("should include all of the items in the original array", () => {
    const originalArray = [1, 2, 3, 4, 5, "a", "b", "c", "d", "e"];
    const resultArray = shuffle(originalArray);
    const everyItemIsIncluded = true;
    originalArray.forEach((item) => {
      if (!resultArray.contains(item)) {
        everyItemIsIncluded = false;
      }
    });
    expect(everyItemIsIncluded === true);
  });

  it("should not return an identical array", () => {
    const originalArray = [1, 2, 3, 4, 5, "a", "b", "c", "d", "e"];
    const resultArray = shuffle(originalArray);
    expect(resultArray !== originalArray);
  });

  it("should shuffle the items randomly", () => {
    const originalArray = [1, 2, 3, 4, 5, "a", "b", "c", "d", "e"];
    const resultArray1 = shuffle(originalArray);
    const resultArray2 = shuffle(originalArray);
    expect(resultArray1 !== resultArray2);
  });
});
