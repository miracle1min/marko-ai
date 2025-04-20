import { useState, useRef, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Editor from "@monaco-editor/react";
import { saveAs } from "file-saver";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Copy,
  Download,
  Play,
  Code,
  FileCode,
  AlignLeft,
  Eye,
  Clipboard,
  Check,
  RefreshCw,
  Save,
  FileDown,
  Settings,
  BellRing
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AnimatedPage from "@/components/AnimatedPage";
import Breadcrumb from "@/components/Breadcrumb";
import { useIsMobile } from "@/hooks/use-mobile";

// Language options
const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "php", label: "PHP" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "go", label: "Go" },
  { value: "ruby", label: "Ruby" },
  { value: "rust", label: "Rust" },
  { value: "sql", label: "SQL" },
  { value: "xml", label: "XML" },
  { value: "yaml", label: "YAML" },
  { value: "shell", label: "Shell" },
];

// Theme options
const themes = [
  { value: "vs", label: "Light" },
  { value: "vs-dark", label: "Dark" },
  { value: "hc-black", label: "High Contrast" },
];

// Sample code templates
const codeTemplates: Record<string, string> = {
  javascript: `// JavaScript live editor example
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Try calling the function
console.log(greet('World'));

// You can also try DOM manipulation
// document.getElementById('result').textContent = greet('Developer');

// Arrow function example
const multiply = (a, b) => a * b;
console.log(multiply(5, 3));`,
  
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Editor Example</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2c3e50;
    }
    button {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    button:hover {
      background-color: #2980b9;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to Live Editor</h1>
    <p>This is a sample HTML template that you can edit and preview in real-time.</p>
    <button id="demoButton">Click Me!</button>
    <div id="result" style="margin-top: 20px;"></div>
  </div>

  <script>
    // Add some interactivity
    document.getElementById('demoButton').addEventListener('click', function() {
      document.getElementById('result').innerHTML = 'Button was clicked at ' + new Date().toLocaleTimeString();
    });
  </script>
</body>
</html>`,
  
  css: `/* CSS Code Example */
body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f4f4f4;
  padding: 20px;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  overflow: auto;
  padding: 0 20px;
}

header {
  background: #3a506b;
  color: #fff;
  padding: 1rem;
  text-align: center;
}

.card {
  background: #fff;
  padding: 20px;
  margin: 15px 0;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.btn {
  display: inline-block;
  background: #1c2541;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.3s;
}

.btn:hover {
  background: #0b132b;
}

@media (max-width: 700px) {
  .card {
    padding: 10px;
  }
}`,
  
  typescript: `// TypeScript live editor example
interface Person {
  name: string;
  age: number;
  email?: string;
  greet(): string;
}

class Employee implements Person {
  constructor(
    public name: string,
    public age: number,
    private department: string,
    public email?: string
  ) {}

  greet(): string {
    return \`Hello, my name is \${this.name}. I work in \${this.department}.\`;
  }

  // Method to get employee info
  getInfo(): string {
    return \`\${this.name} (\${this.age}) - \${this.department}\`;
  }
}

// Create a new employee
const employee = new Employee("John Doe", 30, "Engineering", "john@example.com");
console.log(employee.greet());
console.log(employee.getInfo());

// Generic function example
function getFirstElement<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[0] : undefined;
}

const numbers: number[] = [1, 2, 3, 4, 5];
const firstNumber = getFirstElement(numbers);
console.log(firstNumber);`,
  
  python: `# Python live editor example
def greet(name):
    """Simple function to greet someone"""
    return f"Hello, {name}!"

# Using the function
print(greet("World"))

# Define a class
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
        
    def introduce(self):
        return f"My name is {self.name} and I am {self.age} years old."
    
    def celebrate_birthday(self):
        self.age += 1
        return f"Happy Birthday! Now I am {self.age} years old."

# Create an instance of Person
person = Person("Alice", 30)
print(person.introduce())
print(person.celebrate_birthday())

# Working with lists
numbers = [1, 2, 3, 4, 5]
squared = [num ** 2 for num in numbers]
print(f"Original: {numbers}")
print(f"Squared: {squared}")`,
  
  markdown: `# Markdown Live Editor

## Introduction
This is a sample Markdown document to help you get started with the Live Editor.

## Text Formatting
You can make text **bold** or *italic* or ***both***.

## Lists

### Unordered List
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2
- Item 3

### Ordered List
1. First item
2. Second item
3. Third item

## Links and Images
[Visit Google](https://www.google.com)

![Alt text for an image](https://via.placeholder.com/150)

## Code Blocks
Inline code: \`const example = "hello world";\`

\`\`\`javascript
// Code block
function greet(name) {
  return \`Hello, \${name}!\`;
}
console.log(greet('Markdown'));
\`\`\`

## Tables
| Name | Age | Occupation |
|------|-----|------------|
| John | 32  | Developer  |
| Jane | 28  | Designer   |
| Bob  | 45  | Manager    |

## Blockquotes
> This is a blockquote.
> 
> It can span multiple lines.

## Horizontal Rule
---

## Task Lists
- [x] Complete task
- [ ] Incomplete task
- [ ] Another task`
};

// Simple Rich Text Editor component
const RichTextEditor = ({ content, setContent }: { content: string, setContent: (content: string) => void }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = content;
      
      // Focus the editor after content is set
      setTimeout(() => {
        if (ref.current) {
          ref.current.focus();
        }
      }, 100);
    }
  }, [content]);

  const handleInput = () => {
    if (ref.current) {
      setContent(ref.current.innerHTML);
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    
    // Get plain text from clipboard
    const text = e.clipboardData.getData('text/plain');
    
    // Insert at cursor position
    document.execCommand('insertText', false, text);
    
    // Update content state
    if (ref.current) {
      setContent(ref.current.innerHTML);
    }
  };

  const formatText = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (ref.current) {
      ref.current.innerHTML = ref.current.innerHTML.replace(/<\/?span[^>]*>/g, ''); // Clean up spans
      setContent(ref.current.innerHTML);
      ref.current.focus();
    }
  };

  return (
    <div className="rich-text-editor border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
      <div className="toolbar bg-gray-100 dark:bg-gray-800 p-2 border-b border-gray-300 dark:border-gray-600 flex flex-wrap gap-1">
        <button
          onClick={() => formatText('bold')}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>
        <button
          onClick={() => formatText('italic')}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Italic"
        >
          <span className="italic">I</span>
        </button>
        <button
          onClick={() => formatText('underline')}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Underline"
        >
          <span className="underline">U</span>
        </button>
        <span className="border-r border-gray-300 dark:border-gray-600 mx-1"></span>
        <button
          onClick={() => formatText('formatBlock', '<h1>')}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => formatText('formatBlock', '<h2>')}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => formatText('formatBlock', '<p>')}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Paragraph"
        >
          P
        </button>
        <span className="border-r border-gray-300 dark:border-gray-600 mx-1"></span>
        <button
          onClick={() => formatText('insertUnorderedList')}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Bullet List"
        >
          • List
        </button>
        <button
          onClick={() => formatText('insertOrderedList')}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Numbered List"
        >
          1. List
        </button>
        <span className="border-r border-gray-300 dark:border-gray-600 mx-1"></span>
        <button
          onClick={() => {
            const url = prompt('Enter link URL:', 'https://');
            if (url) formatText('createLink', url);
          }}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Insert Link"
        >
          🔗
        </button>
        <button
          onClick={() => {
            const url = prompt('Enter image URL:', 'https://');
            if (url) formatText('insertImage', url);
          }}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Insert Image"
        >
          🖼️
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        className="editor-content p-4 min-h-[300px] bg-white dark:bg-gray-900 focus:outline-none"
      ></div>
    </div>
  );
};

export default function LiveEditor() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [language, setLanguage] = useState<string>("javascript");
  const [theme, setTheme] = useState<string>("vs-dark");
  const [code, setCode] = useState<string>(codeTemplates.javascript);
  const [fileName, setFileName] = useState<string>("code.js");
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(true);
  const [previewContent, setPreviewContent] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [editorMode, setEditorMode] = useState<"code" | "rich">("code");
  const [richContent, setRichContent] = useState<string>("<p>Start typing your rich text content here...</p>");

  // Preview iframe reference
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Function to update the preview when language or code changes
  useEffect(() => {
    if (language === 'html') {
      setPreviewContent(code);
    } else if (language === 'javascript') {
      setPreviewContent(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>JavaScript Preview</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
            .log { margin: 5px 0; padding: 5px; border-bottom: 1px solid #eee; }
            .error { color: red; }
          </style>
        </head>
        <body>
          <h2>JavaScript Output:</h2>
          <div id="output"></div>
          <script>
            // Capture console.log output
            const output = document.getElementById('output');
            const originalConsoleLog = console.log;
            const originalConsoleError = console.error;
            
            console.log = function(...args) {
              originalConsoleLog.apply(console, args);
              const logItem = document.createElement('div');
              logItem.className = 'log';
              logItem.textContent = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : arg
              ).join(' ');
              output.appendChild(logItem);
            };
            
            console.error = function(...args) {
              originalConsoleError.apply(console, args);
              const logItem = document.createElement('div');
              logItem.className = 'log error';
              logItem.textContent = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : arg
              ).join(' ');
              output.appendChild(logItem);
            };
            
            try {
              ${code}
            } catch (e) {
              console.error('Error:', e.message);
            }
          </script>
        </body>
        </html>
      `);
    } else if (language === 'css') {
      setPreviewContent(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>CSS Preview</title>
          <style>${code}</style>
        </head>
        <body>
          <div class="container">
            <header>
              <h1>CSS Preview</h1>
              <p>This is a preview of your CSS styling</p>
            </header>
            <div class="card">
              <h2>Example Card</h2>
              <p>This content is styled using your CSS code.</p>
              <button class="btn">Button Example</button>
            </div>
          </div>
        </body>
        </html>
      `);
    } else {
      // For other languages, show a "Preview not available" message
      setPreviewContent(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Preview</title>
          <style>
            body { 
              font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              height: 100vh; 
              margin: 0;
              background-color: #f5f5f5;
              color: #333;
            }
            .message {
              text-align: center;
              padding: 2rem;
              border-radius: 8px;
              background-color: white;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              max-width: 80%;
            }
            h2 { margin-top: 0; color: #555; }
            code { 
              background-color: #f0f0f0; 
              padding: 0.2em 0.4em;
              border-radius: 3px;
              font-family: monospace;
              font-size: 0.9em;
            }
          </style>
        </head>
        <body>
          <div class="message">
            <h2>Preview not available for ${language}</h2>
            <p>The live preview feature is currently only available for HTML, CSS, and JavaScript files.</p>
            <p>You are currently editing: <code>${fileName}</code></p>
          </div>
        </body>
        </html>
      `);
    }
  }, [language, code, isAutoRefresh, fileName]);

  // Update the preview manually
  const refreshPreview = () => {
    // Force rerender the iframe by setting content to empty and then back
    setPreviewContent("");
    setTimeout(() => {
      if (language === 'html') {
        setPreviewContent(code);
      } else if (language === 'javascript') {
        setPreviewContent(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>JavaScript Preview</title>
            <style>
              body { font-family: sans-serif; padding: 20px; }
              pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
              .log { margin: 5px 0; padding: 5px; border-bottom: 1px solid #eee; }
              .error { color: red; }
            </style>
          </head>
          <body>
            <h2>JavaScript Output:</h2>
            <div id="output"></div>
            <script>
              // Capture console.log output
              const output = document.getElementById('output');
              const originalConsoleLog = console.log;
              const originalConsoleError = console.error;
              
              console.log = function(...args) {
                originalConsoleLog.apply(console, args);
                const logItem = document.createElement('div');
                logItem.className = 'log';
                logItem.textContent = args.map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg) : arg
                ).join(' ');
                output.appendChild(logItem);
              };
              
              console.error = function(...args) {
                originalConsoleError.apply(console, args);
                const logItem = document.createElement('div');
                logItem.className = 'log error';
                logItem.textContent = args.map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg) : arg
                ).join(' ');
                output.appendChild(logItem);
              };
              
              try {
                ${code}
              } catch (e) {
                console.error('Error:', e.message);
              }
            </script>
          </body>
          </html>
        `);
      }
    }, 100);

    toast({
      title: "Preview refreshed",
      description: "The preview has been manually refreshed.",
    });
  };

  // Update file extension when language changes
  useEffect(() => {
    // Map language to file extension
    const extensionsMap: Record<string, string> = {
      javascript: "js",
      typescript: "ts",
      html: "html",
      css: "css",
      json: "json",
      markdown: "md",
      python: "py",
      java: "java",
      php: "php",
      csharp: "cs",
      cpp: "cpp",
      go: "go",
      ruby: "rb",
      rust: "rs",
      sql: "sql",
      xml: "xml",
      yaml: "yaml",
      shell: "sh",
    };

    // Update file name with new extension
    const nameWithoutExtension = fileName.split(".")[0];
    const newExtension = extensionsMap[language] || "txt";
    setFileName(`${nameWithoutExtension}.${newExtension}`);

    // Set template code for the selected language if available
    if (codeTemplates[language]) {
      setCode(codeTemplates[language]);
    }
  }, [language]);

  // Copy code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "The code has been copied to your clipboard.",
    });

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  // Download code as file
  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    saveAs(blob, fileName);
    
    toast({
      title: "File downloaded",
      description: `${fileName} has been downloaded.`,
    });
  };

  // Auto-refresh toggle handler
  const handleAutoRefreshToggle = (checked: boolean) => {
    setIsAutoRefresh(checked);
    toast({
      title: checked ? "Auto-refresh enabled" : "Auto-refresh disabled",
      description: checked 
        ? "Preview will update automatically as you type." 
        : "Use the refresh button to update the preview.",
    });
  };

  // Save code handler
  const handleSave = () => {
    const savedSnippets = JSON.parse(localStorage.getItem('savedCodeSnippets') || '[]');
    savedSnippets.push({
      id: Date.now(),
      language,
      code,
      fileName,
      dateCreated: new Date().toISOString()
    });
    localStorage.setItem('savedCodeSnippets', JSON.stringify(savedSnippets));
    
    toast({
      title: "Code saved",
      description: `Your ${language} snippet has been saved locally.`,
    });
  };

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <Breadcrumb 
          items={[
            { label: "Home", path: "/" },
            { label: "Tools", path: "/tools" },
            { label: "Live Editor", path: "/tools/live-editor", isActive: true }
          ]} 
        />
        
        <div className="flex flex-col space-y-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Live Editor <Badge variant="outline" className="ml-2">Beta</Badge>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            A powerful online editor with real-time preview for code and rich text
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <Alert className="mb-4">
                <BellRing className="h-4 w-4" />
                <AlertDescription>
                  Any code you write here is processed in your browser. Your data isn't stored on our servers.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-wrap gap-4 justify-between mb-4">
                <div className="flex flex-wrap gap-2">
                  <div className="w-40">
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-32">
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {themes.map((themeOption) => (
                          <SelectItem key={themeOption.value} value={themeOption.value}>
                            {themeOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Tabs value={editorMode} onValueChange={(value) => setEditorMode(value as "code" | "rich")}>
                      <TabsList>
                        <TabsTrigger value="code" className="flex items-center gap-1">
                          <Code className="h-4 w-4" />
                          <span className="hidden sm:inline">Code</span>
                        </TabsTrigger>
                        <TabsTrigger value="rich" className="flex items-center gap-1">
                          <AlignLeft className="h-4 w-4" />
                          <span className="hidden sm:inline">Rich Text</span>
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-refresh"
                      checked={isAutoRefresh}
                      onCheckedChange={handleAutoRefreshToggle}
                    />
                    <Label htmlFor="auto-refresh">Auto-refresh</Label>
                  </div>
                  
                  <Input
                    className="w-40"
                    placeholder="Filename"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Resizable panels for editor and preview */}
                {isMobile ? (
                  /* Mobile Layout - Stacked Vertically */
                  <div className="flex flex-col">
                    {/* Editor Section */}
                    <div className="border-b border-gray-200 dark:border-gray-700">
                      <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded-t flex gap-2 flex-wrap">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={copyToClipboard}
                          className="flex items-center gap-1"
                        >
                          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          <span className="text-xs">{isCopied ? "Copied" : "Copy"}</span>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={downloadCode}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          <span className="text-xs">Save</span>
                        </Button>
                        
                        {!isAutoRefresh && editorMode === "code" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={refreshPreview}
                            className="flex items-center gap-1"
                          >
                            <RefreshCw className="h-4 w-4" />
                            <span className="text-xs">Refresh</span>
                          </Button>
                        )}
                      </div>
                      
                      {/* Editor Area */}
                      <div className="h-[300px] relative">
                        {editorMode === "code" ? (
                          <Editor
                            height="100%"
                            language={language}
                            theme={theme}
                            value={code}
                            onChange={(value) => setCode(value || "")}
                            options={{
                              minimap: { enabled: false },
                              fontSize: 14,
                              wordWrap: 'on',
                              scrollBeyondLastLine: false,
                              automaticLayout: true,
                              copyWithSyntaxHighlighting: true,
                              contextmenu: true,
                              quickSuggestions: true,
                              tabCompletion: "on",
                              acceptSuggestionOnEnter: "on",
                              snippetSuggestions: "inline",
                              bracketPairColorization: {
                                enabled: true
                              },
                              cursorBlinking: "smooth"
                            }}
                          />
                        ) : (
                          <RichTextEditor
                            content={richContent}
                            setContent={setRichContent}
                          />
                        )}
                      </div>
                    </div>
                    
                    {/* Preview Section */}
                    <div>
                      <div className="bg-gray-100 dark:bg-gray-900 p-2 flex justify-between items-center">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          <span>Preview</span>
                        </div>
                        {editorMode === "rich" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              navigator.clipboard.writeText(richContent);
                              toast({
                                title: "HTML copied",
                                description: "HTML content copied to clipboard.",
                              });
                            }}
                            className="flex items-center gap-1"
                          >
                            <Clipboard className="h-4 w-4" />
                            <span className="text-xs">Copy HTML</span>
                          </Button>
                        )}
                      </div>
                      
                      {/* Preview Area */}
                      <div className="h-[300px] bg-white border border-gray-200 dark:border-gray-700">
                        {editorMode === "code" ? (
                          <iframe
                            ref={iframeRef}
                            srcDoc={previewContent}
                            title="code preview"
                            className="w-full h-full"
                            sandbox="allow-scripts allow-modals"
                          />
                        ) : (
                          <div 
                            className="w-full h-full overflow-auto p-4"
                            dangerouslySetInnerHTML={{ __html: richContent }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Desktop Layout - Side by Side */
                  <PanelGroup direction="horizontal">
                    <Panel defaultSize={50} minSize={30}>
                      <div className="p-1 h-full">
                        <div className="bg-gray-100 dark:bg-gray-900 p-2 mb-1 rounded flex gap-2 flex-wrap">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={copyToClipboard}
                                  className="flex items-center gap-1"
                                >
                                  {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                  <span className="hidden sm:inline">{isCopied ? "Copied!" : "Copy"}</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy code to clipboard</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={downloadCode}
                                  className="flex items-center gap-1"
                                >
                                  <Download className="h-4 w-4" />
                                  <span className="hidden sm:inline">Download</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Download code as file</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={handleSave}
                                  className="flex items-center gap-1"
                                >
                                  <Save className="h-4 w-4" />
                                  <span className="hidden sm:inline">Save</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Save code in browser storage</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          {!isAutoRefresh && editorMode === "code" && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={refreshPreview}
                                    className="flex items-center gap-1"
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                    <span className="hidden sm:inline">Refresh Preview</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Update the preview with your code changes</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        
                        {/* Editor Area */}
                        <div className="h-[500px] relative">
                          {editorMode === "code" ? (
                            <Editor
                              height="100%"
                              language={language}
                              theme={theme}
                              value={code}
                              onChange={(value) => setCode(value || "")}
                              options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                wordWrap: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                copyWithSyntaxHighlighting: true,
                                contextmenu: true,
                                quickSuggestions: true,
                                tabCompletion: "on",
                                acceptSuggestionOnEnter: "on",
                                snippetSuggestions: "inline",
                                bracketPairColorization: {
                                  enabled: true
                                },
                                cursorBlinking: "smooth",
                              }}
                            />
                          ) : (
                            <RichTextEditor
                              content={richContent}
                              setContent={setRichContent}
                            />
                          )}
                        </div>
                      </div>
                    </Panel>
                    
                    <PanelResizeHandle className="w-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" />
                    
                    <Panel defaultSize={50} minSize={30}>
                      <div className="p-1 h-full">
                        <div className="bg-gray-100 dark:bg-gray-900 p-2 mb-1 rounded flex justify-between items-center">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            <span>Preview</span>
                          </div>
                          {editorMode === "rich" && (
                            <div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  navigator.clipboard.writeText(richContent);
                                  toast({
                                    title: "HTML copied",
                                    description: "The HTML content has been copied to your clipboard.",
                                  });
                                }}
                                className="flex items-center gap-1"
                              >
                                <Clipboard className="h-4 w-4" />
                                <span className="hidden sm:inline">Copy HTML</span>
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        {/* Preview Area */}
                        <div className="h-[500px] bg-white border border-gray-200 dark:border-gray-700 rounded">
                          {editorMode === "code" ? (
                            <iframe
                              ref={iframeRef}
                              srcDoc={previewContent}
                              title="code preview"
                              className="w-full h-full rounded"
                              sandbox="allow-scripts allow-modals"
                            />
                          ) : (
                            <div 
                              className="w-full h-full overflow-auto p-4"
                              dangerouslySetInnerHTML={{ __html: richContent }}
                            />
                          )}
                        </div>
                      </div>
                    </Panel>
                  </PanelGroup>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start mb-2">
                  <Code className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-xl font-semibold">Code Editor</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Professional code editor with syntax highlighting, auto-completion, and more.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start mb-2">
                  <Eye className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-xl font-semibold">Live Preview</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  See your HTML, CSS, and JavaScript come to life instantly as you code.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start mb-2">
                  <AlignLeft className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-xl font-semibold">Rich Text Editor</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Create formatted content with a WYSIWYG interface for non-technical users.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start mb-2">
                  <FileDown className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-xl font-semibold">Export Options</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Copy or download your code with one click for use in your projects.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start mb-2">
                  <Settings className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-xl font-semibold">Customizable</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose from various themes and adjust settings to match your workflow.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start mb-2">
                  <FileCode className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-xl font-semibold">Multiple Languages</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Support for HTML, CSS, JavaScript, TypeScript, Python, and many more.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Tips for Using the Live Editor</h2>
          <div className="space-y-3">
            <p className="flex items-start">
              <span className="inline-block bg-primary text-white rounded-full w-6 h-6 text-center mr-2 flex-shrink-0">1</span>
              <span>For HTML editing, your changes will be visible instantly in the preview panel.</span>
            </p>
            <p className="flex items-start">
              <span className="inline-block bg-primary text-white rounded-full w-6 h-6 text-center mr-2 flex-shrink-0">2</span>
              <span>JavaScript code will execute in a sandboxed environment with console output visible in the preview.</span>
            </p>
            <p className="flex items-start">
              <span className="inline-block bg-primary text-white rounded-full w-6 h-6 text-center mr-2 flex-shrink-0">3</span>
              <span>Use the Rich Text editor for creating formatted content without needing to write HTML.</span>
            </p>
            <p className="flex items-start">
              <span className="inline-block bg-primary text-white rounded-full w-6 h-6 text-center mr-2 flex-shrink-0">4</span>
              <span>Your code is saved locally in your browser when you use the Save button.</span>
            </p>
            <p className="flex items-start">
              <span className="inline-block bg-primary text-white rounded-full w-6 h-6 text-center mr-2 flex-shrink-0">5</span>
              <span>Toggle Auto-refresh off if you're making large changes and want to control when the preview updates.</span>
            </p>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}