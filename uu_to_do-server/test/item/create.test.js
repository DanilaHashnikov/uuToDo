const { TestHelper } = require("uu_appg01_server-test");
const CMD = "item/create";
const ValidateHelper = require("../validate-helper.js");
const PolygonsTestHelper = require("../polygons-test-helper");




afterEach(async () => {
  await TestHelper.dropDatabase();
  await TestHelper.teardown();

})

beforeEach(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  let session = await TestHelper.login("AwidLicenseOwner", false, false);

  let dtoIn = {
    uuAppProfileAuthorities: "urn:uu:GGPLUS4U",
    code: "123",
    name: "aaa",
    description: "...",
  };
  let result = await TestHelper.executePostCommand("sys/uuAppWorkspace/init", dtoIn, session);
});


describe("Testing the item/create...", () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false);
    let list = await TestHelper.executePostCommand("list/create", {"name": "first list", "description" : "description of the first list", "deadline": "2021-12-15"}, session)
    let result = await TestHelper.executePostCommand("item/create", {"listId": list.id, "text": "text of the item 4"}, session);
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.uuAppErrorMap).toEqual({});
  });
  // test("Test - todoInstanceDoesNotExist", async () => {
  //   const filter = `{awid: "${TestHelper.awid}"}`;
  //   const params = `{$set: ${JSON.stringify({ awid: `test` })}}`;
  //   // await TestHelper.executeDbScript(`db.item.findOneAndUpdate(${filter}, ${params});`);
  //   await TestHelper.executePostCommand("item/create", createDtoIn);
  //
  //   let expectedError = {
  //     code: `${CMD}/todoInstanceDoesNotExist`,
  //     message: "TodoInstance does not exist.",
  //   };
  //   let createDtoIn={
  //     listId: '248a8b57058021720e415e7b5',
  //     text: "string(1, 1000).isRequired()",
  //     highPriority: false
  //   }
  //   expect.assertions(ValidateHelper.assertionsCount.errorWithParamMap);
  //   try {
  //     await TestHelper.executePostCommand("item/create", createDtoIn);
  //   } catch (e) {
  //     ValidateHelper.validateError(e, expectedError);
  //   }
  // });
  // test("Test - JokesIsNotInCorrectState", async () => {
  //   let session = await TestHelper.login("Authorities", false, false);
  //   const filter = `{awid: "${TestHelper.awid}"}`;
  //   const params = `{$set: ${JSON.stringify({ state: `test` })}}`;
  //   await TestHelper.executeDbScript(`db.jokesMain.findOneAndUpdate(${filter}, ${params});`);
  //   let expectedError = {
  //     code: `${CMD}/jokesIsNotInCorrectState`,
  //     message: "jokes is not in correct state.",
  //     paramMap: { awid: TestHelper.awid, expectedState: "active" },
  //   };
  //   expect.assertions(3);
  //   try {
  //     await TestHelper.executePostCommand("joke/create", { name: "Joke name" }, session);
  //   } catch (error) {
  //     expect(error.status).toEqual(400);
  //     expect(error.message).toEqual(expectedError.message);
  //
  //     if (error.paramMap && expectedError.paramMap) {
  //       expect(error.paramMap).toEqual(expectedError.paramMap);
  //     }
  //   }
  // });
  // test("Test - joke main does not exist", async () => {
  //   let session = await TestHelper.login("Authorities", false, false);
  //   const filter = `{awid: "${TestHelper.awid}"}`;
  //   const params = `{$set: ${JSON.stringify({ awid: `vfr` })}}`;
  //   await TestHelper.executeDbScript(`db.jokesMain.findOneAndUpdate(${filter}, ${params});`);
  //   let expectedError = {
  //     code: `${CMD}/jokesMainDoesNotExist`,
  //     message: "jokes does not exist",
  //     paramMap: { awid: TestHelper.awid },
  //   };
  //   expect.assertions(3);
  //   try {
  //     await TestHelper.executePostCommand("joke/create", { name: "Joke name" }, session);
  //   } catch (error) {
  //     expect(error.status).toEqual(400);
  //     expect(error.message).toEqual(expectedError.message);
  //
  //     if (error.paramMap && expectedError.paramMap) {
  //       expect(error.paramMap).toEqual(expectedError.paramMap);
  //     }
  //   }
  // });

  test("Test A3 - invalidDtoIn", async () => {
    expect.assertions(ValidateHelper.assertionsCount.invalidDtoIn);
    try {
      await TestHelper.executePostCommand("item/create", { name: true });
    } catch (e) {
      ValidateHelper.validateInvalidDtoIn(e, CMD);
    }
  });
});
