import { useEffect, useState } from "react";
import { Message } from "console-feed/lib/definitions/Component";
import { Hook, Unhook } from "console-feed";
import { Header } from "../header/header";
import { CodeMirrorSection } from "../codemirror/codemirrorSection";

export const MainContainer = () => {
  const [logs, setLogs] = useState<Message[]>([]);

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

  return (
    <>
      <Header setLogs={setLogs} />
      <CodeMirrorSection logs={logs} />
    </>
  );
};
