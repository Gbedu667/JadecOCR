import { useState } from "react";
import { Merge } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { PDFDocument } from "pdf-lib";
import ToolPageWrapper from "../../components/ToolPageWrapper";
import FileUploader from "../../components/FileUploader";
import ProcessingOverlay from "../../components/ProcessingOverlay";
import DownloadButton from "../../components/DownloadButton";

export default function MergePdf() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleMerge = async () => {
    if (files.length < 2) return;
    setProcessing(true);
    setResult(null);

    const merged = await PDFDocument.create();

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = await merged.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(page => merged.addPage(page));
    }

    const mergedBytes = await merged.save();
    const blob = new Blob([mergedBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setResult(url);
    setProcessing(false);
  };

  return (
    <ToolPageWrapper
      title="Merge PDF"
      description="Combine multiple PDF files into one document"
      icon={Merge}
      backPath="/pdf-tools"
      backLabel="PDF Tools"
    >
      <FileUploader
        accept=".pdf"
        multiple
        onFilesSelected={setFiles}
        label="Drop your PDF files here"
      />

      {files.length >= 2 && !result && (
        <div className="mt-6 text-center">
          <button
            onClick={handleMerge}
            disabled={processing}
            className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all disabled:opacity-50"
          >
            Merge {files.length} PDFs
          </button>
        </div>
      )}

      {result && (
        <div className="mt-8 text-center space-y-4">
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-emerald-600 dark:text-emerald-400 font-heading font-semibold">PDFs merged successfully!</p>
          </div>
          <DownloadButton url={result} filename="merged.pdf" label="Download Merged PDF" />
        </div>
      )}

      <AnimatePresence>
        {processing && <ProcessingOverlay message="Merging your PDFs..." />}
      </AnimatePresence>
    </ToolPageWrapper>
  );
}