import { useState } from "react";
import { FileImage } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import ToolPageWrapper from "../../components/ToolPageWrapper";
import FileUploader from "../../components/FileUploader";
import ProcessingOverlay from "../../components/ProcessingOverlay";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function PdfToJpg() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [images, setImages] = useState([]);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setImages([]);

    const pdfjsLib = await import("https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/+esm");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs";

    const bytes = await files[0].arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
    const results = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      await page.render({ canvasContext: ctx, viewport }).promise;
      const url = canvas.toDataURL("image/jpeg", 0.92);
      results.push({ url, name: `page-${i}.jpg` });
    }

    setImages(results);
    setProcessing(false);
  };

  const downloadImage = (url, name) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
  };

  return (
    <ToolPageWrapper title="PDF to JPG" description="Convert each PDF page to a JPG image" icon={FileImage} backPath="/pdf-tools" backLabel="PDF Tools">
      <FileUploader accept=".pdf" onFilesSelected={setFiles} label="Drop your PDF file here" />

      {files.length > 0 && images.length === 0 && (
        <div className="mt-6 text-center">
          <button onClick={handleConvert} disabled={processing} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-50">
            Convert to JPG
          </button>
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <p className="text-emerald-600 dark:text-emerald-400 font-heading font-semibold">
              Converted {images.length} pages to JPG!
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-border bg-card">
                <img src={img.url} alt={`Page ${i + 1}`} className="w-full h-48 object-cover" />
                <div className="p-3 flex items-center justify-between">
                  <span className="text-sm font-medium">Page {i + 1}</span>
                  <Button size="sm" variant="outline" className="rounded-lg" onClick={() => downloadImage(img.url, img.name)}>
                    <Download className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>{processing && <ProcessingOverlay message="Converting pages to images..." />}</AnimatePresence>
    </ToolPageWrapper>
  );
}