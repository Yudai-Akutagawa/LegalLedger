import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import dataJson from "./crudCategory.json";

const apiUrl = "https://lcl.akutagawa.blog/lcl/crudLegalCategory";

type APIDATA = typeof dataJson;

type crudCategoryState = {
  data: APIDATA;
};

const initialState: crudCategoryState = {
  data: dataJson,
};

// 非同期処理でCategoryデータを取得
export const fetchAsyncGetCategory = createAsyncThunk(
  "crudCategory/get",
  async (page: number) => {
    const { data } = await axios.get<APIDATA>(`${apiUrl}?page=${page}`); // 取得するページをURLで指定
    return { data: data };
  }
);

//　カテゴリーテーブルメンテナンス用スライス
const crudCategorySlice = createSlice({
  name: "crudCategory",
  initialState: initialState,
  reducers: {
    /**
     * 個別に項目のチェック状態を反転する
     * @reducer
     * @param {string} action.payload - チェック状態を反転する項目のid
     */
    changeCategoryCheckbox: (state, action) => {
      const newDetails: typeof state.data.details = [];
      state.data.details.map((detail) => {
        if (action.payload === detail.id) {
          const newRecord = {
            ...detail,
            checkbox: !detail.checkbox,
          };
          newDetails.push(newRecord);
        } else {
          const newRecord = {
            ...detail,
          };
          newDetails.push(newRecord);
        }
        return (state.data.details = [...newDetails]);
      });
    },
    /**
     * 全ての項目をチェック状態にする
     * @reducer
     */
    setAllChecked: (state) => {
      const newDetails: typeof state.data.details = [];
      state.data.details.map((detail) => {
        const newDetail = {
          ...detail,
          checkbox: true,
        };
        return newDetails.push(newDetail);
      });
      state.data.details = [...newDetails];
    },
    /**
     * 全ての項目を未チェック状態にする
     * @reducer
     */
    setAllUnchecked: (state) => {
      const newDetails: typeof state.data.details = [];
      state.data.details.map((detail) => {
        const newDetail = {
          ...detail,
          checkbox: false,
        };
        return newDetails.push(newDetail);
      });
      state.data.details = [...newDetails];
    },
    /**
     * 追加モーダルの中身を消去（初期化）する
     * @reducer
     */
    clearInsertModal: (state) => {
      const newModals: typeof state.data.columnTitles = [];
      state.data.columnTitles.map((columnTitle) => {
        const newModal = { Field: columnTitle.Field, value: "" };
        return newModals.push(newModal);
      });
      state.data.columnTitles = [...newModals];
    },
    /**
     * 追加モーダルの中身が変更される度に、その値を一時的に保存する
     * @reducer
     * @param {string} action.payload.value - 変更された項目の入力値
     * @param {string} action.payload.field - 変更された項目名
     */
    changeInsertModal: (
      state,
      action: { payload: { value: string; field: string } }
    ) => {
      const { value, field } = action.payload;
      const newModals: typeof state.data.columnTitles = [];
      state.data.columnTitles.map((columnTitle) => {
        const newModal = {
          ...columnTitle,
        };
        if (field === columnTitle.Field) {
          newModal.value = value;
        }
        return newModals.push(newModal);
      });
      state.data.columnTitles = [...newModals];
    },
    /**
     * 編集モーダルの中身が変更される度に、その値を一時的に保存する
     * @reducer
     * @param {string} action.payload.value - 変更された項目の入力値
     * @param {string} action.payload.field - 変更された項目名
     */
    changeEditModal: (
      state,
      action: { payload: { value: string; field: string } }
    ) => {
      const { value, field } = action.payload;
      const newModals: typeof state.data.columnTitlesModal = [];
      state.data.columnTitlesModal.map((columnTitleModal) => {
        const newModal = {
          ...columnTitleModal,
        };
        if (field === columnTitleModal.Field) {
          newModal.value = value;
        }
        return newModals.push(newModal);
      });
      state.data.columnTitlesModal = [...newModals];
    },
    /**
     * 編集モーダルに編集する項目の値をセット
     * @reducer
     * @param {number} action.payload - 編集する項目のid
     */
    setEditModal: (state, action) => {
      let newModals: typeof state.data.columnTitlesModal = [];
      state.data.details.map((detail) => {
        if (action.payload === detail.id) {
          newModals = [
            { Field: "categoryname", value: detail.categoryname },
            { Field: "sortorder", value: String(detail.sortorder) },
            { Field: "color", value: detail.color },
          ];
        }
        return newModals;
      });
      state.data.columnTitleId = { Field: "id", value: action.payload };
      state.data.columnTitlesModal = [...newModals];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetCategory.fulfilled, (state, action) => {
      return {
        data: action.payload.data,
      };
    });
  },
});

export const {
  changeCategoryCheckbox,
  setAllChecked,
  setAllUnchecked,
  clearInsertModal,
  changeInsertModal,
  changeEditModal,
  setEditModal,
} = crudCategorySlice.actions;

export const crudCategoryData = (state: RootState) => state.crudCategory.data;

export default crudCategorySlice.reducer;
