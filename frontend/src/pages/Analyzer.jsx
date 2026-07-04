import { useState } from "react";
import {
  BookOpenText,
  Bug,
  Sparkles,
  FlaskConical,
  Play,
  CheckCircle,
} from "lucide-react";

import { CODE_TEMPLATES } from "../utils/codeTemplates";

import AppLayout from "../components/common/AppLayout";
import CodeEditor from "../components/analyzer/CodeEditor";
import ResultPanel from "../components/analyzer/ResultPanel";
import Button from "../components/common/Button";
import { useToast } from "../components/common/Toast";
import { analyzeCodeRequest } from "../services/api";

import "./Analyzer.css";

const OPTIONS = [
  { id: "explain", label: "Explain Code", icon: BookOpenText },
  { id: "bugs", label: "Find Bugs", icon: Bug },
  { id: "optimize", label: "Optimize Code", icon: Sparkles },
  { id: "tests", label: "Generate Tests", icon: FlaskConical },
];

export default function Analyzer() {
  const [language, setLanguage] = useState("Java");

  const [code, setCode] = useState(CODE_TEMPLATES["Java"]);

  const [fileName, setFileName] = useState("");

  const [selected, setSelected] = useState(["explain", "bugs"]);

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const [activeTab, setActiveTab] = useState("explain");

  const [savedInfo, setSavedInfo] = useState(false);

  const { showToast } = useToast();

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);

    setCode(CODE_TEMPLATES[newLanguage] || "// Start writing your code...");

    setFileName("");
  };

  const toggleOption = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const runAnalysis = async () => {
    if (!code.trim()) {
      return showToast("Paste or upload some code first.", "error");
    }

    setLoading(true);
    setResult(null);
    setSavedInfo(false);

    try {
      const data = await analyzeCodeRequest({
        code,
        language,
        options: selected,
      });

      setResult(data);
      setActiveTab(selected[0] || "explain");

      // ✅ show auto-save info
      setSavedInfo(true);

      showToast("Analysis completed & saved automatically.", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Code Analyzer">
      <div className="analyzer-toolbar glass">
        <p className="analyzer-toolbar-label">Run:</p>

        <div className="analyzer-options">
          {OPTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`analyzer-chip ${
                selected.includes(id) ? "analyzer-chip-active" : ""
              }`}
              onClick={() => toggleOption(id)}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <Button icon={Play} loading={loading} onClick={runAnalysis}>
          Run Analysis
        </Button>
      </div>

      {/* ✅ Auto-saved message */}
      {savedInfo && (
        <div className="analysis-saved-card">
          <CheckCircle size={18} />
          <p>This analysis has been automatically saved to your history.</p>
        </div>
      )}

      <div className="analyzer-grid">
        <CodeEditor
          code={code}
          setCode={setCode}
          language={language}
          setLanguage={handleLanguageChange}
          fileName={fileName}
          setFileName={setFileName}
        />

        <ResultPanel
          loading={loading}
          result={result}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </AppLayout>
  );
}
