//@@viewOn:imports
import { createVisualComponent, useScreenSize } from "uu5g04-hooks";
import Config from "./config/config";
import JokeList from "../bricks/joke-list";
import JokeProvider from "../bricks/joke-provider";
import JokeCreate from "../bricks/joke-create";
import JokesTitle from "../bricks/jokes-title.";
//@@viewOff:imports

const Jokes = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "Jokes",
  //@@viewOff:statics

  render() {
    //@@viewOn:render
    return (
      <UU5.Bricks.Container>
        <JokeProvider>
          {({ viewState, jokes, handleCreate, handleDelete }) => {
            return (
              <>
                <JokesTitle jokes={jokes} />
                <JokeCreate onCreate={handleCreate} />
                <JokeList jokes={jokes} onDelete={handleDelete} />
              </>
            );
          }}
        </JokeProvider>
      </UU5.Bricks.Container>
    );
    //@@viewOff:render
  }
});

export default Jokes;
