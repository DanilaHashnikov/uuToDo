//@@viewOn:imports
import "uu5g04-bricks";
import {createComponent, useDataList, useState, useRef, useContext} from "uu5g04-hooks";
import "uu_plus4u5g01-bricks";

import ItemContext from "./context/item-context";

import Calls from "calls";
import Config from "../../bricks/config/config.js";

//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Item",
  //@@viewOff:statics
};


export const ItemLoader = createComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  //@@viewOn:render

  render(props) {

    const dataItemResult = useDataList({
      handlerMap: {
        load: Calls.listItem,
        create: Calls.createItem
      },
      itemHandlerMap: {
        update: Calls.updateItem,
        delete: Calls.deleteItem,
        setFinalState: Calls.setFinalStateItem
      }
    });


    return (
      <ItemContext.Provider value={dataItemResult}>{props.children}</ItemContext.Provider>
    );
  },
  //@@viewOff:render
});

export default ItemLoader;
