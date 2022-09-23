import { open } from "@tauri-apps/api/dialog";
import { readBinaryFile } from "@tauri-apps/api/fs";
import React from "react";

import PdfViewerComponent from "./components/PdfViewerComponent";
import styles from "./App.css"

function App() {
  const [fileBuffer, setFileBuffer] = React.useState(null);
  const openFile = async () => {
    try {
      const selectedPath = await open({
        multiple: false,
      });
      if (!selectedPath) return;
      const content = await readBinaryFile(selectedPath);
      setFileBuffer(content.buffer);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="App">
      <form>
        <button type="button" onClick={openFile} className="openButton">
          Open file
        </button>
      </form>
      <div className="PDF-viewer">
        {fileBuffer ? <PdfViewerComponent document={fileBuffer} /> : null}
      </div>
    </div>
  );
}

export default App;
