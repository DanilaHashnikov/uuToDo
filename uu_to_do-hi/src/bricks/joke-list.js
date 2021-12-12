//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import Config from "./config/config";
import Joke from "./joke";
//@@viewOff:imports

const JokeList = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "JokeList",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    jokes: UU5.PropTypes.array.isRequired,
    onDetail: UU5.PropTypes.func,
    onUpdate: UU5.PropTypes.func,
    onDelete: UU5.PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    jokes: [],
    onDetail: () => {},
    onUpdate: () => {},
    onDelete: () => {}
  },
  //@@viewOff:defaultProps

  render({ jokes, onDetail, onUpdate, onDelete }) {
    //@@viewOn:render
    if (jokes.length === 0) {
      return <UU5.Common.Error content="No jokes!" />;
    }

    return (
      <UU5.Bricks.Row>
        {jokes.map(joke => (
          <UU5.Bricks.Column key={joke.data.id} colWidth="xs-12 m-6 l-4 xl-3">
            <Joke joke={joke.data} colorSchema="green" onDetail={onDetail} onUpdate={onUpdate} onDelete={onDelete} />
          </UU5.Bricks.Column>
        ))}
        <Joke />
      </UU5.Bricks.Row>
    );
    //@@viewOff:render
  }
});

export default JokeList;
