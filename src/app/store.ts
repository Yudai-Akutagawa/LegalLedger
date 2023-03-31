import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import menuReducer from "../features/menu/menuSelectSlice";
import legalControlLedgerReducer from "../features/legalControlLedger/legalControlLedgerSlice";
import crudCategoryReducer from "../features/legalControlLedger/crudCategorySlice";
import crudControlLedgerReducer from "../features/legalControlLedger/crudControlLedgerSlice";
import messageReducer from "../features/legalControlLedger/messageSlice";

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    legalControlLedger: legalControlLedgerReducer,
    crudCategory: crudCategoryReducer,
    crudControlLedger: crudControlLedgerReducer,
    message: messageReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
