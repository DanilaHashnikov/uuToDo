import Config from "./config/config";

const button = () => Config.Css.css`
  margin-right: 5px;
  margin-top: 5px;
`;
const checkBox = () => Config.Css.css`
  margin: 0 0 0 250px;
`;

export default {
  button,
  checkBox
};
