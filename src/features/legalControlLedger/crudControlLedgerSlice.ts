import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import dataJson from "./crudControlLedger.json";

const apiUrl = "http://localhost:3500/api/crudLegalControlLedger";

type APIDATA = typeof dataJson;

type crudControlLedgerState = {
  data: APIDATA;
};

const initialState: crudControlLedgerState = {
  data: dataJson,
};

export const fetchAsyncGetControlLedger = createAsyncThunk(
  "crudControlLedger/get",
  async (page: number) => {
    const { data } = await axios.get<APIDATA>(`${apiUrl}?page=${page}`);
    return { data: data };
  }
);

const crudControlLedgerSlice = createSlice({
  name: "crudControlLedger",
  initialState: initialState,
  reducers: {
    changeControlLedgerCheckbox: (state, action) => {
      const newDetails: typeof state.data.details = [];
      state.data.details.map((detail) => {
        if (action.payload == detail.id) {
          const newRecord = {
            id: detail.id,
            title: detail.title,
            url: detail.url,
            effectivedate: detail.effectivedate,
            category: detail.category,
            valid: detail.valid,
            sortorder: detail.sortorder,
            checkbox: !detail.checkbox,
          };
          newDetails.push(newRecord);
        } else {
          const newRecord = {
            id: detail.id,
            title: detail.title,
            url: detail.url,
            effectivedate: detail.effectivedate,
            category: detail.category,
            valid: detail.valid,
            sortorder: detail.sortorder,
            checkbox: detail.checkbox,
          };
          newDetails.push(newRecord);
        }
        return (state.data.details = [...newDetails]);
      });
    },
    setAllChecked: (state) => {
      const newDetails: typeof state.data.details = [];
      state.data.details.map((detail) => {
        const newDetail = {
          id: detail.id,
          title: detail.title,
          url: detail.url,
          effectivedate: detail.effectivedate,
          category: detail.category,
          valid: detail.valid,
          sortorder: detail.sortorder,
          checkbox: true,
        };
        return newDetails.push(newDetail);
      });
      state.data.details = newDetails;
    },
    setAllUnchecked: (state) => {
      const newDetails: typeof state.data.details = [];
      state.data.details.map((detail) => {
        const newDetail = {
          id: detail.id,
          title: detail.title,
          url: detail.url,
          effectivedate: detail.effectivedate,
          category: detail.category,
          valid: detail.valid,
          sortorder: detail.sortorder,
          checkbox: false,
        };
        return newDetails.push(newDetail);
      });
      state.data.details = newDetails;
    },
    clearInsertModal: (state) => {
      const newModals: typeof state.data.columnTitles = [];
      state.data.columnTitles.map((columnTitle) => {
        const newModal = {
          date: columnTitle.date,
          category: columnTitle.category,
          valid: columnTitle.valid,
          Field: columnTitle.Field,
          value: "",
        };
        return newModals.push(newModal);
      });
      state.data.columnTitles = newModals;
    },
    changeInsertModal: (
      state,
      action: { payload: { value: string; field: string } }
    ) => {
      const newModals: typeof state.data.columnTitles = [];
      state.data.columnTitles.map((columnTitle) => {
        const newModal = {
          date: columnTitle.date,
          category: columnTitle.category,
          valid: columnTitle.valid,
          Field: columnTitle.Field,
          value: columnTitle.value,
        };
        if (action.payload.field === columnTitle.Field) {
          newModal.value = action.payload.value;
        }
        return newModals.push(newModal);
      });
      state.data.columnTitles = newModals;
    },
    changeEditModal: (
      state,
      action: { payload: { value: string; field: string } }
    ) => {
      const newModals: typeof state.data.columnTitlesModal = [];
      state.data.columnTitlesModal.map((columnTitle) => {
        const newModal = {
          date: columnTitle.date,
          category: columnTitle.category,
          valid: columnTitle.valid,
          Field: columnTitle.Field,
          value: columnTitle.value,
        };
        if (action.payload.field === columnTitle.Field) {
          newModal.value = action.payload.value;
        }
        return newModals.push(newModal);
      });
      state.data.columnTitlesModal = newModals;
    },
    setEditModal: (state, action) => {
      let newModals: typeof state.data.columnTitlesModal = [];
      state.data.details.map((detail) => {
        if (action.payload === detail.id) {
          newModals = [
            {
              date: false,
              category: false,
              valid: false,
              Field: "title",
              value: detail.title,
            },
            {
              date: false,
              category: false,
              valid: false,
              Field: "url",
              value: detail.url,
            },
            {
              date: true,
              category: false,
              valid: false,
              Field: "effectivedate",
              value: detail.effectivedate,
            },
            {
              date: false,
              category: true,
              valid: false,
              Field: "category",
              value: String(detail.category),
            },
            {
              date: false,
              category: false,
              valid: true,
              Field: "valid",
              value: String(detail.valid),
            },
            {
              date: false,
              category: false,
              valid: false,
              Field: "sortorder",
              value: String(detail.sortorder),
            },
          ];
        }
        return newModals;
      });
      state.data.columnTitleId = { Field: "id", value: action.payload };
      state.data.columnTitlesModal = newModals;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetControlLedger.fulfilled, (state, action) => {
      return {
        data: action.payload.data,
      };
    });
  },
});

export const {
  changeControlLedgerCheckbox,
  setAllChecked,
  setAllUnchecked,
  clearInsertModal,
  changeInsertModal,
  changeEditModal,
  setEditModal,
} = crudControlLedgerSlice.actions;

export const crudControlLedgerData = (state: RootState) =>
  state.crudControlLedger.data;

export default crudControlLedgerSlice.reducer;
