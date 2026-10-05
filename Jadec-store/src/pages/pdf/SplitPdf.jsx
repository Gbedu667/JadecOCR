import { useState } from "react";
import { Split } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { PDFDocument } from "pdf-lib";
import ToolPageWrapper from "../../components/ToolPageWrapper";
import FileUploader from "../../components/FileUploader";
import ProcessingOverlay from "../../components/ProcessingOverlay";
import DownloadButton from "../../components/DownloadButton";

export default function SplitPdf() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [pageCount, setPageCount] = useState(0);

  const handleFilesSelected = async (selectedFiles) => {
    setFiles(selectedFiles);
    setResults([]);
    if (selectedFiles.length > 0) {
      const bytes = await selectedFiles[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setPageCount(pdf.getPageCount());
    }
  };

  const handleSplit = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setResults([]);

    const bytes = await files[0].arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const urls = [];

    for (let i = 0; i < pdf.getPageCount(); i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);
      const newBytes = await newPdf.save();
      const blob = new Blob([newBytes], { type: "application/pdf" });
      urls.push({ url: URL.createObjectURL(blob), name: `page-${i + 1}.pdf` });
    }

    setResults(urls);
    setProcessing(false);
  };

  return (
    <ToolPageWrapper
      title="Split PDF"
      description="Split a PDF into individual pages"
      icon={Split}
      backPath="/pdf-tools"
      backLabel="PDF Tools"
    >
      <FileUploader
        accept=".pdf"
        onFilesSelected={handleFilesSelected}
        label="Drop your PDF file here"
      />

      {pageCount > 0 && results.length === 0 && (
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            This PDF has <span className="font-semibold text-foreground">{pageCount}</span> pages
          </p>
          <button
            onClick={handleSplit}
            disabled={processing}
            className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all disabled:opacity-50"
          >
            Split into {pageCount} Pages
          </button>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-8 space-y-3">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <p className="text-emerald-600 dark:text-emerald-400 font-heading font-semibold">
              Split into {results.length} pages!
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {results.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                <span className="text-sm font-medium">Page {i + 1}</span>
                <DownloadButton url={r.url} filename={r.name} label="Download" />
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {processing && <ProcessingOverlay message="Splitting your PDF..." />}
      </AnimatePresence>
    </ToolPageWrapper>
  );
}