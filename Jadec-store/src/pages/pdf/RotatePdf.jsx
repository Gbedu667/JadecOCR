import { useState } from "react";
import { RotateCw } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { PDFDocument, degrees } from "pdf-lib";
import ToolPageWrapper from "../../components/ToolPageWrapper";
import FileUploader from "../../components/FileUploader";
import ProcessingOverlay from "../../components/ProcessingOverlay";
import DownloadButton from "../../components/DownloadButton";
import { Button } from "@/components/ui/button";

export default function RotatePdf() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(90);

  const handleRotate = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setResult(null);

    const bytes = await files[0].arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const pages = pdf.getPages();

    pages.forEach(page => {
      page.setRotation(degrees(page.getRotation().angle + rotation));
    });

    const rotatedBytes = await pdf.save();
    const blob = new Blob([rotatedBytes], { type: "application/pdf" });
    setResult(URL.createObjectURL(blob));
    setProcessing(false);
  };

  return (
    <ToolPageWrapper
      title="Rotate PDF"
      description="Rotate all pages in your PDF"
      icon={RotateCw}
      backPath="/pdf-tools"
      backLabel="PDF Tools"
    >
      <FileUploader accept=".pdf" onFilesSelected={setFiles} label="Drop your PDF file here" />

      {files.length > 0 && !result && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-center gap-3">
            {[90, 180, 270].map(deg => (
              <Button
                key={deg}
                variant={rotation === deg ? "default" : "outline"}
                onClick={() => setRotation(deg)}
                className="rounded-xl font-heading"
              >
                {deg}°
              </Button>
            ))}
          </div>
          <div className="text-center">
            <button
              onClick={handleRotate}
              disabled={processing}
              className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
            >
              Rotate PDF
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-8 text-center space-y-4">
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-emerald-600 dark:text-emerald-400 font-heading font-semibold">PDF rotated {rotation}°!</p>
          </div>
          <DownloadButton url={result} filename="rotated.pdf" label="Download Rotated PDF" />
        </div>
      )}

      <AnimatePresence>
        {processing && <ProcessingOverlay message="Rotating your PDF..." />}
      </AnimatePresence>
    </ToolPageWrapper>
  );
}