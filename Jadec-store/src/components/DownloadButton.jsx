import { Download, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function DownloadButton({ url, filename, label = "Download" }) {
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "download";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Button
        onClick={handleDownload}
        size="lg"
        className="rounded-xl font-heading font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
      >
        <Download className="w-5 h-5 mr-2" />
        {label}
      </Button>
    </motion.div>
  );
}