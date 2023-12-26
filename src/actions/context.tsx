import React from "react";

export const ActionsContext = React.createContext({});
export const useActions = () => React.useContext(ActionsContext);

export const ActionsProvider = ({ children }) => (
  <ActionsContext.Provider value={{}}>{children}</ActionsContext.Provider>
);
