import Fonselp from "./226/226";

const config = () => {
  const entityConfig = import.meta.env.VITE_APP_ID_ENTITY;

  const base = Fonselp;

  switch (entityConfig) {
    case "226":
      return base;
    default:
      return base;
  }
};

export default config();
