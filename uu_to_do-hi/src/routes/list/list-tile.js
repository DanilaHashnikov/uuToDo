//@@viewOn:imports
import UU5 from "uu5g04";
import {createVisualComponent} from "uu5g04-hooks";
import Config from "./config/config";
import {ModalManager} from "./common/modal-manager";
import Calls from 'calls';
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ListTile",
  nestingLevel: "bigBoxCollection"
  //@@viewOff:statics
};

export const ListTile = createVisualComponent({
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
    const {handleOpenDetailsModal, confirmModal, data: list} = props

    const confirm = props.confirmModal();
    //@@viewOn:private
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
        <UU5.Bricks.Card className="uu5-common-padding-s" colorSchema="green">

          <UU5.Bricks.Text content={list?.data?.name}/>

          <UU5.Bricks.Button onClick={() => props.handleOpenDetailsModal(list)} size="m"
                             colorSchema="green">Update</UU5.Bricks.Button>

          <UU5.Bricks.Button onClick={() => {
            return confirm.open({
                header: <UU5.Bricks.Header>Delete list</UU5.Bricks.Header>,
                content: <UU5.Bricks.Div>Do you really want to delete this list?</UU5.Bricks.Div> ,
                onConfirm: () => list?.handlerMap?.delete({id: list.data.id})
              }
            )
          }
          }>Delete List
          </UU5.Bricks.Button>
          <UU5.Bricks.Button onClick={() => {
            UU5.Environment.setRoute({
              url: {useCase: "item", parameters: {listId: list.data.id, name: list.data.name}}
            })
          }}>Select</UU5.Bricks.Button>
        </UU5.Bricks.Card>
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default ListTile;
