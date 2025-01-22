import { createRoot } from "react-dom/client";
import "./styles/reset.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
