import { Select } from "antd";
import css from "/src/components/header/header.module.css";
import { useState } from "react";

import { api } from "../../api/api";

import { Message } from "console-feed/lib/definitions/Component";
import { defaultGoValue, defaultValue } from "../../constants/constants";
import { languages } from "../../constants/languages";
import {
  langSlice,
  useAppDispatch,
  useAppSelector,
  valueSlice,
} from "../../store";
import { Lang } from "../lang";

type HeaderProps = {
  setLogs: (arr: Message[]) => void;
};

export const Header = (props: HeaderProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const lang = useAppSelector((state) => state.langSlice.lang);
  const value = useAppSelector((state) => state.valueSlice.value);

  const dispatch = useAppDispatch();

  const runCode = () => {
    setLoading(true);
    props.setLogs([]);

    api
      .runCode({ code: value, language: lang }, error)
      .then((resp) => {
        props.setLogs([
          { data: [resp.output], id: crypto.randomUUID(), method: "log" },
        ]);
      })
      .catch((resp) => {
        props.setLogs([
          { data: [resp.error], id: crypto.randomUUID(), method: "error" },
        ]);
      })
      .finally(() => setLoading(false));
  };

  return (
    <header className={css.header}>
      <div className={css.buttons}>
        <button
          className={css.btn}
          disabled={loading}
          onClick={() => runCode()}
        >
          {loading ? "Loading..." : "Run Code"}
        </button>
        <Select
          defaultValue={Lang.JS}
          value={lang}
          placeholder="Language"
          onChange={(value: Lang) => {
            props.setLogs([]);
            if (value === Lang.GO) {
              dispatch(valueSlice.actions.setValue(defaultGoValue));
            } else {
              dispatch(valueSlice.actions.setValue(defaultValue));
            }

            dispatch(langSlice.actions.switchLang(value));
          }}
          options={languages.map((lang) => {
            return {
              value: lang,
              label: lang,
            };
          })}
        ></Select>
        <button
          className={css.btn}
          onClick={() => {
            props.setLogs([]);
          }}
        >
          Clear
        </button>
        {lang === Lang.GO && (
          <label className={css.label}>
            <span className={css.pc}>Enable fake server error</span>
            <span className={css.mobile}>Error</span>
            <input
              type="checkbox"
              checked={error}
              onChange={(ev) => setError(ev.target.checked)}
            />
          </label>
        )}
      </div>
    </header>
  );
};
