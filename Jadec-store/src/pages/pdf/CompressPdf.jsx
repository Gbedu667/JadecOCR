import { useState } from "react";
import { Minimize2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { PDFDocument } from "pdf-lib";
import ToolPageWrapper from "../../components/ToolPageWrapper";
import FileUploader from "../../components/FileUploader";
import ProcessingOverlay from "../../components/ProcessingOverlay";
import DownloadButton from "../../components/DownloadButton";

export default function CompressPdf() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);

  const handleCompress = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setResult(null);

    const originalSize = files[0].size;
    const bytes = await files[0].arrayBuffer();
    const pdf = await PDFDocument.load(bytes);

    // Re-save the PDF which strips unused objects and optimizes structure
    const compressedBytes = await pdf.save({ useObjectStreams: true });
    const blob = new Blob([compressedBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const newSize = compressedBytes.length;
    const reduction = Math.max(0, Math.round((1 - newSize / originalSize) * 100));

    setStats({ original: originalSize, compressed: newSize, reduction });
    setResult(url);
    setProcessing(false);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <ToolPageWrapper
      title="Compress PDF"
      description="Reduce PDF file size while maintaining quality"
      icon={Minimize2}
      backPath="/pdf-tools"
      backLabel="PDF Tools"
    >
      <FileUploader
        accept=".pdf"
        onFilesSelected={setFiles}
        label="Drop your PDF file here"
      />

      {files.length > 0 && !result && (
        <div className="mt-6 text-center">
          <button
            onClick={handleCompress}
            disabled={processing}
            className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all disabled:opacity-50"
          >
            Compress PDF
          </button>
        </div>
      )}

      {result && stats && (
        <div className="mt-8 text-center space-y-4">
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
            <p className="text-emerald-600 dark:text-emerald-400 font-heading font-semibold">Compression complete!</p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div>
                <p className="text-muted-foreground">Original</p>
                <p className="font-semibold text-foreground">{formatSize(stats.original)}</p>
              </div>
              <div className="text-2xl text-muted-foreground">→</div>
              <div>
                <p className="text-muted-foreground">Compressed</p>
                <p className="font-semibold text-foreground">{formatSize(stats.compressed)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Reduced</p>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">{stats.reduction}%</p>
              </div>
            </div>
          </div>
          <DownloadButton url={result} filename="compressed.pdf" label="Download Compressed PDF" />
        </div>
      )}

      <AnimatePresence>
        {processing && <ProcessingOverlay message="Compressing your PDF..." />}
      </AnimatePresence>
    </ToolPageWrapper>
  );
}