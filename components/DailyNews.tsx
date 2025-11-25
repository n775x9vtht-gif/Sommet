
import React, { useEffect, useState } from 'react';
import { generateDailyBriefing } from '../services/geminiService';
import { DailyArticle } from '../types';
import { IconClock, IconNewspaper, IconCheck, IconMountain, IconRocket } from './Icons';

interface DailyNewsProps {
  onNavigateToGenerator: () => void;
}

const DailyNews: React.FC<DailyNewsProps> = ({ onNavigateToGenerator }) => {
  // Helper to determine the correct storage key based on the 06h00 rule
  const getEditionKey = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    let targetDate = new Date(now);
    
    // Si on est avant 06h00, l'édition active est celle d'HIER
    if (currentHour < 6) {
      targetDate.setDate(targetDate.getDate() - 1);
    }
    
    // Format YYYY-MM-DD pour éviter les variations locales
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    const editionDateStr = `${year}-${month}-${day}`;
    
    return {
        key: `sommet_daily_${editionDateStr}`,
        displayDate: targetDate.toLocaleDateString('fr-FR')
    };
  };

  // LAZY INITIALIZATION: Check localStorage BEFORE the first render
  // This prevents the loading screen from flashing if data exists
  const [article, setArticle] = useState<DailyArticle | null>(() => {
    const { key } = getEditionKey();
    const storedData = localStorage.getItem(key);
    if (storedData) {
        try {
            return JSON.parse(storedData);
        } catch (e) {
            console.error("Error parsing stored article", e);
            return null;
        }
    }
    return null;
  });

  // Loading is true only if we didn't find an article in the initial state
  const [loading, setLoading] = useState(!article);
  const [statusMessage, setStatusMessage] = useState("Connexion aux flux d'actualités...");

  useEffect(() => {
    // If we already have the article from lazy init, do nothing.
    if (article) return;

    const fetchDaily = async () => {
      const { key, displayDate } = getEditionKey();
      
      try {
        setLoading(true);
        setStatusMessage("L'IA scanne le web pour les tendances du jour...");
        
        // This call uses Google Search Grounding for REAL data
        const result = await generateDailyBriefing();
        
        const newArticle: DailyArticle = {
          date: displayDate,
          title: result.title,
          category: result.category as any,
          readTime: result.readTime,
          content: result.content,
          summary: result.summary,
          keyTakeaways: result.keyTakeaways,
          sources: result.sources || []
        };
        
        localStorage.setItem(key, JSON.stringify(newArticle));
        setArticle(newArticle);
      } catch (error) {
        console.error("Failed to generate daily news", error);
        setStatusMessage("Erreur de génération. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDaily();
  }, []); // Empty dependency array: only run on mount if needed

  // Improved Parser for NYT style
  const renderMarkdown = (content: string) => {
    if (!content) return null;
    
    // Normalize newlines
    const blocks = content.split(/\n\s*\n/);

    return blocks.map((block, index) => {
        let cleanBlock = block.trim();
        
        // Headers (##) - Remove '#' and style as Display Serif
        if (cleanBlock.startsWith('#')) {
            const text = cleanBlock.replace(/^[#]+\s*/, '');
            return (
                <h3 key={index} className="font-display text-2xl md:text-3xl font-bold text-white mt-12 mb-6 first:mt-0 leading-tight tracking-tight">
                    {text}
                </h3>
            );
        }

        // Fallback for lists if AI disobeys (convert to simple paragraphs or spans)
        if (cleanBlock.startsWith('-') || cleanBlock.startsWith('* ')) {
            cleanBlock = cleanBlock.replace(/^[-*]\s*/, '');
        }

        // Paragraphs - Georgia font, light grey, readable line-height
        // Check if it's the very first paragraph to add drop cap (lettrine)
        const isFirstParagraph = index === 0;
        
        // Clean bold artifacts if they exist and are overwhelming, but keep semantic emphasis
        // This simple parser keeps HTML strong tags
        
        return (
            <p 
                key={index} 
                className={`font-news text-[1.15rem] leading-[1.8] text-slate-300 mb-6 tracking-wide antialiased ${isFirstParagraph ? 'first-letter:float-left first-letter:text-6xl first-letter:mr-3 first-letter:mt-[-8px] first-letter:font-display first-letter:text-white first-letter:font-bold' : ''}`}
                dangerouslySetInnerHTML={{ __html: parseBold(cleanBlock) }}
            />
        );
    });
  };

  // Simple bold parser (**text**)
  const parseBold = (text: string) => {
    // Replace **text** with <strong>text</strong>
    return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-24 h-24 mb-8">
             <div className="absolute inset-0 border-t-2 border-gold-500 rounded-full animate-spin"></div>
             <IconMountain className="absolute inset-0 m-auto w-8 h-8 text-slate-600" />
        </div>
        <h2 className="text-3xl font-display text-white italic mb-2 animate-pulse">Édition en cours de rédaction...</h2>
        <p className="text-slate-500 font-sans text-sm tracking-wider uppercase animate-pulse">{statusMessage}</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-gold-500 bg-gold-900/20 px-3 py-1 rounded-full border border-gold-500/20">
            <div className="w-2 h-2 bg-gold-500 rounded-full animate-ping"></div>
            Recherche Google en temps réel active
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-32">
      
      {/* Article Header */}
      <header className="mb-16 text-center border-b border-dark-700 pb-12 pt-4">
        <div className="flex items-center justify-center gap-4 text-xs font-bold text-gold-500 uppercase tracking-[0.2em] mb-8 font-sans">
            <span className="flex items-center"><IconNewspaper className="w-4 h-4 mr-2" /> Sommet Daily</span>
            <span className="w-1 h-1 bg-gold-500 rounded-full opacity-50"></span>
            <span className="text-slate-400">{article.date}</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-8 leading-[1.1] max-w-4xl mx-auto tracking-tight">
            {article.title}
        </h1>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 font-sans">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <span className="font-display text-dark-900 font-black text-xl italic">S</span>
                </div>
                <div className="text-left">
                    <div className="text-xs font-bold text-white uppercase tracking-wide">Par L'IA Sommet</div>
                    <div className="text-[10px] text-gold-500 font-bold">Basé sur Google Search</div>
                </div>
             </div>
             <div className="hidden md:block h-8 w-px bg-dark-700"></div>
             <div className="flex items-center gap-4">
                <span className="px-4 py-1.5 bg-dark-800 border border-dark-600 rounded-full text-xs font-bold text-slate-300 tracking-wide uppercase">
                    {article.category}
                </span>
                <span className="flex items-center text-xs text-slate-500 font-bold uppercase tracking-wide">
                    <IconClock className="w-3 h-3 mr-2" /> {article.readTime} de lecture
                </span>
            </div>
        </div>
      </header>

      {/* Article Layout: 2 Columns (Content + Sticky Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Main Content */}
          <article className="lg:col-span-8">
             {/* Dateline */}
             <div className="mb-6 font-sans text-xs font-bold tracking-widest text-slate-500 uppercase">
                PARIS <span className="text-gold-500">—</span>
             </div>

            {renderMarkdown(article.content)}

            {/* End of article mark */}
            <div className="flex justify-center my-12">
                <div className="w-24 h-1 bg-dark-700 rounded-full"></div>
            </div>
          </article>

          {/* Right Column: Sidebar (Sticky) */}
          <aside className="lg:col-span-4 space-y-10">
              {/* Key Takeaways Widget (STATIC - No Rotation) */}
              <div className="bg-slate-200 text-dark-900 rounded-xl p-8 sticky top-8 shadow-xl">
                <div className="border-b-2 border-dark-900 pb-4 mb-6 flex justify-between items-center">
                    <h3 className="font-display font-bold text-2xl tracking-tight">L'essentiel</h3>
                    <IconCheck className="w-6 h-6 text-dark-900" />
                </div>
                <ul className="space-y-6">
                    {article.keyTakeaways.map((point, idx) => (
                        <li key={idx} className="relative pl-6">
                             <span className="absolute left-0 top-0 font-display font-bold text-xl text-brand-600 italic">{idx + 1}.</span>
                             <span className="font-news text-dark-800 text-lg leading-snug">{point}</span>
                        </li>
                    ))}
                </ul>
              </div>
          </aside>
      </div>

      {/* Bottom CTA Banner */}
      <div className="mt-24 mb-16">
         <div className="relative bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden text-center md:text-left">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px]"></div>
            
            <div className="relative z-10 max-w-2xl">
                <h3 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
                    Transformez l'information en <span className="text-gold-500">opportunité</span>.
                </h3>
                <p className="text-slate-400 text-lg font-news">
                    Cette analyse révèle un potentiel de marché. Ne laissez pas cette idée s'envoler. Utilisez notre générateur pour créer votre MVP dès maintenant.
                </p>
            </div>
            <button 
                onClick={onNavigateToGenerator}
                className="relative z-10 px-8 py-4 bg-white hover:bg-slate-100 text-dark-900 font-sans font-bold text-lg rounded-xl transition-all hover:-translate-y-1 shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center gap-3 flex-shrink-0"
            >
                <IconRocket className="w-6 h-6 text-brand-600" />
                Exploiter cette tendance
            </button>
         </div>
      </div>

      {/* Sources Section (Moved to bottom, Grid Layout) */}
      {article.sources && article.sources.length > 0 && (
        <div className="pt-12 border-t border-dark-700/50">
            <h4 className="text-xs font-sans font-bold text-slate-500 uppercase mb-8 tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
                Sources Vérifiées
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {article.sources.map((source, idx) => (
                    <a 
                        key={idx}
                        href={source.url}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="group flex flex-col bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-lg p-4 transition-all"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-slate-500 text-xs font-mono bg-dark-900 px-2 py-0.5 rounded">Ref {idx + 1}</span>
                            <span className="text-[10px] text-gold-500 uppercase font-bold tracking-wide">Source Externe</span>
                        </div>
                        <span className="text-slate-300 group-hover:text-white text-sm font-medium line-clamp-2 leading-relaxed">
                            {source.title}
                        </span>
                    </a>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default DailyNews;
