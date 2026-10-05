import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ToolCard({ icon: Icon, title, description, path, color = "primary" }) {
  const colorMap = {
    primary: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
    accent: "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground",
    rose: "bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white",
    amber: "bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white",
    emerald: "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white",
  };

  return (
    <Link to={path}>
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="group relative p-5 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer h-full"
      >
        <div className="flex items-start gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${colorMap[color] || colorMap.primary}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
        </div>
      </motion.div>
    </Link>
  );
}