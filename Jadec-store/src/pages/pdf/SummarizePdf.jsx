import { useState } from "react";
import { Sparkles } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import ToolPageWrapper from "../../components/ToolPageWrapper";
import FileUploader from "../../components/FileUploader";
import ProcessingOverlay from "../../components/ProcessingOverlay";

export default function SummarizePdf() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [summary, setSummary] = useState("");

  const handleSummarize = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setSummary("");

    const { file_url } = await base44.integrations.Core.UploadFile({ file: files[0] });

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Please analyze and summarize the document at the provided URL. Provide:
      1. A brief executive summary (2-3 sentences)
      2. Key points (bullet points)
      3. Main topics covered
      4. Any important data or statistics mentioned
      
      Format the response in clean markdown.`,
      file_urls: [file_url],
    });

    setSummary(result);
    setProcessing(false);
  };

  return (
    <ToolPageWrapper title="AI Summarize" description="Get an AI-powered summary of your document" icon={Sparkles} backPath="/pdf-tools" backLabel="PDF Tools">
      <FileUploader accept=".pdf,.doc,.docx,.txt" onFilesSelected={setFiles} label="Drop your document here" />

      {files.length > 0 && !summary && (
        <div className="mt-6 text-center">
          <button onClick={handleSummarize} disabled={processing} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold shadow-lg shadow-primary/20 transition-all disabled:opacity-50">
            <Sparkles className="w-4 h-4 inline mr-2" />
            Summarize Document
          </button>
        </div>
      )}

      {summary && (
        <div className="mt-8">
          <h3 className="font-heading font-semibold text-foreground mb-4">Document Summary</h3>
          <div className="p-6 rounded-2xl bg-card border border-border prose prose-sm prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        </div>
      )}

      <AnimatePresence>{processing && <ProcessingOverlay message="AI is reading your document..." />}</AnimatePresence>
    </ToolPageWrapper>
  );
}