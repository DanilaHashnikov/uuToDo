"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/item-error.js");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}DtoIn contains unsupported keys.`,
  },

  getUnsupportedKeys: {
    code: `${Errors.Get.UC_CODE}DtoIn contains unsupported keys.`,
  },

  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}DtoIn contains unsupported keys.`,
  },

  deleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}DtoIn contains unsupported keys.`,
  },

  itemDoesNotExist: {
    code: `${Errors.Delete.UC_CODE}	Item with given id does not exist.`,
  },
  setFinalStateDoesNotExist: {
    code: `${Errors.SetFinalState.UC_CODE}	Item with given id does not exist.`,
  },
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}	DtoIn contains unsupported keys.`,
  },
};

class ItemAbl {

  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("todoInstance");
    this.itemDao = DaoFactory.getDao("item");
    this.listDao = DaoFactory.getDao("list");
  }

  async list(uri, dtoIn, session, uuAppErrorMap = {}) {


    const awid = uri.getAwid()


    // HDS 1 Validation of dtoIn.
    let validationResult = this.validator.validate("itemListDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.List.invalidDtoIn
    );
    if (!dtoIn.pageInfo) {
      dtoIn.pageInfo = {}
    }
    if (!dtoIn.pageInfo.pageIndex) {
      dtoIn.pageInfo.pageIndex = 0
    }
    if (!dtoIn.pageInfo.pageSize) {
      dtoIn.pageInfo.pageSize = 1000
    }


    // HDS 2 System checks existence and state of the todoInstance uuObject.

    const uuTodosMain = await this.dao.getByAwid(awid)

    if (!uuTodosMain) {
      throw new Errors.List.todoInstanceDoesNotExist({ uuAppErrorMap }, { awid })
    }

    if (uuTodosMain.state !== 'active') {
      throw new Errors.List.todoInstanceIsNotInProperState({ uuAppErrorMap }, { expectedState: "active", awid, currentState: uuTodosMain.state })
    }

    // HDS 3 System loads from uuAppObjectStore basic attributes of all uuObject items by keys given in dtoIn, and saves them to dtoOut.itemList.

    let uuObject = { ...dtoIn, awid }
    if (uuObject.listId && uuObject.state) {

      uuObject = await this.itemDao.listByListIdAndState(uuObject)

    } else if (uuObject.state) {

      uuObject = await this.itemDao.listByState(uuObject)

    } else {

      uuObject = await this.itemDao.list(uuObject)

    }


    // HDS 4 Returns properly filled dtoOut.

    return {
      ...uuObject,
      uuAppErrorMap
    }


  }

  async setFinalState(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    // HDS 1 - Validation of dtoIn.

    const validationResult = this.validator.validate("itemSetFinalStateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.setFinalStateDoesNotExist.code,
      Errors.SetFinalState.invalidDtoIn
    );

    // HDS 2 - existence main dao

    const todoInstance = await this.dao.getByAwid(awid)

    if (!todoInstance) {
      throw new Errors.SetFinalState.todoInstanceDoesNotExist({ uuAppErrorMap }, { awid: awid });
    }

    if (todoInstance.state !== "active") {
      throw new Errors.SetFinalState.todoInstanceIsNotInProperState({ uuAppErrorMap }, { awid: awid, currentState: todoInstance.state, expectedState: "active" });
    }

    // HDS 3

    let item = await this.itemDao.get(awid, dtoIn.id)

    if (!item) {
      throw Errors.SetFinalState.itemDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id })
    }

    if (item.state !== "active") {
      throw Errors.SetFinalState.itemIsNotInProperState({ uuAppErrorMap }, { id: dtoIn.id, currentState: item.state, expectedState: active })
    }

    // HDS 4

    let uuObject = { ...dtoIn, awid }
    item = await this.itemDao.setFinalState(uuObject);

    return {
      ...item,
      uuAppErrorMap
    }

  }

  async delete(uri, dtoIn, getAuthorizationResult, session, uuAppErrorMap = {}) {

    // HDS 1
    const awid = uri.getAwid();

    let validationResult = this.validator.validate("itemDeleteDtoInType", dtoIn);
    // A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.deleteUnsupportedKeys.code,
      Errors.Delete.invalidDtoIn
    );

    // HDS 2

    const todoInstance = await this.dao.getByAwid(awid)

    if (!todoInstance) {
      throw new Errors.Delete.todoInstanceDoesNotExist({ uuAppErrorMap }, { awid: awid });
    }

    if (todoInstance.state !== "active") {
      throw new Errors.Delete.todoInstanceIsNotInProperState({ uuAppErrorMap }, { awid: awid, currentState: todoInstance.state, expectedState: "active" });
    }

    // HDS 3

    let item = await this.itemDao.get(awid, dtoIn.id)

    if (!item) {
      throw Errors.Delete.itemDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id })
    }

    if (item.state == "completed") {
      throw new Errors.Delete.itemIsNotInCorrectState({ uuAppErrorMap },{
        id: dtoIn.id,
        state: item.state,
        expectedStateList: ["active", "cancelled"]
      })
    }

    // HDS 4

    const uuObject = await this.itemDao.remove(item);

    // HDS 5 - return

    return {
      ...uuObject,
      uuAppErrorMap
    }


  }

  async update(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    // HDS 1 - Validation of dtoIn.

    const validationResult = this.validator.validate("itemUpdateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.invalidDtoIn
    );

    // HDS 2 - System checks the existence and state of the todoInstance uuObject.

    const todoInstance = await this.dao.getByAwid(awid)

    if (!todoInstance) {
      throw new Errors.Update.todoInstanceDoesNotExist({ uuAppErrorMap }, { awid: awid });
    }

    if (todoInstance.state !== "active") {
      throw new Errors.Update.todoInstanceIsNotInProperState({ uuAppErrorMap }, { awid: awid, currentState: todoInstance.state, expectedState: "active" });
    }

    // HDS 3 Verifies, that the item exists and is in an active state (using item DAO get with awid and dtoIn.id). The result is saved as "item".

    let item = await this.itemDao.get(awid, dtoIn.id)

    if (!item) {
      throw Errors.Update.itemDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id })
    }

    if (item.state !== "active") {
      throw Errors.Update.itemIsNotInCorrectState({ uuAppErrorMap }, { id: dtoIn.id, currentState: item.state, expectedState: active })
    }

    // HDS 4 - System verifies, that the list entered in dtoIn.listId exists (using list DAO get with awid and dtoIn.listId).

    const uuObject = { ...dtoIn, awid }

    if (dtoIn.listId) {
      const list = await this.listDao.get(awid, dtoIn.listId);

      if (!list) {
        throw new Errors.Update.listDoesNotExist({ uuAppErrorMap }, { id: uuObject.listId });
      }
    }

    // HDS 5 - System updates uuObject item in the uuAppObjectStore

    try {
      item = await this.itemDao.update(uuObject);
    } catch (err) {
      throw new Errors.Update.itemDaoUpdateFailed({ uuAppErrorMap }, err);
    }

    // HDS 5 - return
    return {
      ...item,
      uuAppErrorMap,
    };
  }

  async get(uri, dtoIn, uuAppErrorMap = {}) {

    const awid = uri.getAwid();

    // HDS 1 data validation

    const validationResult = this.validator.validate("itemGetDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.invalidDtoIn
    );

    // HDS 2 check state and existence

    const todoInstance = await this.dao.getByAwid(awid)

    if (!todoInstance) {
      throw new Errors.Get.todoInstanceDoesNotExist({ uuAppErrorMap }, awid);
    }

    if (todoInstance.state !== "active") {
      throw new Errors.Get.todoInstanceIsNotInProperState({ uuAppErrorMap }, { awid: awid, currentState: todoInstance.state, expectedState: "active" });
    }

    // HDS 3

    const item = await this.itemDao.get(awid, dtoIn.id);
    if (!item) {
      throw new Errors.Get.itemDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id })
    }

    // HDS 4
    return {
      uuAppErrorMap,
      ...item
    }

  }

  async create(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();

    // HDS 1 data validation

    const validationResult = this.validator.validate("itemCreateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.invalidDtoIn
    );


    let uuObject = { ...dtoIn, awid };

    if (!uuObject.highPriority) {
      uuObject.highPriority = false;
    }
    // HDS 2 check state and existance

    const todoInstance = await this.dao.getByAwid(awid)

    if (!todoInstance) {
      throw new Errors.Create.todoInstanceDoesNotExist({ uuAppErrorMap }, awid);
    }

    if (todoInstance.state !== "active") {
      throw new Errors.Create.todoInstanceIsNotInProperState({ uuAppErrorMap }, { awid: awid, currentState: todoInstance.state, expectedState: "active" });
    }

    // HDS 3 Expands dtoIn with the key "state: active".

    dtoIn.state = "active";

    // HDS 4 - Verifies, that the list entered in dtoIn.listId exists (using list DAO get with awid and dtoIn.listId).

    const list = this.listDao.get(uuObject.listId);

    if (!list) {
      throw new Errors.Create.listDoesNotExist({ uuAppErrorMap }, { id: uuObject.listId });
    }

    // HDS 5 - System creates uuObject item in uuAppObjectStore (using item DAO create).
    let item = null;
    uuObject = { ...dtoIn, awid };

    try {
      item = await this.itemDao.create(uuObject);
    } catch (err) {
      throw new Errors.Create.itemDaoCreateFailed({ uuAppErrorMap }, err);
    }

    // HDS 6 return the filled dtoOut

    return {
      ...item,
      uuAppErrorMap
    }


  }


}

module.exports = new ItemAbl();
