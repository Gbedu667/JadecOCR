import { useState } from "react";
import { Lock } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import ToolPageWrapper from "../../components/ToolPageWrapper";
import FileUploader from "../../components/FileUploader";
import ProcessingOverlay from "../../components/ProcessingOverlay";
import DownloadButton from "../../components/DownloadButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProtectPdf() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleProtect = async () => {
    if (files.length === 0 || !password.trim()) return;

    setProcessing(true);
    setResult(null);
    setError("");

    try {
      const file = files[0];

      // The browser cannot reliably add real PDF password encryption
      // without a dedicated PDF encryption library or backend service.
      // For now, keep the original PDF available for download.
      const resultUrl = URL.createObjectURL(file);

      setResult(resultUrl);
    } catch (err) {
      console.error("PDF protection failed:", err);

      setError("Could not process this PDF. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    if (result) {
      URL.revokeObjectURL(result);
    }

    setResult(null);
    setPassword("");
    setError("");
  };

  return (
    <ToolPageWrapper
      title="Protect PDF"
      description="Add password protection to your PDF"
      icon={Lock}
      backPath="/pdf-tools"
      backLabel="PDF Tools"
    >
      <FileUploader
        accept=".pdf"
        onFilesSelected={(selectedFiles) => {
          setFiles(selectedFiles);
          setResult(null);
          setError("");
        }}
        label="Drop your PDF file here"
      />

      {files.length > 0 && !result && !processing && (
        <div className="mt-6 space-y-4 max-w-md mx-auto">
          <div className="space-y-2">
            <Label className="font-heading text-sm">
              Password
            </Label>

            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a strong password"
              className="rounded-xl"
            />
          </div>

          <div className="text-center">
            <button
              onClick={handleProtect}
              disabled={processing || !password.trim()}
              className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
            >
              <Lock className="w-4 h-4 inline mr-2" />
              Protect PDF
            </button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            PDF encryption requires a dedicated encryption library or
            server-side processing. This browser-only version does not
            apply real password encryption yet.
          </p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">
            {error}
          </p>
        </div>
      )}

      {result && (
        <div className="mt-8 text-center space-y-4">
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-amber-600 dark:text-amber-400 font-heading font-semibold">
              PDF processed
            </p>

            <p className="text-sm text-muted-foreground mt-1">
              The PDF is ready for download, but real password encryption
              has not been applied yet.
            </p>
          </div>

          <DownloadButton
            url={result}
            filename="protected.pdf"
            label="Download PDF"
          />

          <button
            onClick={handleReset}
            className="block mx-auto text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Protect another PDF
          </button>
        </div>
      )}

      <AnimatePresence>
        {processing && (
          <ProcessingOverlay message="Processing protection..." />
        )}
      </AnimatePresence>
    </ToolPageWrapper>
  );
}