import { useState } from "react";
import { Droplets } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import ToolPageWrapper from "../../components/ToolPageWrapper";
import FileUploader from "../../components/FileUploader";
import ProcessingOverlay from "../../components/ProcessingOverlay";
import DownloadButton from "../../components/DownloadButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function WatermarkPdf() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState([0.15]);
  const [fontSize, setFontSize] = useState([48]);

  const handleWatermark = async () => {
    if (files.length === 0 || !text.trim()) return;
    setProcessing(true);
    setResult(null);

    const bytes = await files[0].arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const font = await pdf.embedFont(StandardFonts.HelveticaBold);
    const pages = pdf.getPages();

    pages.forEach(page => {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, fontSize[0]);
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y: height / 2,
        size: fontSize[0],
        font,
        color: rgb(0.5, 0.5, 0.5),
        opacity: opacity[0],
        rotate: { type: "degrees", angle: -45 },
      });
    });

    const watermarkedBytes = await pdf.save();
    const blob = new Blob([watermarkedBytes], { type: "application/pdf" });
    setResult(URL.createObjectURL(blob));
    setProcessing(false);
  };

  return (
    <ToolPageWrapper
      title="Watermark PDF"
      description="Add a text watermark to every page"
      icon={Droplets}
      backPath="/pdf-tools"
      backLabel="PDF Tools"
    >
      <FileUploader accept=".pdf" onFilesSelected={setFiles} label="Drop your PDF file here" />

      {files.length > 0 && !result && (
        <div className="mt-6 space-y-6 max-w-md mx-auto">
          <div className="space-y-2">
            <Label className="font-heading text-sm">Watermark Text</Label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter watermark text"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-heading text-sm">Opacity: {Math.round(opacity[0] * 100)}%</Label>
            <Slider value={opacity} onValueChange={setOpacity} min={0.05} max={0.5} step={0.05} />
          </div>
          <div className="space-y-2">
            <Label className="font-heading text-sm">Font Size: {fontSize[0]}px</Label>
            <Slider value={fontSize} onValueChange={setFontSize} min={12} max={96} step={4} />
          </div>
          <div className="text-center">
            <button
              onClick={handleWatermark}
              disabled={processing}
              className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
            >
              Add Watermark
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-8 text-center space-y-4">
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-emerald-600 dark:text-emerald-400 font-heading font-semibold">Watermark added!</p>
          </div>
          <DownloadButton url={result} filename="watermarked.pdf" label="Download Watermarked PDF" />
        </div>
      )}

      <AnimatePresence>
        {processing && <ProcessingOverlay message="Adding watermark..." />}
      </AnimatePresence>
    </ToolPageWrapper>
  );
}