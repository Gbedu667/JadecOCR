import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import ToolPageWrapper from "../../components/ToolPageWrapper";
import FileUploader from "../../components/FileUploader";
import ProcessingOverlay from "../../components/ProcessingOverlay";
import DownloadButton from "../../components/DownloadButton";
import { Button } from "@/components/ui/button";

const formats = [
  { label: "JPG", mime: "image/jpeg", ext: "jpg" },
  { label: "PNG", mime: "image/png", ext: "png" },
  { label: "WEBP", mime: "image/webp", ext: "webp" },
];

export default function ConvertImage() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [format, setFormat] = useState(formats[0]);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setResult(null);

    const file = files[0];
    const img = new Image();
    const url = URL.createObjectURL(file);
    await new Promise(r => { img.onload = r; img.src = url; });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (format.mime === "image/jpeg") {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise(resolve => canvas.toBlob(resolve, format.mime, 0.92));
    setResult({ url: URL.createObjectURL(blob), ext: format.ext });
    setProcessing(false);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageWrapper title="Convert Image" description="Convert between JPG, PNG, and WEBP formats" icon={RefreshCw} backPath="/image-tools" backLabel="Image Tools">
      <FileUploader accept="image/*" onFilesSelected={setFiles} label="Drop your image here" />

      {files.length > 0 && !result && (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-muted-foreground text-center">Convert to:</p>
          <div className="flex items-center justify-center gap-2">
            {formats.map(f => (
              <Button key={f.ext} variant={format.ext === f.ext ? "default" : "outline"} onClick={() => setFormat(f)} className="rounded-xl font-heading">
                {f.label}
              </Button>
            ))}
          </div>
          <div className="text-center">
            <button onClick={handleConvert} disabled={processing} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-50">
              Convert to {format.label}
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-8 text-center space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-emerald-600 dark:text-emerald-400 font-heading font-semibold">Converted to {format.label}!</p>
          </div>
          <img src={result.url} alt="Converted" className="max-w-full max-h-64 mx-auto rounded-xl border border-border" />
          <DownloadButton url={result.url} filename={`converted.${result.ext}`} label={`Download ${format.label}`} />
        </div>
      )}

      <AnimatePresence>{processing && <ProcessingOverlay message="Converting image..." />}</AnimatePresence>
    </ToolPageWrapper>
  );
}