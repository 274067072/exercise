import React from "react";
import "./App.scss";
import IndexRouter from "./router/IndexRouter";
import { Provider } from "react-redux";
import store from "./redux";


function App() {
  return (
    <Provider store={store}>
      <IndexRouter />
    </Provider>
  );
}

export default App;
