import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Image, Sparkles, ArrowRight, Zap, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pdfTools, imageTools } from "../lib/toolsData";
import ToolCard from "../components/ToolCard";

const features = [
  { icon: Zap, title: "Lightning Fast", desc: "Process files in seconds, right in your browser" },
  { icon: Shield, title: "100% Secure", desc: "Files never leave your device — processed locally" },
  { icon: Globe, title: "Works Everywhere", desc: "Desktop, tablet, or phone — always ready" },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              All-in-one document processing
            </div>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight">
              Edit PDFs & Images{" "}
              <span className="text-primary">in one place</span>
            </h1>
            <p className="text-lg text-muted-foreground mt-6 max-w-xl mx-auto leading-relaxed">
              Merge, convert, compress, and enhance your files instantly.
              No uploads to servers — everything happens in your browser.
            </p>
            <div className="flex items-center justify-center gap-3 mt-8">
              <Link to="/pdf-tools">
                <Button size="lg" className="rounded-xl font-heading font-semibold shadow-lg shadow-primary/20">
                  <FileText className="w-4 h-4 mr-2" />
                  PDF Tools
                </Button>
              </Link>
              <Link to="/image-tools">
                <Button size="lg" variant="outline" className="rounded-xl font-heading font-semibold">
                  <Image className="w-4 h-4 mr-2" />
                  Image Tools
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-sm text-foreground">{f.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular PDF Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-xl text-foreground">Popular PDF Tools</h2>
          <Link to="/pdf-tools" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {pdfTools.flatMap(c => c.tools).slice(0, 6).map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>

      {/* Image Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-xl text-foreground">Image Tools</h2>
          <Link to="/image-tools" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {imageTools.slice(0, 4).map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>
    </div>
  );
}