import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import dataJson from "./legalcontrolledger.json";

const apiUrl = "http://localhost:3500/api/list";

type APIDATA = typeof dataJson;

type legalControlLedgerState = {
  data: APIDATA;
};

const initialState: legalControlLedgerState = {
  data: dataJson,
};

// 非同期処理で一覧データを取得
export const fetchAsyncGet = createAsyncThunk(
  "legalControlLedger/get",
  async () => {
    const { data } = await axios.get<APIDATA>(apiUrl);
    return { data: data };
  }
);

// 一覧データスライス
const legalControlLedgerSlice = createSlice({
  name: "legalControlLedger",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGet.fulfilled, (state, action) => {
      return {
        data: action.payload.data,
      };
    });
  },
});

export const legalControlLedgerData = (state: RootState) =>
  state.legalControlLedger.data;

export default legalControlLedgerSlice.reducer;
