"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ListMongo extends UuObjectDao {

  async createSchema() {
    await super.createIndex({ awid: 1 }, { unique: 1});
  }

  async get(awid, id) {
    let filter = {
      awid: awid,
      id: id,
    };
    return await super.findOne(filter);
  }

  async update(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    console.log(filter, uuObject);
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }


  async getByAwid(awid) {
    let filter = {
      awid,
    };
    return await super.findOne(filter);
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async remove(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.deleteOne(filter);
  }

  async list(awid, pageInfo) {
    return await super.find({awid}, pageInfo)
  }
}

module.exports = ListMongo;


