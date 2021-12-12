//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useEffect } from "uu5g04-hooks";
import Config from "./config/config";
import Uu5Tiles from "uu5tilesg02";
import {useContextModal} from "./common/modal-manager"

import {useList} from "./context/use-list";

import {ListUpdateForm, ListUpdateHeader, ListUpdateControls} from "./list-update-form/list-update-form"

import ListTile from "./list-tile";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Tiles",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const List = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.object,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {

    const [open, close, showAlert, getConfirmRef] = useContextModal();

    const {data, handlerMap: listHandlerMap} = useList();

    //@@viewOff:hooks

    //@@viewOn:private


    function handleOpenDetailsModal(data) {

      open({
        header: <ListUpdateHeader/>,
        content: <ListUpdateForm data={data} closeModal={close} showAlert={showAlert}/>,
        footer:  <ListUpdateControls />,
      });
    }

    function handleOpenCreateModal(data) {

      open({
        header: <ListUpdateHeader/>,
        content: <ListUpdateForm closeModal={close} showAlert={showAlert} isCreateForm={true} listHandlerMap={listHandlerMap}/>,
        footer:  <ListUpdateControls isCreateForm={true}/>,
      });
    }

    const getActions = () => [
      {
        active: true,
        icon: "mdi-plus-circle",
        content: "Create new list...",
        colorSchema: "green",
        bgStyle: "filled",
        onClick: handleOpenCreateModal,
      },
    ]
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(
      props,
      STATICS
    );

    return currentNestingLevel ? (
      <Uu5Tiles.ControllerProvider
        data={data}
      >
        <Uu5Tiles.ActionBar
          searchable={false}
          actions={getActions()}

        />
        <Uu5Tiles.Grid
          tileMinWidth={200}
          tileMaxWidth={400}
          tileSpacing={8}
          rowSpacing={8}
        >
          <ListTile confirmModal={getConfirmRef} handleOpenDetailsModal={handleOpenDetailsModal}/>


        </Uu5Tiles.Grid>
      </Uu5Tiles.ControllerProvider>
    ) : null;
    //@@viewOff:render
  },
});

export default List;
