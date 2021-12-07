"use strict";

const ToDoUseCaseError = require("./to-do-use-case-error.js");
const LIST_ERROR_PREFIX = `${ToDoUseCaseError.ERROR_PREFIX}list/`;

const Create = {
  UC_CODE: `${LIST_ERROR_PREFIX}create/`,

  invalidDtoIn: class extends ToDoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  todoInstanceDoesNotExist: class extends ToDoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}todoInstanceDoesNotExist`;
      this.message = "The application is not in proper state.";
    }
  },

  deadlineDateIsFromThePast: class extends ToDoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}deadlineDateIsFromThePast`;
      this.message = "Deadline date is from the past and therefore cannot be met.";
    }
  },

  listDaoCreateFailed: class extends ToDoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listDaoCreateFailed`;
      this.message = "Creating list by list DAO create failed.";
    }
  },

  listCreateDtoInType: class extends ToDoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}  listCreateDtoInType`;
      this.message = "List create data to input type.";
    }
  },
};

const Get = {
  UC_CODE: `${LIST_ERROR_PREFIX}get/`,

  invalidDtoIn: class extends ToDoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  todoInstanceDoesNotExist: class extends ToDoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}todoInstanceDoesNotExist`;
      this.message = "The application is not in proper state.";
    }
  },

  listDoesNotExist: class extends ToDoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listDoesNotExist`;
      this.message = "List with given id does not exist.";
    }
  },
}

const Update = {
  UC_CODE: `${LIST_ERROR_PREFIX}update/`,

  invalidDtoIn: class extends ToDoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  todoInstanceDoesNotExist: class extends ToDoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}todoInstanceDoesNotExist`;
      this.message = "TodoInstance does not exist.";
    }
  },
  todoInstanceIsNotInProperState: class extends ToDoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}todoInstanceIsNotInProperState`;
      this.message = "The application is not in proper state.";
    }
  },
  deadlineDateIsFromThePast: class extends ToDoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}deadlineDateIsFromThePast`;
      this.message = "Deadline date is from the past and therefore cannot be met.";
    }
  },
  listDaoUpdateFailed: class extends ToDoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listDaoUpdateFailed`;
      this.message = "Update list by list DAO update failed.";
    }
  },
};

const Delete = {
  UC_CODE: `${LIST_ERROR_PREFIX}delete/`,

  invalidDtoIn: class extends ToDoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  listDoesNotExist: class extends ToDoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listDoesNotExist`;
      this.message = "List with given id does not exist.";
    }
  },

  todoInstanceDoesNotExist: class extends ToDoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}todoInstanceDoesNotExist`;
      this.message = "TodoInstance does not exist.DtoIn is not valid.";
    }
  },

  todoInstanceIsNotInProperState: class extends ToDoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}todoInstanceIsNotInProperState`;
      this.message = "The application is not in proper state.";
    }
  },

  listContainsActiveItems: class extends ToDoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}listContainsActiveItems`;
      this.message = "List with active items can not be deleted.";
    }
  },
};

const List = {
  UC_CODE: `${LIST_ERROR_PREFIX}list/`,

  invalidDtoIn: class extends ToDoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.	";
    }
  },

  todoInstanceDoesNotExist: class extends ToDoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}todoInstanceDoesNotExist`;
      this.message = "TodoInstance does not exist.";
    }
  },
  todoInstanceIsNotInProperState: class extends ToDoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}todoInstanceIsNotInProperState`;
      this.message = "The application is not in proper state.";
    }
  },
};

module.exports = {
  List,
  Delete,
  Update,
  Create,
  Get
};
