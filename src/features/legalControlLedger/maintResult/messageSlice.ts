import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../app/store";
import insertJson from "../crudLegalCategory/insertCategory.json";
import deleteJson from "../crudLegalCategory/deleteCategory.json";
import editJson from "../crudLegalCategory/editCategory.json";
import insertControlLedgerJson from "../crudControlLedger/insertControlLedger.json";
import deleteControlLedgerJson from "../crudControlLedger/deleteControlLedger.json";
import editControlLedgerJson from "../crudControlLedger/editControlLedger.json";
import responseJson from "../maintResult/response.json";

const apiInsertCategoryUrl = "http://localhost:3500/api/insertLegalCategory/";
const apiDeleteCategoryUrl = "http://localhost:3500/api/deleteLegalCategory/";
const apiEditCategoryUrl = "http://localhost:3500/api/editLegalCategory/";

const apiInsertControlLedgerUrl =
  "http://localhost:3500/api/insertLegalControlLedger/";
const apiDeleteControlLedgerUrl =
  "http://localhost:3500/api/deleteLegalControlLedger/";
const apiEditControlLedgerUrl =
  "http://localhost:3500/api/editLegalControlLedger/";

type INSERTDATACATEGORY = typeof insertJson;
type DELETEDATACATEGORY = typeof deleteJson;
type EDITDATACATEGORY = typeof editJson;

type INSERTDATACONTROLLEDGER = typeof insertControlLedgerJson;
type DELETEDATACONTROLLEDGER = typeof deleteControlLedgerJson;
type EDITDATACONTROLLEDGER = typeof editControlLedgerJson;

type RESPONSEDATA = typeof responseJson;

type messageState = {
  data: RESPONSEDATA;
};

const initialState: messageState = {
  data: responseJson,
};

//カテゴリーテーブル追加用非同期関数
export const insertAsyncCategory = createAsyncThunk(
  "category/insert",
  async (insertData: INSERTDATACATEGORY) => {
    const { data } = await axios.post<RESPONSEDATA>(
      `${apiInsertCategoryUrl}`,
      insertData
    );
    return { data: data };
  }
);
//カテゴリーテーブル削除用非同期関数
export const deleteAsyncCategory = createAsyncThunk(
  "category/delete",
  async (deleteData: DELETEDATACATEGORY) => {
    const { data } = await axios.post<RESPONSEDATA>(
      `${apiDeleteCategoryUrl}`,
      deleteData
    );
    return { data: data };
  }
);
//カテゴリーテーブル編集用非同期関数
export const editAsyncCategory = createAsyncThunk(
  "category/edit",
  async (editData: EDITDATACATEGORY) => {
    const { data } = await axios.post<RESPONSEDATA>(
      `${apiEditCategoryUrl}`,
      editData
    );
    return { data: data };
  }
);

//明細テーブル追加用非同期関数
export const insertAsyncControlLedger = createAsyncThunk(
  "ControlLedger/insert",
  async (insertData: INSERTDATACONTROLLEDGER) => {
    const { data } = await axios.post<RESPONSEDATA>(
      `${apiInsertControlLedgerUrl}`,
      insertData
    );
    return { data: data };
  }
);
//明細テーブル削除用非同期関数
export const deleteAsyncControlLedger = createAsyncThunk(
  "ControlLedger/delete",
  async (deleteData: DELETEDATACONTROLLEDGER) => {
    const { data } = await axios.post<RESPONSEDATA>(
      `${apiDeleteControlLedgerUrl}`,
      deleteData
    );
    return { data: data };
  }
);
//明細テーブル編集用非同期関数
export const editAsyncControlLedger = createAsyncThunk(
  "ControlLedger/edit",
  async (editData: EDITDATACONTROLLEDGER) => {
    const { data } = await axios.post<RESPONSEDATA>(
      `${apiEditControlLedgerUrl}`,
      editData
    );
    return { data: data };
  }
);

// 追加削除編集の実行および返却メッセージ格納用スライス
const messageSlice = createSlice({
  name: "message",
  initialState: initialState,
  reducers: {
    messageClear: (state) => {
      state.data.messageText = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(insertAsyncCategory.fulfilled, (state, action) => {
      return {
        data: action.payload.data,
      };
    });
    builder.addCase(deleteAsyncCategory.fulfilled, (state, action) => {
      return {
        data: action.payload.data,
      };
    });
    builder.addCase(editAsyncCategory.fulfilled, (state, action) => {
      return {
        data: action.payload.data,
      };
    });

    builder.addCase(insertAsyncControlLedger.fulfilled, (state, action) => {
      return {
        data: action.payload.data,
      };
    });
    builder.addCase(deleteAsyncControlLedger.fulfilled, (state, action) => {
      return {
        data: action.payload.data,
      };
    });
    builder.addCase(editAsyncControlLedger.fulfilled, (state, action) => {
      return {
        data: action.payload.data,
      };
    });
  },
});
export const { messageClear } = messageSlice.actions;

export const messageData = (state: RootState) => state.message.data;

export default messageSlice.reducer;
