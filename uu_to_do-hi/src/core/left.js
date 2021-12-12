//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import {createVisualComponent} from "uu5g04-hooks";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";

import ListContext from "../routes/list/context/list-context";
import ListLoader from "../routes/list/list-loader";

import DataListStateResolver from "../routes/list/common/data-list-state-resolver"

import {useContextModal} from "../routes/list/common/modal-manager";
import List from "../routes/list/List";

//@@viewOff:imports

const STATICS = {
  //@@viewOn:static
  displayName: Config.TAG + "Left",
  //@@viewOff:static
};

export const Left = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:hooks

    const {open, close, showAlert, getConfirmRef} = useContextModal();

    //@@viewOff:hooks

    //@@viewOn:private

    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
        <ListLoader>
          <ListContext.Consumer>
            {(dataListResult) => {
              return (
                <DataListStateResolver dataList={dataListResult}>
                  <List/>
                </DataListStateResolver>
              )
            }}
          </ListContext.Consumer>
        </ListLoader>

    );
    //@@viewOff:render
  },
});

export default Left;



