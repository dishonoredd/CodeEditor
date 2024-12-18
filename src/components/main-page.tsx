import { useState, useEffect, useCallback, useRef } from "react";
import { Console, Hook, Unhook } from "console-feed";
import { Message } from "console-feed/lib/definitions/Component";
import css from "/src/styles/code-input.module.css";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { sublime } from "@uiw/codemirror-theme-sublime";
import { Lang } from "./lang";
import { api } from "../api/api";
import { defaultGoValue, defaultValue as defaultJsValue } from "./constants";
import { localStorageProvider } from "../local-storage.lib";
import { Select } from "antd";
import { go } from "@codemirror/lang-go";

export const MainPage = () => {
  const [logs, setLogs] = useState<Message[]>([]);
  const [lang, setLang] = useState<Lang>(Lang.JS);
  const [value, setValue] = useState(
    localStorageProvider.getCode() || defaultJsValue
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const onChange = useCallback((val: string) => {
    setValue(val);
    localStorageProvider.saveCode(val);
  }, []);

  const runCode = () => {
    setLoading(true);
    setLogs([]);

    api
      .runCode({ code: value, language: lang }, error)
      .then((resp) => {
        setLogs([
          { data: [resp.output], id: crypto.randomUUID(), method: "log" },
        ]);
      })
      .catch((resp) => {
        setLogs([
          { data: [resp.error], id: crypto.randomUUID(), method: "error" },
        ]);
      })
      .finally(() => setLoading(false));
  };

  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (myRef.current) {
      myRef.current.scrollTo({
        top: myRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [logs]);

  useEffect(() => {
    const hookedConsole = Hook(
      console,
      (log) => setLogs((currLogs) => [...currLogs, log as Message]),
      false
    );

    return () => {
      Unhook(hookedConsole);
    };
  }, []);

  const languages: Lang[] = [Lang.JS, Lang.GO];

  return (
    <>
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
              setLogs([]);
              if (value === Lang.GO) {
                setValue(defaultGoValue);
              } else {
                setValue(defaultJsValue);
              }
              setLang(value);
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
              setLogs([]);
            }}
          >
            Clear
          </button>
          <label className={css.label}>
            <span className={css.pc}>Enable fake server error</span>
            <span className={css.mobile}>Error</span>
            <input
              type="checkbox"
              checked={error}
              onChange={(ev) => setError(ev.target.checked)}
            />
          </label>
        </div>
      </header>
      <section className={css.mainSection}>
        <CodeMirror
          style={{ fontFamily: "consolas", overflow: "hidden" }}
          height="100%"
          value={value}
          extensions={
            lang === Lang.JS
              ? [javascript({ jsx: true }), EditorView.lineWrapping]
              : [go(), EditorView.lineWrapping]
          }
          onChange={onChange}
          theme={sublime}
        />

        <div className={css.console} ref={myRef}>
          <Console logs={logs} variant="dark" />
        </div>
      </section>
    </>
  );
};
