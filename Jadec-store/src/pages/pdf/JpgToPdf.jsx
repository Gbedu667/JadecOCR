import { useState } from "react";
import { FileOutput } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { PDFDocument } from "pdf-lib";
import ToolPageWrapper from "../../components/ToolPageWrapper";
import FileUploader from "../../components/FileUploader";
import ProcessingOverlay from "../../components/ProcessingOverlay";
import DownloadButton from "../../components/DownloadButton";

export default function JpgToPdf() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const fileToJpegBytes = (file) => new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      const base64 = dataUrl.split(",")[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      resolve({ bytes, width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = url;
  });

  const handleConvert = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setResult(null);

    const pdf = await PDFDocument.create();

    for (const file of files) {
      const { bytes, width, height } = await fileToJpegBytes(file);
      const image = await pdf.embedJpg(bytes);
      const page = pdf.addPage([width, height]);
      page.drawImage(image, { x: 0, y: 0, width, height });
    }

    const pdfBytes = await pdf.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    setResult(URL.createObjectURL(blob));
    setProcessing(false);
  };

  return (
    <ToolPageWrapper title="JPG to PDF" description="Convert images to a PDF document" icon={FileOutput} backPath="/pdf-tools" backLabel="PDF Tools">
      <FileUploader accept=".jpg,.jpeg,.png" multiple onFilesSelected={setFiles} label="Drop your images here" />

      {files.length > 0 && !result && (
        <div className="mt-6 text-center">
          <button onClick={handleConvert} disabled={processing} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-50">
            Convert {files.length} Image{files.length > 1 ? "s" : ""} to PDF
          </button>
        </div>
      )}

      {result && (
        <div className="mt-8 text-center space-y-4">
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-emerald-600 dark:text-emerald-400 font-heading font-semibold">PDF created from {files.length} image{files.length > 1 ? "s" : ""}!</p>
          </div>
          <DownloadButton url={result} filename="images.pdf" label="Download PDF" />
        </div>
      )}

      <AnimatePresence>{processing && <ProcessingOverlay message="Creating PDF from images..." />}</AnimatePresence>
    </ToolPageWrapper>
  );
}