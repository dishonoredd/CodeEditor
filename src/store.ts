import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { Lang } from "./constants/lang";
import { localStorageProvider } from "./local-storage.lib";
import { defaultValue } from "./constants/constants";

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

const initialStateLang = {
  lang: Lang.JS,
};

const initialStateValue = {
  value: localStorageProvider.getCode() || defaultValue,
};

export const langSlice = createSlice({
  name: "lang",
  initialState: initialStateLang,
  reducers: {
    switchLang: (state, action: PayloadAction<Lang>) => {
      state.lang = action.payload;
    },
  },
});

export const valueSlice = createSlice({
  name: "value",
  initialState: initialStateValue,
  reducers: {
    setValue: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const store = configureStore({
  reducer: {
    langSlice: langSlice.reducer,
    valueSlice: valueSlice.reducer,
  },
});
