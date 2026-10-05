import { useState, useRef } from "react";
import { Minimize } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import ToolPageWrapper from "../../components/ToolPageWrapper";
import FileUploader from "../../components/FileUploader";
import ProcessingOverlay from "../../components/ProcessingOverlay";
import DownloadButton from "../../components/DownloadButton";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export default function CompressImage() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [quality, setQuality] = useState([0.7]);
  const [stats, setStats] = useState(null);

  const handleCompress = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setResult(null);

    const file = files[0];
    const img = new Image();
    const url = URL.createObjectURL(file);

    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", quality[0]));
    const resultUrl = URL.createObjectURL(blob);

    setStats({ original: file.size, compressed: blob.size, reduction: Math.round((1 - blob.size / file.size) * 100) });
    setResult(resultUrl);
    setProcessing(false);
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <ToolPageWrapper title="Compress Image" description="Reduce image size without visible quality loss" icon={Minimize} backPath="/image-tools" backLabel="Image Tools">
      <FileUploader accept="image/*" onFilesSelected={setFiles} label="Drop your image here" />

      {files.length > 0 && !result && (
        <div className="mt-6 space-y-4 max-w-md mx-auto">
          <div className="space-y-2">
            <Label className="font-heading text-sm">Quality: {Math.round(quality[0] * 100)}%</Label>
            <Slider value={quality} onValueChange={setQuality} min={0.1} max={1} step={0.05} />
          </div>
          <div className="text-center">
            <button onClick={handleCompress} disabled={processing} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-50">
              Compress Image
            </button>
          </div>
        </div>
      )}

      {result && stats && (
        <div className="mt-8 text-center space-y-4">
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
            <p className="text-emerald-600 dark:text-emerald-400 font-heading font-semibold">Image compressed!</p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div><p className="text-muted-foreground">Original</p><p className="font-semibold">{formatSize(stats.original)}</p></div>
              <div className="text-2xl text-muted-foreground">→</div>
              <div><p className="text-muted-foreground">Compressed</p><p className="font-semibold">{formatSize(stats.compressed)}</p></div>
              <div><p className="text-muted-foreground">Saved</p><p className="font-semibold text-emerald-600 dark:text-emerald-400">{stats.reduction}%</p></div>
            </div>
          </div>
          <img src={result} alt="Compressed" className="max-w-full max-h-64 mx-auto rounded-xl border border-border" />
          <DownloadButton url={result} filename="compressed.jpg" label="Download Compressed Image" />
        </div>
      )}

      <AnimatePresence>{processing && <ProcessingOverlay message="Compressing image..." />}</AnimatePresence>
    </ToolPageWrapper>
  );
}