import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import ToolPageWrapper from "../../components/ToolPageWrapper";
import FileUploader from "../../components/FileUploader";
import ProcessingOverlay from "../../components/ProcessingOverlay";
import DownloadButton from "../../components/DownloadButton";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function FiltersImage() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);
  const [filters, setFilters] = useState({ brightness: [100], contrast: [100], saturate: [100], blur: [0] });

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
    setResult(null);
    if (selectedFiles.length > 0) {
      setPreview(URL.createObjectURL(selectedFiles[0]));
    }
  };

  const filterStyle = {
    filter: `brightness(${filters.brightness[0]}%) contrast(${filters.contrast[0]}%) saturate(${filters.saturate[0]}%) blur(${filters.blur[0]}px)`
  };

  const handleApply = async () => {
    if (!preview) return;
    setProcessing(true);
    setResult(null);

    const img = new Image();
    await new Promise(r => { img.onload = r; img.src = preview; });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.filter = `brightness(${filters.brightness[0]}%) contrast(${filters.contrast[0]}%) saturate(${filters.saturate[0]}%) blur(${filters.blur[0]}px)`;
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
    setResult(URL.createObjectURL(blob));
    setProcessing(false);
  };

  return (
    <ToolPageWrapper title="Image Filters" description="Adjust brightness, contrast, and more" icon={SlidersHorizontal} backPath="/image-tools" backLabel="Image Tools">
      <FileUploader accept="image/*" onFilesSelected={handleFilesSelected} label="Drop your image here" />

      {preview && !result && (
        <div className="mt-6 space-y-6">
          <img src={preview} alt="Preview" style={filterStyle} className="max-w-full max-h-64 mx-auto rounded-xl border border-border" />

          <div className="max-w-md mx-auto space-y-4">
            <div className="space-y-2">
              <Label className="font-heading text-sm">Brightness: {filters.brightness[0]}%</Label>
              <Slider value={filters.brightness} onValueChange={v => setFilters(p => ({...p, brightness: v}))} min={0} max={200} step={5} />
            </div>
            <div className="space-y-2">
              <Label className="font-heading text-sm">Contrast: {filters.contrast[0]}%</Label>
              <Slider value={filters.contrast} onValueChange={v => setFilters(p => ({...p, contrast: v}))} min={0} max={200} step={5} />
            </div>
            <div className="space-y-2">
              <Label className="font-heading text-sm">Saturation: {filters.saturate[0]}%</Label>
              <Slider value={filters.saturate} onValueChange={v => setFilters(p => ({...p, saturate: v}))} min={0} max={200} step={5} />
            </div>
            <div className="space-y-2">
              <Label className="font-heading text-sm">Blur: {filters.blur[0]}px</Label>
              <Slider value={filters.blur} onValueChange={v => setFilters(p => ({...p, blur: v}))} min={0} max={10} step={0.5} />
            </div>
          </div>

          <div className="text-center">
            <button onClick={handleApply} disabled={processing} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-50">
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-8 text-center space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-emerald-600 dark:text-emerald-400 font-heading font-semibold">Filters applied!</p>
          </div>
          <img src={result} alt="Filtered" className="max-w-full max-h-64 mx-auto rounded-xl border border-border" />
          <DownloadButton url={result} filename="filtered.png" label="Download Filtered Image" />
        </div>
      )}

      <AnimatePresence>{processing && <ProcessingOverlay message="Applying filters..." />}</AnimatePresence>
    </ToolPageWrapper>
  );
}