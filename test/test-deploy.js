const { inputToConfig } = require("@ethereum-waffle/compiler");
const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleStorage", function () {
  let simpleStorage, SimpleStoragFactory;
  beforeEach(async function () {
    SimpleStoragFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await SimpleStoragFactory.deploy();
  });
  it("Should start wtih a favorite number of 0", async function () {
    const currentValue = await simpleStorage.retrieve();
    const expectedValue = "0";
    assert.equal(currentValue.toString(), expectedValue);
  });
  it("Should update when we call store", async function () {
    const expectedValue = "7";
    const transcationResponse = await simpleStorage.store(expectedValue);
    await transcationResponse.wait(1);
    const currentValue = await simpleStorage.retrieve();
    assert.equal(currentValue.toString(), expectedValue);
  });
});
