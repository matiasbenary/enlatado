import config from "@/config";
import { atom } from "recoil";

const configState = atom({
  key: "configState",
  default: config,
});

export default configState;
