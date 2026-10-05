import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
// Add page imports here
import Layout from './components/Layout';
import Home from './pages/Home';
import PdfTools from './pages/PdfTools';
import ImageTools from './pages/ImageTools';
import AiTools from './pages/AiTools';
import MergePdf from './pages/pdf/MergePdf';
import SplitPdf from './pages/pdf/SplitPdf';
import CompressPdf from './pages/pdf/CompressPdf';
import RotatePdf from './pages/pdf/RotatePdf';
import WatermarkPdf from './pages/pdf/WatermarkPdf';
import PageNumbers from './pages/pdf/PageNumbers';
import ProtectPdf from './pages/pdf/ProtectPdf';
import UnlockPdf from './pages/pdf/UnlockPdf';
import PdfToJpg from './pages/pdf/PdfToJpg';
import JpgToPdf from './pages/pdf/JpgToPdf';
import OcrPdf from './pages/pdf/OcrPdf';
import SummarizePdf from './pages/pdf/SummarizePdf';
import CompressImage from './pages/image/CompressImage';
import ResizeImage from './pages/image/ResizeImage';
import ConvertImage from './pages/image/ConvertImage';
import CropImage from './pages/image/CropImage';
import WatermarkImage from './pages/image/WatermarkImage';
import FiltersImage from './pages/image/FiltersImage';
import EnhanceImage from './pages/image/EnhanceImage';
import RemoveBg from './pages/image/RemoveBg';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pdf-tools" element={<PdfTools />} />
        <Route path="/image-tools" element={<ImageTools />} />
        <Route path="/ai-tools" element={<AiTools />} />
        <Route path="/pdf/merge" element={<MergePdf />} />
        <Route path="/pdf/split" element={<SplitPdf />} />
        <Route path="/pdf/compress" element={<CompressPdf />} />
        <Route path="/pdf/rotate" element={<RotatePdf />} />
        <Route path="/pdf/watermark" element={<WatermarkPdf />} />
        <Route path="/pdf/page-numbers" element={<PageNumbers />} />
        <Route path="/pdf/protect" element={<ProtectPdf />} />
        <Route path="/pdf/unlock" element={<UnlockPdf />} />
        <Route path="/pdf/to-jpg" element={<PdfToJpg />} />
        <Route path="/pdf/jpg-to-pdf" element={<JpgToPdf />} />
        <Route path="/pdf/ocr" element={<OcrPdf />} />
        <Route path="/pdf/summarize" element={<SummarizePdf />} />
        <Route path="/image/compress" element={<CompressImage />} />
        <Route path="/image/resize" element={<ResizeImage />} />
        <Route path="/image/convert" element={<ConvertImage />} />
        <Route path="/image/crop" element={<CropImage />} />
        <Route path="/image/watermark" element={<WatermarkImage />} />
        <Route path="/image/filters" element={<FiltersImage />} />
        <Route path="/image/enhance" element={<EnhanceImage />} />
        <Route path="/image/remove-bg" element={<RemoveBg />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App