const { TestHelper } = require("uu_appg01_server-test");
const PolygonsTestHelper = require("../polygons-test-helper.js");
const ValidateHelper = require("../validate-helper.js");
const CMD = "item/delete";
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


describe("Testing the item/delete...", () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);

    let help = await TestHelper.executePostCommand('item/create', { text: "Item name", listId: "61a7dcd1a8777f4cb3d2b3bb" });
    let result = await TestHelper.executePostCommand('item/delete', { text: "Item name 2", id: help.id });
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  test("unsupportedKeys ", async () => {
    let createDtoIn = PolygonsTestHelper.dtoIn.hexagon.create;
    let hexagon = await TestHelper.executePostCommand("item/create", { ...createDtoIn });
    await TestHelper.executePostCommand("item/setFinalState", {
      id: "61a780e87c413b0da0173ed0",
      state: "completed" });

    let expectedWarning = {
      code: `${CMD}/unsupportedKeys`,
      message: "DtoIn contains unsupported keys.",
    };

    const response = await TestHelper.executePostCommand("item/delete", {
      code: hexagon.code,
    });

    ValidateHelper.validateUnsupportedKeysWarning(response, expectedWarning);
    ValidateHelper.validateBaseObjectData(response);
    expect(response.id).toBeDefined();
  });

});
