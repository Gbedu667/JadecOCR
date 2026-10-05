import { useState } from "react";
import { Wand2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import ToolPageWrapper from "../../components/ToolPageWrapper";
import FileUploader from "../../components/FileUploader";
import ProcessingOverlay from "../../components/ProcessingOverlay";
import DownloadButton from "../../components/DownloadButton";

export default function EnhanceImage() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleEnhance = async () => {
    if (files.length === 0) return;

    setProcessing(true);
    setResult(null);
    setError("");

    const file = files[0];
    const url = URL.createObjectURL(file);

    try {
      const img = new Image();

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not create image processing context.");
      }

      // Improve contrast, saturation and brightness
      ctx.filter = "contrast(1.15) saturate(1.2) brightness(1.05)";
      ctx.drawImage(img, 0, 0);

      // Simple sharpening pass
      const sharpenCanvas = document.createElement("canvas");
      sharpenCanvas.width = canvas.width;
      sharpenCanvas.height = canvas.height;

      const sharpenCtx = sharpenCanvas.getContext("2d");

      if (!sharpenCtx) {
        throw new Error("Could not create sharpening context.");
      }

      sharpenCtx.drawImage(canvas, 0, 0);

      ctx.globalAlpha = 0.25;
      ctx.filter = "contrast(1.25)";
      ctx.drawImage(sharpenCanvas, 0, 0);

      ctx.globalAlpha = 1;
      ctx.filter = "none";

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (generatedBlob) => {
            if (generatedBlob) {
              resolve(generatedBlob);
            } else {
              reject(new Error("Could not create enhanced image."));
            }
          },
          "image/png",
          0.95
        );
      });

      const resultUrl = URL.createObjectURL(blob);

      setResult(resultUrl);
    } catch (err) {
      console.error("Image enhancement failed:", err);

      setError(
        "Could not enhance this image. Please try another image file."
      );
    } finally {
      URL.revokeObjectURL(url);
      setProcessing(false);
    }
  };

  return (
    <ToolPageWrapper
      title="AI Enhance"
      description="Improve image quality with smart enhancement"
      icon={Wand2}
      backPath="/image-tools"
      backLabel="Image Tools"
    >
      <FileUploader
        accept="image/*"
        onFilesSelected={(selectedFiles) => {
          setFiles(selectedFiles);
          setResult(null);
          setError("");
        }}
        label="Drop your image here"
      />

      {files.length > 0 && !result && !processing && (
        <div className="mt-6 text-center">
          <button
            onClick={handleEnhance}
            disabled={processing}
            className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
          >
            <Wand2 className="w-4 h-4 inline mr-2" />
            Enhance Image
          </button>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
          <p className="text-red-600 dark:text-red-400 font-medium">
            {error}
          </p>
        </div>
      )}

      {result && (
        <div className="mt-8 text-center space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-emerald-600 dark:text-emerald-400 font-heading font-semibold">
              Image enhanced!
            </p>
          </div>

          <img
            src={result}
            alt="Enhanced"
            className="max-w-full max-h-64 mx-auto rounded-xl border border-border"
          />

          <DownloadButton
            url={result}
            filename="enhanced.png"
            label="Download Enhanced Image"
          />

          <button
            onClick={() => {
              URL.revokeObjectURL(result);
              setResult(null);
            }}
            className="block mx-auto text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Enhance another image
          </button>
        </div>
      )}

      <AnimatePresence>
        {processing && (
          <ProcessingOverlay message="Enhancing your image..." />
        )}
      </AnimatePresence>
    </ToolPageWrapper>
  );
}