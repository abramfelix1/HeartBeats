import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";

import "./index.css";
import App from "./App";
import configureStore from "./store";
import { restoreCSRF, csrfFetch } from "./store/csrf";
import * as sessionActions from "./store/session";
import { ModalProvider } from "./context/ModalContext";
import { JournalProvider } from "./context/journalContext";
import { PlaylistProvider } from "./context/playlistContext";
import { ErrorProvider } from "./context/ErrorContext";
import { ThemeProvider } from "./context/themeContext";

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

function Root() {
  return (
    <ReduxProvider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <ErrorProvider>
            <JournalProvider>
              <PlaylistProvider>
                <ModalProvider>
                  <App />
                </ModalProvider>
              </PlaylistProvider>
            </JournalProvider>
          </ErrorProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ReduxProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById("root")
);
