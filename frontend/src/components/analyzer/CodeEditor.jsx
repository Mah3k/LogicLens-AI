import { useRef } from "react";
import { UploadCloud, FileCode2 } from "lucide-react";
import { CODE_TEMPLATES } from "../../utils/CodeTemplates";
import "./CodeEditor.css";

const LANGUAGES = [
  "Java",
  "Python",
  "JavaScript",
  "C",
  "C++",
  "Go",
  "SQL",
  "HTML",
  "CSS",
];

export default function CodeEditor({
  code,
  setCode,
  language,
  setLanguage,
  fileName,
  setFileName,
}) {
  const fileInputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (event) => {
      setCode(event.target.result);
    };

    reader.readAsText(file);
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;

    setLanguage(newLanguage);

    // Load starter template
    setCode(
      CODE_TEMPLATES[newLanguage] ||
        "// Start writing your code here..."
    );

    // Clear uploaded filename
    setFileName("");
  };

  const lines = code.split("\n");

  return (
    <div className="editor glass">
      <div className="editor-bar">
        <div className="editor-dots">
          <span />
          <span />
          <span />
        </div>

        <div className="editor-bar-right">
          <select
            className="editor-lang"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="editor-upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud size={14} />
            Upload
          </button>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleFile}
            accept=".java,.py,.js,.c,.cpp,.go,.sql,.html,.css,.txt"
          />
        </div>
      </div>

      {fileName && (
        <div className="editor-filename">
          <FileCode2 size={14} />
          <span>{fileName}</span>
        </div>
      )}

      <div className="editor-body">
        <div className="editor-gutter">
          {lines.map((_, index) => (
            <div key={index}>{index + 1}</div>
          ))}
        </div>

        <textarea
          className="editor-textarea mono"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write, paste or upload your source code..."
          spellCheck={false}
        />
      </div>
    </div>
  );
}