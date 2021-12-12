//@@viewOn:imports
import "uu5g04-bricks";
import {createComponent, useDataList, useState, useRef, useContext} from "uu5g04-hooks";
import "uu_plus4u5g01-bricks";

import ListContext from "./context/list-context";

import Calls from "calls";
import Config from "../../bricks/config/config.js";

//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "List",
  //@@viewOff:statics
};

export const ListLoader = createComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  //@@viewOn:render

  render(props) {

    const dataListResult = useDataList({
      handlerMap: {
        load: Calls.listList,
        create: Calls.createList
      },
      itemHandlerMap: {
        update: Calls.updateList,
        delete: Calls.deleteList
      }
    });

    return (
      <ListContext.Provider value={dataListResult}>{props.children}</ListContext.Provider>
    );
  },
  //@@viewOff:render
});

export default ListLoader;
