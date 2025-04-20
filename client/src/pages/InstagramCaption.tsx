import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Copy, Instagram, Camera, Check } from "lucide-react";
import { InstagramCaptionRequest, InstagramCaptionResponse } from "@/lib/types";
import { generateInstagramCaption } from "@/lib/geminiApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Breadcrumb from "@/components/Breadcrumb";

export default function InstagramCaption() {
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [mood, setMood] = useState("casual");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [captionLength, setCaptionLength] = useState<"short" | "medium" | "long">("medium");
  const [brand, setBrand] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const mutation = useMutation({
    mutationFn: async (request: InstagramCaptionRequest) => {
      return await generateInstagramCaption(request);
    },
    onSuccess: (data: InstagramCaptionResponse) => {
      setCaption(data.caption);
      if (data.hashtags) {
        setHashtags(data.hashtags);
      } else {
        setHashtags([]);
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error generating caption",
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic) {
      toast({
        variant: "destructive",
        title: "Topic required",
        description: "Please enter a topic for your Instagram caption",
      });
      return;
    }

    const request: InstagramCaptionRequest = {
      topic,
      mood,
      includeHashtags,
      includeEmojis,
      captionLength,
      brand: brand || undefined,
      targetAudience: targetAudience || undefined,
      additionalInstructions: additionalInstructions || undefined,
    };

    mutation.mutate(request);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied to clipboard",
          description: "Caption copied successfully",
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "Could not copy to clipboard: " + err.message,
        });
      });
  };

  const copyHashtags = () => {
    const hashtagsText = hashtags.map(tag => `#${tag}`).join(" ");
    copyToClipboard(hashtagsText);
  };

  return (
    <div className="container py-4 max-w-5xl mx-auto">
      <Breadcrumb 
        items={[
          { label: "Tools", path: "/tools" },
          { label: "Instagram Caption Generator", path: "/tools/instagram-caption", isActive: true }
        ]}
      />

      <div className="flex items-center space-x-2 mb-6">
        <Instagram className="h-8 w-8 text-pink-500" />
        <h1 className="text-3xl font-bold">Instagram Caption Generator</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Caption Options</CardTitle>
              <CardDescription>
                Configure your Instagram caption settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic/Content Description</Label>
                  <Textarea
                    id="topic"
                    placeholder="Describe your Instagram post content (e.g., sunset beach photo, coffee shop selfie, new product launch)"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mood">Caption Mood/Tone</Label>
                  <Select value={mood} onValueChange={setMood}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a mood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">Casual & Relaxed</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="inspirational">Inspirational</SelectItem>
                      <SelectItem value="funny">Funny & Humorous</SelectItem>
                      <SelectItem value="romantic">Romantic</SelectItem>
                      <SelectItem value="motivational">Motivational</SelectItem>
                      <SelectItem value="thoughtful">Thoughtful & Reflective</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="length">Caption Length</Label>
                  <Select value={captionLength} onValueChange={(value: "short" | "medium" | "long") => setCaptionLength(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                      <SelectItem value="medium">Medium (3-5 sentences)</SelectItem>
                      <SelectItem value="long">Long (5+ sentences)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="hashtags">Include Hashtags</Label>
                  <Switch
                    id="hashtags"
                    checked={includeHashtags}
                    onCheckedChange={setIncludeHashtags}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="emojis">Include Emojis</Label>
                  <Switch
                    id="emojis"
                    checked={includeEmojis}
                    onCheckedChange={setIncludeEmojis}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand Name (Optional)</Label>
                  <Input
                    id="brand"
                    placeholder="Your brand or business name"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience (Optional)</Label>
                  <Input
                    id="audience"
                    placeholder="E.g., teens, moms, fitness enthusiasts"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Additional Instructions (Optional)</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Any specific requirements or themes for your caption"
                    value={additionalInstructions}
                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Generating..." : "Generate Caption"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Instagram Caption</CardTitle>
                  <CardDescription>
                    Perfect for your next post
                  </CardDescription>
                </div>
                <Camera className="h-8 w-8 text-pink-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mutation.isPending ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
                </div>
              ) : caption ? (
                <Tabs defaultValue="caption">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="caption">Caption</TabsTrigger>
                    <TabsTrigger value="hashtags" disabled={!includeHashtags || hashtags.length === 0}>Hashtags</TabsTrigger>
                  </TabsList>
                  <TabsContent value="caption" className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg min-h-[200px]">
                      <p className="whitespace-pre-line">{caption}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center" 
                      onClick={() => copyToClipboard(caption)}
                    >
                      {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                      Copy Caption
                    </Button>
                  </TabsContent>
                  <TabsContent value="hashtags" className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg min-h-[200px]">
                      <div className="flex flex-wrap gap-2">
                        {hashtags.map((tag, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center" 
                      onClick={copyHashtags}
                    >
                      {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                      Copy Hashtags
                    </Button>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Instagram className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Your Instagram caption will appear here</p>
                  <p className="text-sm mt-2">Fill out the form and click "Generate Caption"</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 text-sm">
              <div className="w-full text-muted-foreground">
                <p>✨ <strong>Pro Tips:</strong></p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Add specific details about your image for a more personalized caption</li>
                  <li>Include a call-to-action to boost engagement</li>
                  <li>Use 15-30 hashtags for optimal reach</li>
                  <li>Keep captions aligned with your brand voice</li>
                </ul>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}