import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ToolCard from "../components/ToolCard";
import { pdfTools, imageTools } from "../lib/toolsData";

const aiToolIds = ["ocr-pdf", "summarize-pdf", "enhance-image", "remove-bg"];

export default function AiTools() {
  const allTools = [...pdfTools.flatMap(c => c.tools), ...imageTools];
  const aiItems = allTools.filter(t => aiToolIds.includes(t.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-foreground">AI-Powered Tools</h1>
            <p className="text-sm text-muted-foreground mt-1">Smart processing powered by artificial intelligence</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {aiItems.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}