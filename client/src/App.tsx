
import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";

// Halaman Utama
const NotFoundPage = React.lazy(() => import("@/pages/NotFoundPage"));
const Home = React.lazy(() => import("@/pages/Home"));
const Tools = React.lazy(() => import("@/pages/Tools"));
const About = React.lazy(() => import("@/pages/About"));
const Kontak = React.lazy(() => import("@/pages/Kontak"));
const Privacy = React.lazy(() => import("@/pages/Privacy"));
const Terms = React.lazy(() => import("@/pages/Terms"));
const Blog = React.lazy(() => import("@/pages/Blog"));
const BlogDetail = React.lazy(() => import("@/pages/BlogDetail"));
const SearchResults = React.lazy(() => import("@/pages/SearchResults"));

// Halaman Admin
const AdminLogin = React.lazy(() => import("@/pages/admin/login"));
const AdminDashboard = React.lazy(() => import("@/pages/admin/dashboard"));
const PostEditor = React.lazy(() => import("@/pages/blog/PostEditor"));
const PostList = React.lazy(() => import("@/pages/blog/PostList"));

// Wrapper untuk halaman admin yang dilindungi
const AdminPostEditorPage = () => (
  <ProtectedRoute adminOnly={true}>
    <PostEditor />
  </ProtectedRoute>
);

const AdminPostListPage = () => (
  <ProtectedRoute adminOnly={true}>
    <PostList />
  </ProtectedRoute>
);

// Halaman Tools
const ContentGenerator = React.lazy(() => import("@/pages/ContentGenerator"));
const FacebookPostCreator = React.lazy(() => import("@/pages/FacebookPostCreator"));
const YoutubeScriptGenerator = React.lazy(() => import("@/pages/YoutubeScriptGenerator"));
const KeywordResearch = React.lazy(() => import("@/pages/KeywordResearch"));
const CodeDebugger = React.lazy(() => import("@/pages/CodeDebugger"));
const CodeGenerator = React.lazy(() => import("@/pages/CodeGenerator"));
const CodeOptimizer = React.lazy(() => import("@/pages/CodeOptimizer"));
const TwitterThreadCreator = React.lazy(() => import("@/pages/TwitterThreadCreator"));
const MetaDescriptionGenerator = React.lazy(() => import("@/pages/MetaDescriptionGenerator"));
const KonsultasiKesehatan = React.lazy(() => import("@/pages/KonsultasiKesehatan"));
const AnalisaGejala = React.lazy(() => import("@/pages/AnalisaGejala"));
const TipsSehat = React.lazy(() => import("@/pages/TipsSehat"));
const PenjelasanMateri = React.lazy(() => import("@/pages/PenjelasanMateri"));
const PembuatanSoal = React.lazy(() => import("@/pages/PembuatanSoal"));
const InstagramCaption = React.lazy(() => import("@/pages/InstagramCaption"));
const PeopleAlsoAsk = React.lazy(() => import("@/pages/PeopleAlsoAsk"));
const YouTubeToText = React.lazy(() => import("@/pages/YouTubeToText"));
const RingkasanBuku = React.lazy(() => import("@/pages/RingkasanBuku"));
const SEOContentOptimizer = React.lazy(() => import("@/pages/SEOContentOptimizer"));
const ImageGenerator = React.lazy(() => import("@/pages/ImageGenerator"));
const LiveEditor = React.lazy(() => import("@/pages/LiveEditor"));
const EmailGenerator = React.lazy(() => import("@/pages/EmailGenerator"));
const AutoIndexArtikel = React.lazy(() => import("@/pages/AutoIndexArtikel"));
const CVResumeBuilder = React.lazy(() => import("@/pages/CVResumeBuilder"));
const ResepCreator = React.lazy(() => import("@/pages/ResepCreator"));
const FakeChatGenerator = React.lazy(() => import("@/pages/FakeChatGenerator"));
const AITranslator = React.lazy(() => import("@/pages/AITranslator"));
const CodeReviewAssistant = React.lazy(() => import("@/pages/CodeReviewAssistant"));
const JingleCreator = React.lazy(() => import("@/pages/JingleCreator"));
const BusinessPlanGenerator = React.lazy(() => import("@/pages/BusinessPlanGenerator"));
const Base64Tool = React.lazy(() => import("@/pages/Base64Tool"));
const FinancialCalculator = React.lazy(() => import("@/pages/FinancialCalculator"));
const ContractGenerator = React.lazy(() => import("@/pages/ContractGenerator"));
const RichSnippetCreator = React.lazy(() => import("@/pages/RichSnippetCreator"));
const QRCodeGenerator = React.lazy(() => import("@/pages/tools/QRCodeGenerator"));
const AIChat = React.lazy(() => import("@/pages/AIChat"));
const AICharacters = React.lazy(() => import("@/pages/AICharacters"));
const AICharacterChat = React.lazy(() => import("@/pages/AICharacterChat"));

// Komponen fallback sederhana
const SimpleLoadingFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" role="status"></div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Memuat...</p>
    </div>
  </div>
);

function App() {
  const [location] = useLocation();
  // Cek apakah berada di halaman chat AI karakter
  const isAICharacterChat = location.startsWith('/ai-karakter/');
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="dark">
        {/* Tampilkan header hanya jika bukan di halaman chat karakter */}
        {!isAICharacterChat && <Header />}
        
        <React.Suspense fallback={<SimpleLoadingFallback />}>
          <div className={`min-h-screen ${!isAICharacterChat ? 'pb-10' : ''} bg-gradient-to-b from-slate-900/5 to-transparent`}>
            {/* Header spacing hanya ditampilkan di luar halaman chat karakter */}
            {!isAICharacterChat && (
              <>
                {/* Header spacing */}
                <div className="h-16 md:h-16"></div>
                {/* Subtle divider */}
                <div className="pb-2">
                  <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-400/10 to-transparent"></div>
                </div>
              </>
            )}
            <Switch>
              {/* Rute Halaman Utama */}
              <Route path="/" component={Home} />
              <Route path="/tools" component={Tools} />
              <Route path="/about" component={About} />
              <Route path="/kontak" component={Kontak} />
              <Route path="/privacy" component={Privacy} />
              <Route path="/terms" component={Terms} />
              <Route path="/chat" component={AIChat} />
              <Route path="/ai-karakter" component={AICharacters} />
              <Route path="/ai-karakter/:slug" component={AICharacterChat} />
              <Route path="/blog" component={Blog} />
              <Route path="/blog/:slug" component={BlogDetail} />
              <Route path="/search" component={SearchResults} />
              
              {/* Rute Admin */}
              <Route path="/admin/login" component={AdminLogin} />
              <Route path="/admin/dashboard">
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              </Route>
              <Route path="/admin/posts/new">
                <ProtectedRoute adminOnly={true}>
                  <PostEditor />
                </ProtectedRoute>
              </Route>
              <Route path="/admin/posts/edit/:id">
                <ProtectedRoute adminOnly={true}>
                  <PostEditor />
                </ProtectedRoute>
              </Route>
              <Route path="/admin/posts">
                <ProtectedRoute adminOnly={true}>
                  <PostList />
                </ProtectedRoute>
              </Route>
              
              {/* Rute Tools */}
              <Route path="/tools/gemini-konten" component={ContentGenerator} />
              <Route path="/tools/facebook-post" component={FacebookPostCreator} />
              <Route path="/tools/youtube-script" component={YoutubeScriptGenerator} />
              <Route path="/tools/keyword-research" component={KeywordResearch} />
              <Route path="/tools/code-debugger" component={CodeDebugger} />
              <Route path="/tools/code-generator" component={CodeGenerator} />
              <Route path="/tools/code-optimizer" component={CodeOptimizer} />
              <Route path="/tools/twitter-thread" component={TwitterThreadCreator} />
              <Route path="/tools/meta-description" component={MetaDescriptionGenerator} />
              <Route path="/tools/konsultasi-kesehatan" component={KonsultasiKesehatan} />
              <Route path="/tools/analisis-gejala" component={AnalisaGejala} />
              <Route path="/tools/tips-sehat" component={TipsSehat} />
              <Route path="/tools/penjelasan-materi" component={PenjelasanMateri} />
              <Route path="/tools/pembuatan-soal" component={PembuatanSoal} />
              <Route path="/tools/instagram-caption" component={InstagramCaption} />
              <Route path="/tools/people-also-ask" component={PeopleAlsoAsk} />
              <Route path="/tools/youtube-to-text" component={YouTubeToText} />
              <Route path="/tools/ringkasan-buku" component={RingkasanBuku} />
              <Route path="/tools/seo-optimizer" component={SEOContentOptimizer} />
              <Route path="/tools/image-generator" component={ImageGenerator} />
              <Route path="/tools/live-editor" component={LiveEditor} />
              <Route path="/tools/email-generator" component={EmailGenerator} />
              <Route path="/tools/auto-index-artikel" component={AutoIndexArtikel} />
              <Route path="/tools/cv-resume-builder" component={CVResumeBuilder} />
              <Route path="/tools/resep-creator" component={ResepCreator} />
              <Route path="/tools/fake-chat-generator" component={FakeChatGenerator} />
              <Route path="/tools/ai-translator" component={AITranslator} />
              <Route path="/tools/code-review-assistant" component={CodeReviewAssistant} />
              <Route path="/tools/jingle-creator" component={JingleCreator} />
              <Route path="/tools/business-plan-generator" component={BusinessPlanGenerator} />
              <Route path="/tools/base64" component={Base64Tool} />
              <Route path="/tools/financial-calculator" component={FinancialCalculator} />
              <Route path="/tools/contract-generator" component={ContractGenerator} />
              <Route path="/tools/rich-snippet-creator" component={RichSnippetCreator} />
              <Route path="/tools/qr-code-generator" component={QRCodeGenerator} />
              
              {/* Fallback untuk rute yang tidak ada */}
              <Route component={NotFoundPage} />
            </Switch>
          </div>
        </React.Suspense>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
