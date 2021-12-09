//@@viewOn:imports
import UU5 from "uu5g04";
import { createComponent, useState } from "uu5g04-hooks";
import Config from "./config/config";
//@@viewOff:imports

const initialJokes = [
  {
    id: 1,
    name: "Joke 1",
    text: "This is my joke 1...",
    averageRating: 5.0
  },
  {
    id: 2,
    name: "Joke 2",
    text: "This is my joke 2...",
    averageRating: 4.0
  },
  {
    id: 3,
    name: "Joke 3",
    text: "This is my joke 3...",
    averageRating: 3.0
  },
  {
    id: 4,
    name: "Joke 4",
    text: "This is my joke 4...",
    averageRating: 2.0
  },
  {
    id: 5,
    name: "Joke 5",
    text: "This is my joke 5...",
    averageRating: 1.0
  }
];

const JokeProvider = createComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "JokeProvider",
  //@@viewOff:statics

  render({ children }) {
    //@viewOn:hooks
    const [jokes, setJokes] = useState(initialJokes);
    //@viewOff:hooks

    //@@viewOn:private
    function handleCreate(joke) {
      joke.id = UU5.Common.Tools.generateUUID();
      joke.averageRating = Math.round(Math.random() * 5); // <0, 5>
      setJokes(prevJokes => prevJokes.concat([joke]));
    }

    function handleDelete(joke) {
      setJokes(prevJokes => prevJokes.filter(item => item.id !== joke.id));
    }
    //@@viewOff:private

    //@@viewOn:render
    return children({ jokes, handleCreate, handleDelete });
    //@@viewOff:render
  }
});

export default JokeProvider;
