import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-xs">J</span>
              </div>
              <span className="font-heading font-bold text-foreground">Jadec</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              One place to handle all your PDF and image processing needs. Fast, secure, and free.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-sm mb-3 text-foreground">PDF Tools</h3>
            <ul className="space-y-2">
              {["Merge PDF", "Split PDF", "Compress PDF", "Convert PDF"].map((t) => (
                <li key={t}>
                  <Link to="/pdf-tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-sm mb-3 text-foreground">Image Tools</h3>
            <ul className="space-y-2">
              {["Compress Image", "Resize Image", "Convert Image", "Crop Image"].map((t) => (
                <li key={t}>
                  <Link to="/image-tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-sm mb-3 text-foreground">Info</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-3.5 h-3.5" />
                Files processed in-browser
              </li>
              <li className="text-sm text-muted-foreground">No files stored on servers</li>
              <li className="text-sm text-muted-foreground">Free to use</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Jadec Customization App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}