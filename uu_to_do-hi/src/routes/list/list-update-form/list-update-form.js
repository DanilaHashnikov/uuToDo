//@@viewOn:imports
import UU5 from "uu5g04";
import {createVisualComponent, useLsiValues, useState, useLoading} from "uu5g04-hooks";
import Config from "../config/config";

import Lsi from "./list-update-form-lsi";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ListUpdateForm",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

const ListUpdateForm = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    const {
      closeModal,
      showAlert,
      data,
      listHandlerMap,
      isCreateForm
    } = props;


    //@@viewOn:hooks
    const inputLsi = useLsiValues(Lsi);
    const [isLoading, setLoading] = useState(false);
    //@@viewOff:hooks


    //@@viewOn:private
    async function handleUpdate(formData) {

      const {values, component} = formData;
      let action;
      let response;


      component.setPending();
      if(isCreateForm) {
        action = listHandlerMap.create
      } else {
        action = data?.handlerMap?.update;
      }

      component.setPending()
      try {
         response = await action(values);
      } catch (e) {
        component.getAlertBus().addAlert({
          content: <UU5.Common.Error content={<UU5.Bricks.Lsi lsi={Lsi.saveError} />} />,
          colorSchema: "danger",
        });
      }

      component.setReady();


      if(response) {
        component.getAlertBus().addAlert({
          content: <UU5.Common.Error content={<UU5.Bricks.Lsi lsi={Lsi.saveSuccess} />} />,
          colorSchema: "success",
        });

        closeModal();
      }
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

    return (
      <UU5.Forms.ContextForm
        onSave={handleUpdate}
        onCancel={closeModal}
        progressIndicator={<UU5.Bricks.Loading/>}
        disabled={isLoading}
      >
        <UU5.Forms.Text
          label="Type your new input"
          name="name"/>
      </UU5.Forms.ContextForm>
    );
    //@@viewOff:render
  },
});

//viewOn:helpers
const ListUpdateHeader = () => {
  return (
    <UU5.Forms.ContextHeader
      content={<UU5.Bricks.Lsi lsi={Lsi.header}/>}
      info={<UU5.Bricks.Lsi lsi={Lsi.info} params={[Config.TEST_TICKET_SET_STATE]}/>}
    />
  );
};

const ListUpdateControls = (isCreateForm) => {
  return (
    <UU5.Forms.ContextControls
      buttonSubmitProps={{content: <UU5.Bricks.Lsi lsi={isCreateForm ? Lsi.submit("Create") : Lsi.submit("Update")}/>}}
      buttonCancelProps={{content: <UU5.Bricks.Lsi lsi={Lsi.cancel}/>}}
    />
  );
};
//viewOff:helpers

//viewOn:exports
export {ListUpdateForm, ListUpdateHeader, ListUpdateControls};
export default ListUpdateForm;
//viewOff:exports
