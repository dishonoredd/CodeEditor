import { useEffect, useState } from "react";
import "./App.css";
import { Message } from "console-feed/lib/definitions/Component";
import { Hook, Unhook } from "console-feed";

import { CodeMirrorSection } from "./components/codemirror/codemirrorSection";
import { Header } from "./components/header/header";

function App() {
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
}

export default App;
