import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import crudCategoryReducer from "../features/legalControlLedger/crudCategorySlice";
import legalControlLedgerReducer from "../features/legalControlLedger/legalControlLedgerSlice";
import messageReducer from "../features/legalControlLedger/messageSlice";
import menuReducer from "../features/menu/menuSelectSlice";

export const store = configureStore({
  reducer: {
    legalControlLedger: legalControlLedgerReducer,
    menu: menuReducer,
    crudCategory: crudCategoryReducer,
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
