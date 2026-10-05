import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ToolPageWrapper({ title, description, icon: Icon, backPath, backLabel, children }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link to={backPath || "/"}>
          <Button variant="ghost" size="sm" className="mb-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backLabel || "Back"}
          </Button>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          {Icon && (
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          )}
          <div>
            <h1 className="font-heading font-bold text-2xl text-foreground">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>

        {children}
      </motion.div>
    </div>
  );
}