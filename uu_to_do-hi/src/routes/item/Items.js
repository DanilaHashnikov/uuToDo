//@@viewOn:imports
import "uu5g04-bricks";
import {createVisualComponent} from "uu5g04-hooks";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";

import ItemContext from "./context/item-context";
import ItemLoader from "./item-loader"

import DataItemStateResolver from "./common/data-item-state-resolver";

import {useContextModal} from "./common/modal-manager";
import Item from "./Item";
import {ModalManager} from "./common/modal-manager";

//@@viewOff:imports

const STATICS = {
  //@@viewOn:static
  displayName: Config.TAG + "Item",
  //@@viewOff:static
};

export const Items = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    const {params} = props;
    //@@viewOn:hooks

    const {open, close, showAlert, getConfirmRef} = useContextModal();

    //@@viewOff:hooks

    //@@viewOn:private

    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <ModalManager>
          <ItemLoader>
            <ItemContext.Consumer>
              {(dataItemResult) => {
                return (
                  <DataItemStateResolver dataItem={dataItemResult}>
                    <Item listName={params.name} listId={params.listId}/>
                  </DataItemStateResolver>
                )
              }}
            </ItemContext.Consumer>
          </ItemLoader>
      </ModalManager>

    );
    //@@viewOff:render
  },
});

export default Items;



