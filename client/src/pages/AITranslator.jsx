import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Breadcrumb from '@/components/Breadcrumb';
import { Languages, ArrowDown, Copy, Loader2, Info } from 'lucide-react';

// Language list
const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { code: "th", name: "Thai", flag: "🇹🇭" },
  { code: "auto", name: "Auto Detect", flag: "🔍" }
];

export default function AITranslator() {
  const { toast } = useToast();
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('id');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle text input change
  const handleInputChange = (e) => {
    setSourceText(e.target.value);
  };

  // Handle language swap
  const handleSwapLanguages = () => {
    if (sourceLanguage !== 'auto') {
      const temp = sourceLanguage;
      setSourceLanguage(targetLanguage);
      setTargetLanguage(temp);
      
      if (translatedText) {
        setSourceText(translatedText);
        setTranslatedText('');
        setDetectedLanguage('');
      }
    } else {
      toast({
        title: "Cannot swap with Auto Detect",
        description: "Please select a specific source language to swap.",
      });
    }
  };

  // Handle translate button click
  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "Text required",
        description: "Please enter some text to translate.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Call the real translation API
      const response = await fetch('/api/gemini/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          sourceLanguage, 
          targetLanguage,
          preserveFormatting: true,
          formalityLevel: 'standard'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      setTranslatedText(result.translatedText);
      
      // Set detected language if available and source was auto
      if (sourceLanguage === 'auto' && result.detectedLanguage) {
        setDetectedLanguage(result.detectedLanguage);
      } else {
        setDetectedLanguage('');
      }
      
      toast({
        title: "Translation complete",
        description: "Your text has been translated successfully.",
      });
    } catch (error) {
      console.error('Translation error:', error);
      setErrorMessage('Terjadi kesalahan saat menerjemahkan teks. Silakan coba lagi.');
      toast({
        title: "Translation failed",
        description: "An error occurred while translating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Copy text to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Text copied successfully!",
        });
      })
      .catch(err => {
        console.error('Copy failed:', err);
        toast({
          title: "Copy failed",
          description: "Could not copy text to clipboard.",
          variant: "destructive",
        });
      });
  };

  // Get flag display for language select
  const getFlagDisplay = (code) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.flag : "🔍";
  };
  
  // Get language name from code
  const getLanguageName = (code) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.name : code;
  };

  return (
    <div className="container mx-auto p-4 mt-16 max-w-5xl dark:text-slate-200">
      <Breadcrumb 
        items={[
          { label: "Tools", path: "/tools" },
          { label: "AI Translator", path: "/tools/ai-translator", isActive: true }
        ]} 
      />
      
      {/* Source Text Section */}
      <div className="rounded-lg border dark:border-slate-700 p-4 shadow-sm dark:bg-slate-900 mb-4">
        <div className="mb-4 flex justify-between items-center">
          <select 
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
            className="rounded-md border dark:border-slate-700 dark:bg-slate-800 px-3 py-1 w-full max-w-[180px]"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
        
        <textarea
          value={sourceText}
          onChange={handleInputChange}
          placeholder="Masukkan teks yang ingin diterjemahkan..."
          className="w-full rounded-md border dark:border-slate-700 dark:bg-slate-800 min-h-[150px] p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-500 dark:text-slate-400">{sourceText.length} karakter</span>
          <button 
            onClick={() => setSourceText('')}
            disabled={!sourceText}
            className="text-sm text-blue-500 dark:text-blue-400 hover:underline disabled:text-gray-400 disabled:dark:text-gray-600 disabled:no-underline"
          >
            Clear
          </button>
        </div>
      </div>
      
      {/* Swap Button (Center) */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleSwapLanguages}
          disabled={sourceLanguage === 'auto' || isLoading}
          className="w-14 h-14 rounded-full bg-blue-600 dark:bg-blue-700 text-white flex items-center justify-center hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 shadow-md"
        >
          <ArrowDown className="h-6 w-6" />
        </button>
      </div>
      
      {/* Translation Result Section */}
      <div className="rounded-lg border dark:border-slate-700 p-4 shadow-sm dark:bg-slate-900 mb-8">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-medium dark:text-white">Hasil Terjemahan</h2>
          
          <div className="flex items-center">
            <div className="mr-2">
              {getFlagDisplay(targetLanguage)}
            </div>
            <select 
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="rounded-md border dark:border-slate-700 dark:bg-slate-800 px-3 py-1"
            >
              {languages.filter(lang => lang.code !== 'auto').map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Detected Language Info */}
        {detectedLanguage && (
          <div className="mb-2 flex items-center text-sm text-blue-500 dark:text-blue-400">
            <Info className="h-4 w-4 mr-1" />
            <span>Bahasa terdeteksi: {getLanguageName(detectedLanguage)}</span>
          </div>
        )}
        
        <div className="dark:bg-slate-800 bg-slate-50 min-h-[150px] rounded-md p-4 text-gray-700 dark:text-slate-300">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="ml-3 text-slate-600 dark:text-slate-400">Menerjemahkan...</span>
            </div>
          ) : errorMessage ? (
            <div className="flex flex-col items-center justify-center h-full text-red-500 dark:text-red-400 text-center">
              <p>{errorMessage}</p>
            </div>
          ) : translatedText ? (
            <p className="whitespace-pre-wrap">{translatedText}</p>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-slate-500 text-center">
              <Languages className="h-12 w-12 mb-2 opacity-20" />
              <p>Hasil terjemahan akan ditampilkan di sini</p>
              <p className="text-sm mt-2">Masukkan teks dan klik tombol "Terjemahkan"</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => handleCopy(translatedText)}
            disabled={!translatedText || isLoading}
            className="px-3 py-1 border dark:border-slate-700 rounded-md flex items-center gap-1 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Copy className="h-4 w-4" />
            <span>Salin</span>
          </button>
          
          <button
            onClick={handleTranslate}
            disabled={isLoading || !sourceText.trim()}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md disabled:opacity-50 hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            {isLoading ? 'Menerjemahkan...' : 'Terjemahkan'}
          </button>
        </div>
      </div>
      
      {/* Powered by Section */}
      <div className="text-center text-gray-500 dark:text-gray-400 text-sm mb-8">
        <p>Powered by Marko AI</p>
      </div>
    </div>
  );
}