import { useState, useRef, useEffect } from "react";
import { Scissors } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import ToolPageWrapper from "../../components/ToolPageWrapper";
import FileUploader from "../../components/FileUploader";
import ProcessingOverlay from "../../components/ProcessingOverlay";
import DownloadButton from "../../components/DownloadButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CropImage() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [dims, setDims] = useState(null);

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
    setResult(null);
    if (selectedFiles.length > 0) {
      const url = URL.createObjectURL(selectedFiles[0]);
      setPreview(url);
      const img = new Image();
      img.onload = () => {
        setDims({ w: img.naturalWidth, h: img.naturalHeight });
        setCrop({ x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight });
      };
      img.src = url;
    }
  };

  const handleCrop = async () => {
    if (!preview) return;
    setProcessing(true);
    setResult(null);

    const img = new Image();
    await new Promise(r => { img.onload = r; img.src = preview; });

    const canvas = document.createElement("canvas");
    canvas.width = crop.w;
    canvas.height = crop.h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);

    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
    setResult(URL.createObjectURL(blob));
    setProcessing(false);
  };

  return (
    <ToolPageWrapper title="Crop Image" description="Crop your image to exact dimensions" icon={Scissors} backPath="/image-tools" backLabel="Image Tools">
      <FileUploader accept="image/*" onFilesSelected={handleFilesSelected} label="Drop your image here" />

      {preview && !result && (
        <div className="mt-6 space-y-4">
          <img src={preview} alt="Preview" className="max-w-full max-h-48 mx-auto rounded-xl border border-border" />
          {dims && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
              <div className="space-y-1">
                <Label className="text-xs">X</Label>
                <Input type="number" value={crop.x} onChange={e => setCrop(prev => ({...prev, x: parseInt(e.target.value) || 0}))} className="rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Y</Label>
                <Input type="number" value={crop.y} onChange={e => setCrop(prev => ({...prev, y: parseInt(e.target.value) || 0}))} className="rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Width</Label>
                <Input type="number" value={crop.w} onChange={e => setCrop(prev => ({...prev, w: parseInt(e.target.value) || 0}))} className="rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Height</Label>
                <Input type="number" value={crop.h} onChange={e => setCrop(prev => ({...prev, h: parseInt(e.target.value) || 0}))} className="rounded-xl" />
              </div>
            </div>
          )}
          <div className="text-center">
            <button onClick={handleCrop} disabled={processing} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-50">
              Crop Image
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-8 text-center space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-emerald-600 dark:text-emerald-400 font-heading font-semibold">Image cropped to {crop.w} × {crop.h}px!</p>
          </div>
          <img src={result} alt="Cropped" className="max-w-full max-h-64 mx-auto rounded-xl border border-border" />
          <DownloadButton url={result} filename="cropped.png" label="Download Cropped Image" />
        </div>
      )}

      <AnimatePresence>{processing && <ProcessingOverlay message="Cropping image..." />}</AnimatePresence>
    </ToolPageWrapper>
  );
}