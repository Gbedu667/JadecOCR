import { useState } from "react";
import { Eraser } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import ToolPageWrapper from "../../components/ToolPageWrapper";
import FileUploader from "../../components/FileUploader";
import ProcessingOverlay from "../../components/ProcessingOverlay";
import DownloadButton from "../../components/DownloadButton";

export default function RemoveBg() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleRemoveBg = async () => {
    if (files.length === 0) return;

    setProcessing(true);
    setResult(null);
    setError("");

    const file = files[0];
    const imageUrl = URL.createObjectURL(file);

    try {
      const img = new Image();

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d", {
        willReadFrequently: true
      });

      if (!ctx) {
        throw new Error("Could not process image.");
      }

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const pixels = imageData.data;

      // Sample the four corners to estimate the background color.
      const samples = [
        getPixel(pixels, canvas.width, 0, 0),
        getPixel(pixels, canvas.width, canvas.width - 1, 0),
        getPixel(
          pixels,
          canvas.width,
          0,
          canvas.height - 1
        ),
        getPixel(
          pixels,
          canvas.width,
          canvas.width - 1,
          canvas.height - 1
        )
      ];

      const background = {
        r: Math.round(
          samples.reduce((sum, color) => sum + color.r, 0) /
            samples.length
        ),
        g: Math.round(
          samples.reduce((sum, color) => sum + color.g, 0) /
            samples.length
        ),
        b: Math.round(
          samples.reduce((sum, color) => sum + color.b, 0) /
            samples.length
        )
      };

      const tolerance = 45;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        const distance = Math.sqrt(
          Math.pow(r - background.r, 2) +
            Math.pow(g - background.g, 2) +
            Math.pow(b - background.b, 2)
        );

        if (distance < tolerance) {
          pixels[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (generatedBlob) => {
            if (generatedBlob) {
              resolve(generatedBlob);
            } else {
              reject(
                new Error("Could not create transparent image.")
              );
            }
          },
          "image/png"
        );
      });

      const resultUrl = URL.createObjectURL(blob);

      setResult(resultUrl);
    } catch (err) {
      console.error("Background removal failed:", err);

      setError(
        "Could not remove the background from this image. Try another image."
      );
    } finally {
      URL.revokeObjectURL(imageUrl);
      setProcessing(false);
    }
  };

  const handleReset = () => {
    if (result) {
      URL.revokeObjectURL(result);
    }

    setResult(null);
    setError("");
  };

  return (
    <ToolPageWrapper
      title="Remove Background"
      description="Remove simple image backgrounds automatically"
      icon={Eraser}
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
        <div className="mt-6 text-center space-y-2">
          <button
            onClick={handleRemoveBg}
            disabled={processing}
            className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
          >
            <Eraser className="w-4 h-4 inline mr-2" />
            Remove Background
          </button>

          <p className="text-xs text-muted-foreground">
            Runs locally in your browser
          </p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">
            {error}
          </p>
        </div>
      )}

      {result && (
        <div className="mt-8 text-center space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-emerald-600 dark:text-emerald-400 font-heading font-semibold">
              Background removed!
            </p>
          </div>

          <div
            className="inline-block p-4 rounded-xl"
            style={{
              background:
                "repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%) 50% / 20px 20px"
            }}
          >
            <img
              src={result}
              alt="No background"
              className="max-w-full max-h-64 rounded-lg"
            />
          </div>

          <DownloadButton
            url={result}
            filename="no-background.png"
            label="Download Image"
          />

          <button
            onClick={handleReset}
            className="block mx-auto text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Remove another background
          </button>
        </div>
      )}

      <AnimatePresence>
        {processing && (
          <ProcessingOverlay message="Removing background..." />
        )}
      </AnimatePresence>
    </ToolPageWrapper>
  );
}

function getPixel(pixels, width, x, y) {
  const index = (y * width + x) * 4;

  return {
    r: pixels[index],
    g: pixels[index + 1],
    b: pixels[index + 2]
  };
}