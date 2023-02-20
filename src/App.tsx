import React, { Component, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { fetchAsyncGet } from "./features/legalControlLedger/legalControlLedgerSlice";
import "./App.css";
import LegalControlLedger from "./features/legalControlLedger/legalControlLedger/LegalControlLedger";
import Navi from "./features/navi/Navi";
import Menu from "./features/menu/Menu";
import { menuSelect } from "./features/menu/menuSelectSlice";
import CrudLegalCategory from "./features/legalControlLedger/crudLegalCategory/CrudLegalCategory";
import CrudControlLedger from "./features/legalControlLedger/crudControlLedger/CrudControlLedger";
import { fetchAsyncGetCategory } from "./features/legalControlLedger/crudCategorySlice";

function App() {
  const dispatch = useAppDispatch();
  const menu = useAppSelector(menuSelect);
  let displayComponent = <LegalControlLedger />;

  useEffect(() => {
    dispatch(fetchAsyncGet());
    dispatch(fetchAsyncGetCategory(1));
  }, [dispatch]);

  switch (menu) {
    case "list":
      displayComponent = <LegalControlLedger />;
      break;
    case "crud-category":
      displayComponent = <CrudLegalCategory />;
      break;
    case "crud-detail":
      displayComponent = <CrudControlLedger />;
      break;
    default:
      break;
  }

  return <div className="App">{displayComponent}</div>;
}

export default App;
