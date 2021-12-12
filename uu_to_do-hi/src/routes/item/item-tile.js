//@@viewOn:imports
import UU5 from "uu5g04";
import {createVisualComponent, useState} from "uu5g04-hooks";
import Config from "./config/config";
import {ModalManager} from "./common/modal-manager";
import Calls from 'calls';

import {useItem} from "./context/context"
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ItemTile",
  nestingLevel: "bigBoxCollection"
  //@@viewOff:statics
};

export const ItemTile = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.object,
    handleOpenDetailsModal: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    const {handleOpenDetailsModal, confirmModal, data: item} = props

    console.log("***", item);

    const confirm = props.confirmModal();
    let [useCheckBoxState, setCheckBoxState] = useState(item.data.state === "completed");
    let [useForceDeleteState, setForceDeleteState] = useState(false)

    //@@viewOn:private
    function handleCheckBoxState(id) {
      setCheckBoxState(true);
      console.log(id);
      item.handlerMap.setFinalState({id, state: "completed"});

    }

    async function handleDeleteList() {
      // if(useCheckBoxState) {}
      await item?.handlerMap?.delete({id: item.data.id, forceDelete: useCheckBoxState})
    }
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
      <div {...attrs}>
        <UU5.Bricks.Card className="uu5-common-padding-s" colorSchema="green" disabled={item.data.state === 'completed'}>

          <UU5.Bricks.Text content={item?.data?.text}/>

          <UU5.Bricks.Button onClick={() => props.handleOpenDetailsModal(item)} size="m"
                             colorSchema="green">Update</UU5.Bricks.Button>

          <UU5.Bricks.Button onClick={() => {
            return confirm.open({
                header: <UU5.Bricks.Header>Delete item</UU5.Bricks.Header>,
                content: <UU5.Bricks.Div>Do you really want to delete this item?</UU5.Bricks.Div>,
                onConfirm: handleDeleteList
              }
            )
          }

          }>Delete Item
          </UU5.Bricks.Button>
          <UU5.Bricks.Text content="Case is done"/>
          <UU5.Forms.Checkbox
            value={useCheckBoxState}
            size="xl"
            onChange={()=> handleCheckBoxState(item.data.id)}
          />
        </UU5.Bricks.Card>
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default ItemTile;
