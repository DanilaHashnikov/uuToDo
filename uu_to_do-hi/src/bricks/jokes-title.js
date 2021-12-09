//@@viewOn:imports
import UU5 from "uu5g04";
import { createComponent, useEffect } from "uu5g04-hooks";
import Config from "./config/config";
//@@viewOff:imports

const JokesTitle = createComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "JokesTitle",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    jokes: UU5.PropTypes.array.isRequired
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    jokes: []
  },
  //@@viewOff:defaultProps

  render({ jokes }) {
    //@@viewOn:hooks

    /* Title */
    useEffect(() => {
      const originalTitle = document.title;
      document.title = `${originalTitle} - ${jokes.length} jokes`;

      return () => (document.title = originalTitle);
    }, [jokes.length]);
    //@@viewOff:hooks

    //@@viewOn:render
    return null;
    //@@viewOff:render
  }
});

export default JokesTitle;
