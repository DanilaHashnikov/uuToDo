// template: UU5Lsi
//@@viewOn:revision
// coded: Veronika Daskaliesku (4155-7760-1), 11.11.2021
//@@viewOff:revision

const Lsi = {
  header: {
    en: "Set State",
  },
  info: {
    en:
      "<uu5string/>On this form you can update your some. For more information see <UU5.Bricks.Link href='%s' target='_blank' content='documentation'/>.",
  },
  submit: (param) => {
    return {
      en: `Submit ${param}`
    }
  },
  cancel: {
    en: "Cancel",
  },
  state: {
    en: "State",
  },
  description: {
    en: "Description",
  },
  saveError: {
    en: "Saving was failed",
  },
  saveSuccess: {
    en: "Saving was completed"
  },
  wrongDescLength: {
    en: "Value should be not longer then 5000 symbols.",
  },
};

//viewOn:exports
export default Lsi;
//viewOff:exports
