const { TestHelper } = require("uu_appg01_server-test");
const CMD = "item/get";
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
    code: "12345",
    name: "Alex",
    description: "desc",
  };
  await TestHelper.executePostCommand("sys/uuAppWorkspace/init", dtoIn, session);
});


describe("Testing the item/get...", () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    // let dtoIn  ={
    //     id: "61a76859f95e38332d13a5ba"
    // }
    let help = await TestHelper.executePostCommand('item/create', { text: "Item name", listId: "61a7dcd1a8777f4cb3d2b3bb" });
    let result = await TestHelper.executeGetCommand(CMD, { id: help.id }, session);
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  test("Test - InvalidDtoIn", async () => {
    let session = await TestHelper.login("Authorities", false, false);
    let expectedError = {
      code: `${CMD}/invalidDtoIn`,
      message: "DtoIn is not valid.",
    };
    expect.assertions(2);
    try {
      await TestHelper.executeGetCommand(CMD, { id: true }, session);
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error.message).toEqual(expectedError.message);
    }
  });

  test("Test - todoInstanceDoesNotExist", async () => {
    let session = await TestHelper.login("Authorities", false, false);
    const filter = `{awid: "${TestHelper.awid}"}`;
    const params = `{$set: ${JSON.stringify({ awid: `vfr` })}}`;
    await TestHelper.executeDbScript(`db.todosMain.findOneAndUpdate(${filter}, ${params});`);
    let expectedError = {
      code: `${CMD}/todoInstanceDoesNotExist`,
      message: "TodoInstance does not exist.",
    };
    expect.assertions(2);
    try {
      await TestHelper.executeGetCommand(CMD, { id: "61a75db7a6c0412f13b7f718" }, session);
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error.message).toBeDefined();
    }
  });

  test("Test - item", async () => {
    let session = await TestHelper.login("Authorities", false, false);

    await TestHelper.executeDbScript(`db.todosMain.findOneAndUpdate(${filter}, ${params});`);
    let expectedError = {
      code: `${CMD}/itemDoesNotExist`,
      message: "Item with given id does not exist.",
      paramMap: { id: "61a75db7a6c047912f13b7f718" }
    };
    expect.assertions(2);
    try {
      await TestHelper.executeGetCommand(CMD, { id: "61a75db7a6c047912f13b7f718" }, session);
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error.message).toEqual(expectedError.message);
    }
  });

});
