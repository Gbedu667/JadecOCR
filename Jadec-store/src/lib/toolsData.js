import {
  Merge, Split, Minimize2, FileOutput,
  FileText, FileImage, FileSpreadsheet,
  RotateCw, Type, Hash, Crop, Lock, Unlock,
  ScanSearch, GitCompare, EyeOff, Sparkles, Languages,
  Eraser, ImagePlus, Minimize, Maximize, RefreshCw,
  Scissors, Droplets, SlidersHorizontal, Wand2,
  Layers, Shield
} from "lucide-react";

export const pdfTools = [
  {
    category: "Organize",
    tools: [
      { id: "merge-pdf", title: "Merge PDF", description: "Combine multiple PDFs into one file", icon: Merge, color: "primary", path: "/pdf/merge" },
      { id: "split-pdf", title: "Split PDF", description: "Split PDF into separate pages", icon: Split, color: "primary", path: "/pdf/split" },
    ]
  },
  {
    category: "Optimize",
    tools: [
      { id: "compress-pdf", title: "Compress PDF", description: "Reduce file size without quality loss", icon: Minimize2, color: "accent", path: "/pdf/compress" },
    ]
  },
  {
    category: "Convert",
    tools: [
      { id: "pdf-to-jpg", title: "PDF to JPG", description: "Convert each page to an image", icon: FileImage, color: "emerald", path: "/pdf/to-jpg" },
      { id: "jpg-to-pdf", title: "JPG to PDF", description: "Convert images to a PDF document", icon: FileOutput, color: "emerald", path: "/pdf/from-jpg" },
    ]
  },
  {
    category: "Edit",
    tools: [
      { id: "rotate-pdf", title: "Rotate PDF", description: "Rotate pages in any direction", icon: RotateCw, color: "amber", path: "/pdf/rotate" },
      { id: "watermark-pdf", title: "Watermark PDF", description: "Add text or image watermark", icon: Droplets, color: "amber", path: "/pdf/watermark" },
      { id: "page-numbers", title: "Page Numbers", description: "Add page numbers to your PDF", icon: Hash, color: "amber", path: "/pdf/page-numbers" },
    ]
  },
  {
    category: "Security",
    tools: [
      { id: "protect-pdf", title: "Protect PDF", description: "Add password protection", icon: Lock, color: "rose", path: "/pdf/protect" },
      { id: "unlock-pdf", title: "Unlock PDF", description: "Remove password from PDF", icon: Unlock, color: "rose", path: "/pdf/unlock" },
    ]
  },
  {
    category: "Intelligence",
    tools: [
      { id: "ocr-pdf", title: "OCR", description: "Extract text from scanned PDFs", icon: ScanSearch, color: "primary", path: "/pdf/ocr" },
      { id: "summarize-pdf", title: "AI Summarize", description: "Get an AI summary of your document", icon: Sparkles, color: "primary", path: "/pdf/summarize" },
    ]
  }
];

export const imageTools = [
  { id: "compress-image", title: "Compress Image", description: "Reduce image size without quality loss", icon: Minimize, color: "accent", path: "/image/compress" },
  { id: "resize-image", title: "Resize Image", description: "Change image dimensions", icon: Maximize, color: "accent", path: "/image/resize" },
  { id: "convert-image", title: "Convert Format", description: "Convert between JPG, PNG, WEBP", icon: RefreshCw, color: "emerald", path: "/image/convert" },
  { id: "crop-image", title: "Crop Image", description: "Crop to exact dimensions", icon: Scissors, color: "amber", path: "/image/crop" },
  { id: "watermark-image", title: "Watermark", description: "Add text watermark to images", icon: Droplets, color: "amber", path: "/image/watermark" },
  { id: "filters-image", title: "Filters", description: "Adjust brightness, contrast & more", icon: SlidersHorizontal, color: "rose", path: "/image/filters" },
  { id: "enhance-image", title: "AI Enhance", description: "Improve image quality with AI", icon: Wand2, color: "primary", path: "/image/enhance" },
  { id: "remove-bg", title: "Remove Background", description: "Remove background automatically", icon: Eraser, color: "primary", path: "/image/remove-bg" },
];

export const allToolsFlat = [
  ...pdfTools.flatMap(c => c.tools),
  ...imageTools,
];