import { useState } from "react";
import { Hash } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import ToolPageWrapper from "../../components/ToolPageWrapper";
import FileUploader from "../../components/FileUploader";
import ProcessingOverlay from "../../components/ProcessingOverlay";
import DownloadButton from "../../components/DownloadButton";
import { Button } from "@/components/ui/button";

export default function PageNumbers() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [position, setPosition] = useState("bottom-center");

  const handleAddNumbers = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setResult(null);

    const bytes = await files[0].arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const pages = pdf.getPages();

    pages.forEach((page, i) => {
      const { width, height } = page.getSize();
      const text = `${i + 1}`;
      const textWidth = font.widthOfTextAtSize(text, 10);

      let x, y;
      if (position === "bottom-center") { x = (width - textWidth) / 2; y = 30; }
      else if (position === "bottom-right") { x = width - textWidth - 40; y = 30; }
      else { x = 40; y = 30; }

      page.drawText(text, { x, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
    });

    const numberedBytes = await pdf.save();
    const blob = new Blob([numberedBytes], { type: "application/pdf" });
    setResult(URL.createObjectURL(blob));
    setProcessing(false);
  };

  return (
    <ToolPageWrapper title="Page Numbers" description="Add page numbers to your PDF" icon={Hash} backPath="/pdf-tools" backLabel="PDF Tools">
      <FileUploader accept=".pdf" onFilesSelected={setFiles} label="Drop your PDF file here" />

      {files.length > 0 && !result && (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-muted-foreground text-center">Position:</p>
          <div className="flex items-center justify-center gap-2">
            {["bottom-left", "bottom-center", "bottom-right"].map(pos => (
              <Button key={pos} variant={position === pos ? "default" : "outline"} onClick={() => setPosition(pos)} className="rounded-xl font-heading text-xs capitalize">
                {pos.replace("-", " ")}
              </Button>
            ))}
          </div>
          <div className="text-center">
            <button onClick={handleAddNumbers} disabled={processing} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-50">
              Add Page Numbers
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-8 text-center space-y-4">
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-emerald-600 dark:text-emerald-400 font-heading font-semibold">Page numbers added!</p>
          </div>
          <DownloadButton url={result} filename="numbered.pdf" label="Download PDF" />
        </div>
      )}

      <AnimatePresence>{processing && <ProcessingOverlay message="Adding page numbers..." />}</AnimatePresence>
    </ToolPageWrapper>
  );
}