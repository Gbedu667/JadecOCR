import { useState } from "react";
import { Droplets } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import ToolPageWrapper from "../../components/ToolPageWrapper";
import FileUploader from "../../components/FileUploader";
import ProcessingOverlay from "../../components/ProcessingOverlay";
import DownloadButton from "../../components/DownloadButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function WatermarkImage() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [text, setText] = useState("© Watermark");
  const [opacity, setOpacity] = useState([0.3]);
  const [fontSize, setFontSize] = useState([36]);

  const handleWatermark = async () => {
    if (files.length === 0 || !text.trim()) return;
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
    ctx.drawImage(img, 0, 0);

    ctx.globalAlpha = opacity[0];
    ctx.font = `bold ${fontSize[0]}px Arial`;
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";

    // Diagonal repeating watermark
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 6);
    for (let y = -canvas.height; y < canvas.height * 2; y += fontSize[0] * 4) {
      for (let x = -canvas.width; x < canvas.width * 2; x += ctx.measureText(text).width + 80) {
        ctx.fillText(text, x, y);
      }
    }
    ctx.restore();

    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
    setResult(URL.createObjectURL(blob));
    setProcessing(false);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageWrapper title="Image Watermark" description="Add a text watermark to your images" icon={Droplets} backPath="/image-tools" backLabel="Image Tools">
      <FileUploader accept="image/*" onFilesSelected={setFiles} label="Drop your image here" />

      {files.length > 0 && !result && (
        <div className="mt-6 space-y-4 max-w-md mx-auto">
          <div className="space-y-2">
            <Label className="font-heading text-sm">Watermark Text</Label>
            <Input value={text} onChange={e => setText(e.target.value)} placeholder="Enter watermark text" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label className="font-heading text-sm">Opacity: {Math.round(opacity[0] * 100)}%</Label>
            <Slider value={opacity} onValueChange={setOpacity} min={0.05} max={0.8} step={0.05} />
          </div>
          <div className="space-y-2">
            <Label className="font-heading text-sm">Font Size: {fontSize[0]}px</Label>
            <Slider value={fontSize} onValueChange={setFontSize} min={12} max={72} step={2} />
          </div>
          <div className="text-center">
            <button onClick={handleWatermark} disabled={processing} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-50">
              Add Watermark
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-8 text-center space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-emerald-600 dark:text-emerald-400 font-heading font-semibold">Watermark added!</p>
          </div>
          <img src={result} alt="Watermarked" className="max-w-full max-h-64 mx-auto rounded-xl border border-border" />
          <DownloadButton url={result} filename="watermarked.png" label="Download Watermarked Image" />
        </div>
      )}

      <AnimatePresence>{processing && <ProcessingOverlay message="Adding watermark..." />}</AnimatePresence>
    </ToolPageWrapper>
  );
}