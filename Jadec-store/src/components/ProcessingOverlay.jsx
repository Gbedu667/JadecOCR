import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function ProcessingOverlay({ message = "Processing your file..." }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card border border-border rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 max-w-sm mx-4"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-primary/20"
          />
        </div>
        <div className="text-center">
          <p className="font-heading font-semibold text-foreground">{message}</p>
          <p className="text-sm text-muted-foreground mt-1">This may take a moment</p>
        </div>
      </motion.div>
    </motion.div>
  );
}