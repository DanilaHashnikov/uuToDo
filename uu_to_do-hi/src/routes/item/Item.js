//@@viewOn:imports
import UU5 from "uu5g04";
import {createVisualComponent, useEffect} from "uu5g04-hooks";
import Config from "./config/config";
import Uu5Tiles from "uu5tilesg02";
import {useContextModal} from "./common/modal-manager"

import {useItem} from "./context/context";
import {useList} from "../list/context/context"

import {ItemUpdateForm, ItemUpdateHeader, ItemUpdateControls} from "./item-update-form/item-update-form"

import ItemTile from "./item-tile";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Item",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const Item = createVisualComponent({
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

    let url = UU5.Common.Url.parse(window.location.href);

    //@@viewOn:hooks
    const [open, close, showAlert, getConfirmRef] = useContextModal();

    const {data, handlerMap: listHandlerMap} = useItem();

    console.log(data);
    useEffect(() => {
      if (props.listId) listHandlerMap.load({listId: props.listId});
    }, [props.listId]);

    //@@viewOff:hooks

    //@@viewOn:private


    function handleOpenDetailsModal(data) {
      open({
        header: <ItemUpdateHeader/>,
        content: <ItemUpdateForm data={data} closeModal={close} showAlert={showAlert}/>,
        footer: <ItemUpdateControls/>,
      });
    }

    function handleOpenCreateModal() {
      open({
        header: <ItemUpdateHeader/>,
        content: <ItemUpdateForm listId={props.listId} closeModal={close} showAlert={showAlert} isCreateForm={true}
                                 listHandlerMap={listHandlerMap}/>,
        footer: <ItemUpdateControls isCreateForm={true}/>,
      });
    }

    function handleCompletedItems() {




    }

    const getActions = () => [
      {
        active: true,
        icon: "mdi-plus-circle",
        content: "Create new item...",
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
        <UU5.Bricks.Container header={props.listName}>
          <Uu5Tiles.Grid
            tileMinWidth={200}
            tileMaxWidth={400}
            tileSpacing={8}
            rowSpacing={8}
          >
            <ItemTile confirmModal={getConfirmRef} handleOpenDetailsModal={handleOpenDetailsModal}/>

          </Uu5Tiles.Grid>
          <UU5.Bricks.Button onClick={()=> handleCompletedItems()}>Show completed item</UU5.Bricks.Button>
        </UU5.Bricks.Container>

      </Uu5Tiles.ControllerProvider>
    ) : null;
    //@@viewOff:render
  },
});

export default Item;
