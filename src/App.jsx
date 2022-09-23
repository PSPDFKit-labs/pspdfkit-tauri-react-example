import { open } from "@tauri-apps/api/dialog";
import { readBinaryFile, writeBinaryFile } from "@tauri-apps/api/fs";
import React from "react";

import PdfViewerComponent from "./components/PdfViewerComponent";
import "./App.css"

function App() {
  const [fileBuffer, setFileBuffer] = React.useState(null);
  const [filePath, setFilePath] = React.useState(null)

  const openFile = async () => {
    try {
      const selectedPath = await open({
        multiple: false,
      });
      if (!selectedPath) return;
      const content = await readBinaryFile(selectedPath);
      setFileBuffer(content.buffer);
      setFilePath(selectedPath)
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveClick = async (buffer) => {
    if(!filePath) {
      return
    }

    await writeBinaryFile(filePath, buffer)
  }

  return (
    <div className="App">
      <form>
        <button type="button" onClick={openFile} className="openButton">
          Open file
        </button>
      </form>
      <div className="PDF-viewer">
        {fileBuffer ? <PdfViewerComponent document={fileBuffer} onSaveClick={handleSaveClick} /> : null}
      </div>
    </div>
  );
}

export default App;
