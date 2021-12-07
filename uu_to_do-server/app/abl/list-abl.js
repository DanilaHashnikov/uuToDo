"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/list-error.js");

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
  listDoesNotExist: {
    code: `${Errors.Delete.UC_CODE}List with given id does not exist.`,
  },
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}DtoIn contains unsupported keys.`,
  },
};

class ListAbl {

  constructor() {
    this.validator = Validator.load();
    this.listDao = DaoFactory.getDao("list");
    this.dao = DaoFactory.getDao("todoInstance");
    this.itemDao = DaoFactory.getDao("item")
  }

  async list(uri, dtoIn, session, uuAppErrorMap = {}) {


    const awid = uri.getAwid()


    // HDS 1 Validation of dtoIn.
    let validationResult = this.validator.validate("listListDtoInType", dtoIn);
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
      throw new Errors.List.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid })
    }

    if (uuTodosMain.state !== 'active') {
      throw new Errors.List.TodoInstanceIsNotInProperState({ uuAppErrorMap }, { expectedState: "active", awid, currentState: uuTodosMain.state })
    }

    // HDS 3 System loads from uuAppObjectStore basic attributes of all uuObject items by keys given in dtoIn, and saves them to dtoOut.itemList.


    let listList = await this.listDao.list(awid, dtoIn.pageInfo)



    // HDS 4 Returns properly filled dtoOut.

    return {
      ...listList,
      uuAppErrorMap
    }


  }

  async delete(uri, dtoIn, session, uuAppErrorMap = {}) {
    const awid = uri.getAwid();

    // HDS 1 Validation of dtoIn.
    let validationResult = this.validator.validate("listDeleteDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.deleteUnsupportedKeys.code,
      Errors.Delete.invalidDtoIn
    );

    if (!dtoIn.forceDelete) {
      dtoIn.forceDelete = false;
    }

    // HDS 2 System checks existence and state of the todoInstance uuObject.

    const uuTodosMain = await this.dao.getByAwid(awid);

    if (!uuTodosMain) {
      throw new Errors.Delete.TodoInstanceDoesNotExist({ uuAppErrorMap }, { awid });
    }

    if (uuTodosMain.state !== "active") {
      throw new Errors.Delete.TodoInstanceIsNotInProperState(
        { uuAppErrorMap },
        { expectedState: "active", awid, currentState: uuTodosMain.state }
      );
    }

    // HDS 3 System gets the uuObject list from the uuAppObjectStore and checks its existence (using list DAO get with awid and dtoIn.id).

    let uuObject = await this.listDao.get(awid, dtoIn.id);
    if (!uuObject) {
      throw new Errors.Delete.listDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id })
    }

    // HDS 4 System loads all active items related to the list (using item DAO listByListAndState, where listId = dtoIn.id and state = active) and verifies that count of active items in the list is 0.
    let filterMap = { awid, listId: dtoIn.id, state: "active" };
    let uuItems = await this.itemDao.listByListIdAndState(filterMap);
    let itemLength = uuItems.itemList.length;
    if (dtoIn.forceDelete === false && itemLength) {
        throw new Errors.Delete.listContainsActiveItems(
          { uuAppErrorMap },
          { id: dtoIn.id, itemList: uuItems.itemList }
        );
    } else {
        await this.itemDao.deleteManyByList(awid, dtoIn.id);
    }

    // HDS 5 System deletes all item uuObjects in the list from uuAppObjectStore (using item DAO deleteManyByListId with awid and dtoIn.id).


    // HDS 6 System deletes list from the uuAppObjectStore (using list DAO delete with awid and dtoIn.id).

    let uuDeleteList = { ...dtoIn, awid };
    await this.listDao.remove(uuDeleteList);

    // HDS 7 Returns properly filled dtoOut.
    return {
      uuAppErrorMap
    };
  }

  async update(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    // HDS 1 - Validation of dtoIn.

    const validationResult = this.validator.validate("listUpdateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.invalidDtoIn
    );

    // HDS 2 - find(check existance) "=> Update
    let uuObject = { ...dtoIn, awid }
    const todoInstance = await this.dao.getByAwid(awid)

    if (!todoInstance) {
      throw new Errors.Update.todoInstanceDoesNotExist({ uuAppErrorMap }, { awid: awid });
    }

    if (todoInstance.state !== "active") {
      throw new Errors.Update.todoInstanceIsNotInProperState({ uuAppErrorMap }, { awid: awid, currentState: todoInstance.state, expectedState: "active" });
    }
    // HDS 3 verifies that date is not from past

    if (uuObject.deadline) {
      const inputDate = new Date(uuObject.deadline);
      const currentDate = new Date();
      if (inputDate.getTime() < currentDate.getTime()) {
        throw new Errors.Update.deadlineDateIsFromThePast({ uuAppErrorMap }, { deadline: uuObject.deadline });
      }
    }

    // HDS 4 - update
    uuObject = { ...dtoIn, awid }

    try {
      uuObject = await this.listDao.update(uuObject);
    } catch (err) {
      throw new Errors.Update.listDaoUpdateFailed({ uuAppErrorMap }, err);
    }

    // HDS 5 - return
    return {
      ...uuObject,
      uuAppErrorMap,
    };
  }

  async create(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();

    // HDS 1 data validation

    const validationResult = this.validator.validate("listCreateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.invalidDtoIn
    );
    // HDS 2 check state and existance

    const todoInstance = await this.dao.getByAwid(awid)

    if (!todoInstance) {
      throw new Errors.Create.todoInstanceDoesNotExist({ uuAppErrorMap }, awid);
    }

    if (todoInstance.state !== "active") {
      throw new Errors.Create.todoInstanceDoesNotExist({ uuAppErrorMap }, { awid: awid, currentState: todoInstance.state, expectedState: "active" });
    }

    // HDS 3 System verifies that the inserted date is not from the past (it cannot be older than today's date).
    let listObject = { ...dtoIn, awid };

    if (listObject.deadline) {
      const inputDate = new Date(listObject.deadline);
      const currentDate = new Date();
      if (inputDate.getTime() < currentDate.getTime()) {
        throw new Errors.Create.deadlineDateIsFromThePast({ uuAppErrorMap }, { deadline: listObject.deadline });
      }
    }

    // HDS 4 - create
    let list = null;
    let uuObject = { ...dtoIn, awid };

    try {
      list = await this.listDao.create(uuObject);
    } catch (err) {
      throw new Errors.Create.listDaoCreateFailed({ uuAppErrorMap }, err);
    }

    // HDS 5 return the fridge

    return {
      ...list,
      uuAppErrorMap
    }


  }

  async get(uri, dtoIn, uuAppErrorMap = {}) {

    const awid = uri.getAwid();

    // HDS 1 data validation

    const validationResult = this.validator.validate("listGetDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.invalidDtoIn
    );

    // HDS 2 check state and existance

    const todoInstance = await this.dao.getByAwid(awid)

    if (!todoInstance) {
      throw new Errors.Get.todoInstanceDoesNotExist({ uuAppErrorMap }, awid);
    }

    if (todoInstance.state !== "active") {
      throw new Errors.Get.todoInstanceDoesNotExist({ uuAppErrorMap }, { awid: awid, currentState: todoInstance.state, expectedState: "active" });
    }

    // HDS 3

    const list = await this.listDao.get(awid, dtoIn.id);
    if (!list) {
      throw new Errors.Get.listDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id })
    }

    // HDS 4
    return {
      uuAppErrorMap,
      ...list
    }

  }


}

module.exports = new ListAbl();
