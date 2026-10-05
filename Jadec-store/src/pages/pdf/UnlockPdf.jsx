import { useState } from "react";
import { Unlock } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { PDFDocument } from "pdf-lib";
import ToolPageWrapper from "../../components/ToolPageWrapper";
import FileUploader from "../../components/FileUploader";
import ProcessingOverlay from "../../components/ProcessingOverlay";
import DownloadButton from "../../components/DownloadButton";

export default function UnlockPdf() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleUnlock = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setResult(null);
    setError(null);

    const bytes = await files[0].arrayBuffer();
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const unlockedBytes = await pdf.save();
    const blob = new Blob([unlockedBytes], { type: "application/pdf" });
    setResult(URL.createObjectURL(blob));
    setProcessing(false);
  };

  return (
    <ToolPageWrapper title="Unlock PDF" description="Remove password protection from PDF" icon={Unlock} backPath="/pdf-tools" backLabel="PDF Tools">
      <FileUploader accept=".pdf" onFilesSelected={(f) => { setFiles(f); setResult(null); setError(null); }} label="Drop your protected PDF here" />

      {files.length > 0 && !result && (
        <div className="mt-6 text-center">
          <button onClick={handleUnlock} disabled={processing} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-50">
            Unlock PDF
          </button>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-center">
          <p className="text-destructive font-medium text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-8 text-center space-y-4">
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-emerald-600 dark:text-emerald-400 font-heading font-semibold">PDF unlocked!</p>
          </div>
          <DownloadButton url={result} filename="unlocked.pdf" label="Download Unlocked PDF" />
        </div>
      )}

      <AnimatePresence>{processing && <ProcessingOverlay message="Unlocking your PDF..." />}</AnimatePresence>
    </ToolPageWrapper>
  );
}