import Config from "./config/config";

const button = () => Config.Css.css`
  margin-right: 5px;
  margin-top: 5px;
`;
const edit = () => Config.Css.css`
  margin-left: 80px;
`;

export default {
  button,
  edit,
};
