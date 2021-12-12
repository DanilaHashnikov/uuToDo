//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useRef } from "uu5g04-hooks";
import Config from "./config/config";
import JokeList from "../bricks/joke-list";
import JokeProvider from "../bricks/joke-provider";
import JokeCreate from "../bricks/joke-create";
import JokesTitle from "../bricks/jokes-title";
//@@viewOff:imports

const Jokes = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "Jokes",
  //@@viewOff:statics

  render() {
    //@@viewOn:hooks
    const createJokeRef = useRef();
    const updateJokeRef = useRef();
    const deleteJokeRef = useRef();
    //@viewOff:hooks

    //@@viewOn:private
    function showError(content) {
      UU5.Environment.getPage()
        .getAlertBus()
        .addAlert({
          content,
          colorSchema: "red"
        });
    }

    async function handleCreateJoke(joke) {
      try {
        await createJokeRef.current(joke);
      } catch {
        showError(`Creation of ${joke.name} failed!`);
      }
    }

    /* eslint no-unused-vars: "off" */
    async function handleUpdateJoke(joke, values) {
      try {
        await updateJokeRef.current({ id: joke.id, ...values });
      } catch {
        showError(`Update of ${joke.name} failed!`);
      }
    }

    async function handleDeleteJoke(joke) {
      try {
        await deleteJokeRef.current({ id: joke.id });
      } catch {
        showError(`Deletion of ${joke.name} failed!`);
      }
    }
    //@@viewOff:private

    //@@viewOn:render
    function renderLoad() {
      return <UU5.Bricks.Loading />;
    }

    function renderReady(jokes) {
      return (
        <>
          <JokesTitle jokes={jokes} />
          <JokeCreate onCreate={handleCreateJoke} />
          <JokeList jokes={jokes} onDelete={handleDeleteJoke} />
        </>
      );
    }

    function renderError(errorData) {
      switch (errorData.operation) {
        case "load":
        case "loadNext":
        default:
          return <UU5.Bricks.Error content="Error happened!" error={errorData.error} errorData={errorData.data} />;
      }
    }

    return (
      <UU5.Bricks.Container>
        <JokeProvider>
          {({ state, data, errorData, pendingData, handlerMap }) => {
            createJokeRef.current = handlerMap.createJoke;
            updateJokeRef.current = handlerMap.updateJoke;
            deleteJokeRef.current = handlerMap.deleteJoke;

            switch (state) {
              case "pending":
              case "pendingNoData":
                return renderLoad();
              case "error":
              case "errorNoData":
                return renderError(errorData);
              case "itemPending":
              case "ready":
              case "readyNoData":
              default:
                return renderReady(data);
            }
          }}
        </JokeProvider>
      </UU5.Bricks.Container>
    );
    //@@viewOff:render
  }
});

export default Jokes;
