import { useState } from "react";
import { ScanSearch, Copy, Check } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { createWorker } from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import ToolPageWrapper from "../../components/ToolPageWrapper";
import FileUploader from "../../components/FileUploader";
import ProcessingOverlay from "../../components/ProcessingOverlay";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function OcrPdf() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [copied, setCopied] = useState(false);

  const runImageOcr = async (file, worker) => {
    const { data } = await worker.recognize(file);

    return data.text || "";
  };

  const runPdfOcr = async (file, worker) => {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer
    }).promise;

    const pages = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);

      const viewport = page.getViewport({
        scale: 2
      });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport
      }).promise;

      const { data } = await worker.recognize(canvas);

      pages.push(
        `--- Page ${pageNumber} ---\n${data.text || ""}`
      );
    }

    return pages.join("\n\n");
  };

  const handleOcr = async () => {
    if (files.length === 0) return;

    setProcessing(true);
    setExtractedText("");
    setAuthError?.(null);

    let worker;

    try {
      const file = files[0];

      worker = await createWorker("eng");

      let text = "";

      const fileType = file.type;
      const fileName = file.name.toLowerCase();

      if (
        fileType.startsWith("image/") ||
        /\.(png|jpg|jpeg)$/i.test(fileName)
      ) {
        text = await runImageOcr(file, worker);
      } else if (
        fileType === "application/pdf" ||
        fileName.endsWith(".pdf")
      ) {
        text = await runPdfOcr(file, worker);
      } else {
        throw new Error("Unsupported file type.");
      }

      if (text.trim()) {
        setExtractedText(text.trim());
      } else {
        setExtractedText(
          "Could not extract text from this document. Try a clearer file."
        );
      }
    } catch (error) {
      console.error("OCR failed:", error);

      setExtractedText(
        "OCR failed. Please check the file and try again."
      );

      toast.error("Could not extract text from this file");
    } finally {
      if (worker) {
        await worker.terminate();
      }

      setProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (!extractedText) return;

    try {
      await navigator.clipboard.writeText(extractedText);

      setCopied(true);
      toast.success("Text copied to clipboard");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Could not copy text");
    }
  };

  return (
    <ToolPageWrapper
      title="OCR - Text Extraction"
      description="Extract text from scanned PDFs and images"
      icon={ScanSearch}
      backPath="/pdf-tools"
      backLabel="PDF Tools"
    >
      <FileUploader
        accept=".pdf,.png,.jpg,.jpeg"
        onFilesSelected={setFiles}
        label="Drop your PDF or image here"
      />

      {files.length > 0 && !extractedText && (
        <div className="mt-6 text-center">
          <button
            onClick={handleOcr}
            disabled={processing}
            className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
          >
            {processing ? "Extracting..." : "Extract Text"}
          </button>
        </div>
      )}

      {extractedText && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-foreground">
              Extracted Text
            </h3>

            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="w-4 h-4 mr-1" />
              ) : (
                <Copy className="w-4 h-4 mr-1" />
              )}

              {copied ? "Copied" : "Copy All"}
            </Button>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border max-h-96 overflow-auto">
            <pre className="text-sm text-foreground whitespace-pre-wrap font-body leading-relaxed">
              {extractedText}
            </pre>
          </div>
        </div>
      )}

      <AnimatePresence>
        {processing && (
          <ProcessingOverlay message="Extracting text with OCR..." />
        )}
      </AnimatePresence>
    </ToolPageWrapper>
  );
}