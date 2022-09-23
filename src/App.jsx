import { open } from "@tauri-apps/api/dialog";
import { readBinaryFile, writeBinaryFile } from "@tauri-apps/api/fs";
import { listen } from "@tauri-apps/api/event";
import React from "react";

import PdfViewerComponent from "./components/PdfViewerComponent";
import "./App.css";
import { useEffect } from "react";

const STATES = {
  IDLE: "IDLE",
  OPENING_FILE: "OPENING_FILE",
  EDITING_FILE: "EDITING_FILE",
  SAVING_FILE: "SAVING_FILE",
};

function App() {
  const [fileBuffer, setFileBuffer] = React.useState(null);
  const [filePath, setFilePath] = React.useState(null);
  const pspdfkitInstance = React.useRef(null);
  const currentState = React.useRef(STATES.IDLE);

  useEffect(() => {
    const openFile = async () => {
      try {
        const selectedPath = await open({
          multiple: false,
        });
        if (!selectedPath) return;
        const content = await readBinaryFile(selectedPath);
        setFileBuffer(content.buffer);
        setFilePath(selectedPath);
        currentState.current = STATES.EDITING_FILE;
      } catch (err) {
        console.error(err);
        currentState.current = STATES.IDLE;
      }
    };

    const saveFile = async () => {
      console.log(
        "Save file activated: ",
        filePath,
        " ",
        pspdfkitInstance.current
      );
      if (!filePath || !pspdfkitInstance.current) {
        currentState.current = STATES.EDITING_FILE;
        return;
      }

      try {
        const buffer = await pspdfkitInstance.current.exportPDF();
        await writeBinaryFile(filePath, buffer);
        currentState.current = STATES.EDITING_FILE;
      } catch (error) {
        currentState.current = STATES.EDITING_FILE;
      }
    };

    listen("menu-event", (e) => {
      if (
        e.payload === "open-event" &&
        [STATES.IDLE, STATES.EDITING_FILE].includes(currentState.current)
      ) {
        currentState.current = STATES.OPENING_FILE;
        openFile();
      } else if (
        e.payload === "save-event" &&
        currentState.current === STATES.EDITING_FILE
      ) {
        currentState.current = STATES.SAVING_FILE;
        saveFile();
      }
    });
  }, [currentState, filePath]);

  const handleInstanceSet = React.useCallback((newInstance) => {
    pspdfkitInstance.current = newInstance;
  });

  return (
    <div className="App">
      <div className="PDF-viewer">
        {fileBuffer ? (
          <PdfViewerComponent
            document={fileBuffer}
            onInstance={handleInstanceSet}
          />
        ) : null}
      </div>
    </div>
  );
}

export default App;
