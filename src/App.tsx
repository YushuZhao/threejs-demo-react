import { useRoutes } from "react-router-dom";

import { routes } from "./router";

export default function APP() {
  const element = useRoutes(routes);
  return <>{element}</>;
}
