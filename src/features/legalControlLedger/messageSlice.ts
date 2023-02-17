import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import insertJson from "./crudLegalCategory/insertCategory.json";
import deleteJson from "./crudLegalCategory/deleteCategory.json";
import editJson from "./crudLegalCategory/editCategory.json";
import responseJson from "./crudLegalCategory/response.json";

const apiInsertCategoryUrl = "http://localhost:3500/api/insertLegalCategory/";
const apiDeleteCategoryUrl = "http://localhost:3500/api/deleteLegalCategory/";
const apiEditCategoryUrl = "http://localhost:3500/api/editLegalCategory/";

type INSERTDATACATEGORY = typeof insertJson;
type DELETEDATACATEGORY = typeof deleteJson;
type EDITDATACATEGORY = typeof editJson;
type RESPONSEDATA = typeof responseJson;

type messageState = {
  data: RESPONSEDATA;
};

const initialState: messageState = {
  data: responseJson,
};

//追加用非同期関数の見本 axios.postを使う axios.postの第2引数に、非同期関数の引数に設定した追加用データを設定する
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
  },
});
export const { messageClear } = messageSlice.actions;

export const messageData = (state: RootState) => state.message.data;

export default messageSlice.reducer;
