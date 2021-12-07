"use strict";
const ToDoAbl = require("../../abl/to-do-abl.js");

class ToDoController {
  init(ucEnv) {
    return ToDoAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new ToDoController();
