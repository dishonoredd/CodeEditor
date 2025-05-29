import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import css from "/src/components/codemirror/codemirror.module.css";
import { useAppDispatch, useAppSelector, valueSlice } from "../../store";
import { Lang } from "../lang";
import { javascript } from "@codemirror/lang-javascript";
import { go } from "@codemirror/lang-go";
import { sublime } from "@uiw/codemirror-theme-sublime";
import { Console } from "console-feed";
import { useCallback, useEffect, useRef } from "react";
import { localStorageProvider } from "../../local-storage.lib";
import { Message } from "console-feed/lib/definitions/Component";

type MirrProps = {
  logs: Message[];
};

export const CodeMirrorSection = (props: MirrProps) => {
  const value = useAppSelector((state) => state.valueSlice.value);
  const lang = useAppSelector((state) => state.langSlice.lang);

  const dispatch = useAppDispatch();

  const onChange = useCallback((val: string) => {
    dispatch(valueSlice.actions.setValue(val));
    localStorageProvider.saveCode(val);
  }, []);

  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (myRef.current) {
      myRef.current.scrollTo({
        top: myRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [props.logs]);

  return (
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
        <Console logs={props.logs} variant="dark" />
      </div>
    </section>
  );
};
