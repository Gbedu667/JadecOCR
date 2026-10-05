import { useState } from "react";
import { Maximize } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import ToolPageWrapper from "../../components/ToolPageWrapper";
import FileUploader from "../../components/FileUploader";
import ProcessingOverlay from "../../components/ProcessingOverlay";
import DownloadButton from "../../components/DownloadButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function ResizeImage() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [keepRatio, setKeepRatio] = useState(true);
  const [originalDims, setOriginalDims] = useState(null);

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
    setResult(null);
    if (selectedFiles.length > 0) {
      const img = new Image();
      img.onload = () => {
        setOriginalDims({ w: img.naturalWidth, h: img.naturalHeight });
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
      };
      img.src = URL.createObjectURL(selectedFiles[0]);
    }
  };

  const handleWidthChange = (val) => {
    const w = parseInt(val) || 0;
    setWidth(w);
    if (keepRatio && originalDims) {
      setHeight(Math.round(w * (originalDims.h / originalDims.w)));
    }
  };

  const handleHeightChange = (val) => {
    const h = parseInt(val) || 0;
    setHeight(h);
    if (keepRatio && originalDims) {
      setWidth(Math.round(h * (originalDims.w / originalDims.h)));
    }
  };

  const handleResize = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setResult(null);

    const file = files[0];
    const img = new Image();
    const url = URL.createObjectURL(file);
    await new Promise(r => { img.onload = r; img.src = url; });

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
    setResult(URL.createObjectURL(blob));
    setProcessing(false);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageWrapper title="Resize Image" description="Change image dimensions" icon={Maximize} backPath="/image-tools" backLabel="Image Tools">
      <FileUploader accept="image/*" onFilesSelected={handleFilesSelected} label="Drop your image here" />

      {files.length > 0 && !result && (
        <div className="mt-6 space-y-4 max-w-md mx-auto">
          {originalDims && (
            <p className="text-sm text-muted-foreground text-center">
              Original: {originalDims.w} × {originalDims.h}px
            </p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="font-heading text-sm">Width (px)</Label>
              <Input type="number" value={width} onChange={e => handleWidthChange(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-1">
              <Label className="font-heading text-sm">Height (px)</Label>
              <Input type="number" value={height} onChange={e => handleHeightChange(e.target.value)} className="rounded-xl" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={keepRatio} onCheckedChange={setKeepRatio} />
            <Label className="text-sm">Keep aspect ratio</Label>
          </div>
          <div className="text-center">
            <button onClick={handleResize} disabled={processing} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-50">
              Resize Image
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-8 text-center space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-emerald-600 dark:text-emerald-400 font-heading font-semibold">Resized to {width} × {height}px!</p>
          </div>
          <img src={result} alt="Resized" className="max-w-full max-h-64 mx-auto rounded-xl border border-border" />
          <DownloadButton url={result} filename="resized.png" label="Download Resized Image" />
        </div>
      )}

      <AnimatePresence>{processing && <ProcessingOverlay message="Resizing image..." />}</AnimatePresence>
    </ToolPageWrapper>
  );
}