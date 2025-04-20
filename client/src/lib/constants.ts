import { 
  Package, Sparkles, Zap, Video, Key, Server, 
  Newspaper, Eye, Image, Search, Bot, HelpCircle,
  MessageSquare
} from "lucide-react";
import { ToolCategory } from "./types";

// For TypeScript, we'll use string identifiers instead of actual components
export type IconType = 
  | "Package" | "Sparkles" | "Zap" | "Video" | "Key" 
  | "Server" | "Newspaper" | "Eye" | "Image" 
  | "Search" | "Bot" | "HelpCircle" | "MessageSquare";

// Modified ToolCategory type without JSX
export interface ToolCategoryData {
  name: string;
  path: string;
  iconType: IconType;
  bgColor: string;
}

// Store the raw data with icon names instead of components
export const toolCategoriesData: ToolCategoryData[] = [
  {
    name: "PAKET OPTIMASI",
    path: "/tools/paket-optimasi",
    iconType: "Package",
    bgColor: "bg-primary"
  },
  {
    name: "NEW! ✨ GEMINI KONTEN GENERATOR",
    path: "/tools/gemini-konten",
    iconType: "Sparkles",
    bgColor: "bg-green-500"
  },
  {
    name: "TOP #1 TOOLS INSTANT ARTIKEL FADDENSE",
    path: "/tools/instant-artikel",
    iconType: "Zap",
    bgColor: "bg-yellow-500"
  },
  {
    name: "NEW TOOLS AI YOUTUBE MENJADI TEXT",
    path: "/tools/youtube-text",
    iconType: "Video",
    bgColor: "bg-purple-500"
  },
  {
    name: "TOP #2 TOOLS RISET KEYWORD PREMIUM",
    path: "/tools/riset-keyword",
    iconType: "Key",
    bgColor: "bg-blue-600"
  },
  {
    name: "WORDPRESS #1 HOSTING GRATIS SEUMUR HIDUP",
    path: "/tools/wordpress-hosting",
    iconType: "Server",
    bgColor: "bg-green-600"
  },
  {
    name: "TOP #3 MEDIA NEWS AI BERITA INDONESIA",
    path: "/tools/media-news",
    iconType: "Newspaper",
    bgColor: "bg-orange-500"
  },
  {
    name: "NEW TOOLS HARUS DETEKSI AI HUMANIZE",
    path: "/tools/deteksi-ai",
    iconType: "Eye",
    bgColor: "bg-red-500"
  },
  {
    name: "NEW TOOLS GAMBAR AI [CREATOR]",
    path: "/tools/gambar-ai",
    iconType: "Image",
    bgColor: "bg-indigo-500"
  },
  {
    name: "NEW ❇️ BING GPT+4 KONTEN GENERATOR",
    path: "/tools/bing-gpt4",
    iconType: "Search",
    bgColor: "bg-teal-500"
  },
  {
    name: "TOP #5 TOOLS AGP REWRITE ARTIKEL AI ROBOT",
    path: "/tools/rewrite-artikel",
    iconType: "Bot",
    bgColor: "bg-blue-500"
  },
  {
    name: "NEW 💠 TOOLS KEYWORD PEOPLE ALSO ASK",
    path: "/tools/keyword-ask",
    iconType: "HelpCircle",
    bgColor: "bg-pink-500"
  },
];

// Provide a utility function to map icon types to components (to be used in TSX files)
export const getIconComponent = (iconType: IconType) => {
  const iconMap: Record<IconType, React.FC<any>> = {
    Package,
    Sparkles,
    Zap,
    Video,
    Key,
    Server,
    Newspaper,
    Eye,
    Image,
    Search,
    Bot,
    HelpCircle,
    MessageSquare
  };
  return iconMap[iconType];
};
