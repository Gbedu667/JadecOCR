import { useState, useRef, useCallback } from "react";
import { Upload, X, File, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function FileUploader({ accept, multiple = false, onFilesSelected, maxSize = 50, label }) {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const handleFiles = useCallback((fileList) => {
    const arr = Array.from(fileList);
    const filtered = arr.filter(f => f.size <= maxSize * 1024 * 1024);
    const newFiles = multiple ? [...files, ...filtered] : filtered.slice(0, 1);
    setFiles(newFiles);
    onFilesSelected?.(newFiles);
  }, [files, multiple, maxSize, onFilesSelected]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesSelected?.(newFiles);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const isImage = (file) => file.type.startsWith("image/");

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
          dragOver
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-primary/50 hover:bg-secondary/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <motion.div
          animate={{ y: dragOver ? -4 : 0 }}
          className="flex flex-col items-center gap-4"
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
            dragOver ? "bg-primary/10" : "bg-secondary"
          }`}>
            <Upload className={`w-7 h-7 ${dragOver ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <div>
            <p className="font-heading font-semibold text-foreground">
              {label || "Drop your files here"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse · Max {maxSize}MB per file
            </p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {files.map((file, i) => (
              <motion.div
                key={file.name + i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  {isImage(file) ? (
                    <ImageIcon className="w-5 h-5 text-accent" />
                  ) : (
                    <File className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}