//@@viewOn:imports
import "uu5g04-bricks";
import {createComponent, useDataList, useState, useRef, useContext} from "uu5g04-hooks";
import "uu_plus4u5g01-bricks";

import ListContext from "./context/list-context";

import Calls from "calls";
import Config from "../../bricks/config/config.js";
import Uu5Tiles from "uu5tilesg02";
import ListTile from "./list-tile";
import DataListStateResolver from "./common/data-list-state-resolver";
import {ModalManager} from "./common/modal-manager";

//@@viewOff:imports
// const Form = (props) => {
//   return (
//     <UU5.Forms.ContextForm onCancel={props.cancel} onSave={props.save}>
//       <UU5.Forms.Text name="name" label="name" />
//       <UU5.Forms.Text name="desc" label="desc" />
//       <UU5.Forms.Text name="rate" label="rate" />
//     </UU5.Forms.ContextForm>
//   );
// };
const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "List",
  //@@viewOff:statics
};

// const CLASS_NAMES = {
//   welcomeRow: () => Config.Css.css`
//     padding: 56px 0 20px;
//     max-width: 624px;
//     margin: 0 auto;
//     text-align: center;
//
//     ${UU5.Utils.ScreenSize.getMinMediaQueries("s", `text-align: left;`)}
//
//     .uu5-bricks-header {
//       margin-top: 8px;
//     }
//
//     .plus4u5-bricks-user-photo {
//       margin: 0 auto;
//     }
//   `,
// };

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
