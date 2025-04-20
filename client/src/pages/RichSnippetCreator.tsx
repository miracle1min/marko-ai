import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Code,
  Copy,
  Info,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import Breadcrumb from "@/components/Breadcrumb";

// Types for schema properties
interface SchemaProperty {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  description?: string;
  options?: { value: string; label: string }[];
  properties?: SchemaProperty[];
  isArray?: boolean;
}

// Types for schema templates
interface SchemaTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  icon: JSX.Element;
  properties: SchemaProperty[];
}

export default function RichSnippetCreator() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("article");
  const [schemaData, setSchemaData] = useState<Record<string, any>>({});
  const [generatedSchema, setGeneratedSchema] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState("");

  // Helper function to initialize schema data based on template
  const initializeSchemaData = (template: SchemaTemplate) => {
    const data: Record<string, any> = {
      "@context": "https://schema.org",
      "@type": template.type
    };
    
    // Initialize all properties with empty values
    template.properties.forEach(prop => {
      if (prop.required && !prop.properties) {
        data[prop.name] = prop.type === "Boolean" ? false : "";
      }
    });
    
    setSchemaData(data);
  };

  // Effect to initialize schema data when tab changes
  useEffect(() => {
    const template = schemaTemplates.find(t => t.id === selectedTab);
    if (template) {
      initializeSchemaData(template);
    }
  }, [selectedTab]);

  // Handle form field changes
  const handleInputChange = (property: string, value: any) => {
    setSchemaData(prevData => ({
      ...prevData,
      [property]: value
    }));
  };

  // Handle nested property changes
  const handleNestedPropertyChange = (parent: string, property: string, value: any) => {
    setSchemaData(prevData => {
      const parentData = prevData[parent] || {};
      return {
        ...prevData,
        [parent]: {
          ...parentData,
          [property]: value
        }
      };
    });
  };

  // Generate JSON-LD schema
  const generateSchema = () => {
    try {
      // Filter out empty values
      const filteredData = Object.entries(schemaData).reduce((acc, [key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
      
      const jsonString = JSON.stringify(filteredData, null, 2);
      setGeneratedSchema(jsonString);
      setIsValid(true);
      setValidationMessage("");
      
      toast({
        title: "Schema successfully generated",
        description: "Your JSON-LD schema markup has been created",
      });
    } catch (error) {
      console.error("Error generating schema:", error);
      setIsValid(false);
      setValidationMessage("Error generating schema: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  // Validate schema
  const validateSchema = () => {
    try {
      // Basic validation - make sure it's valid JSON
      JSON.parse(generatedSchema);
      
      // Check for required fields
      const template = schemaTemplates.find(t => t.id === selectedTab);
      if (template) {
        const requiredProps = template.properties.filter(p => p.required);
        const missingProps = requiredProps.filter(p => !schemaData[p.name] || schemaData[p.name] === "");
        
        if (missingProps.length > 0) {
          setIsValid(false);
          setValidationMessage(`Missing required fields: ${missingProps.map(p => p.label).join(", ")}`);
          return;
        }
      }
      
      setIsValid(true);
      setValidationMessage("Schema is valid!");
      
      toast({
        title: "Schema validation successful",
        description: "Your JSON-LD schema is correctly formatted",
      });
    } catch (error) {
      setIsValid(false);
      setValidationMessage("Invalid JSON: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  // Copy schema to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSchema);
    toast({
      title: "Copied to clipboard",
      description: "The schema has been copied to your clipboard",
    });
  };

  // Get the current template
  const currentTemplate = schemaTemplates.find(t => t.id === selectedTab);

  return (
    <div className="container max-w-6xl py-4 mt-0">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: "Beranda", path: "/" },
        { label: "Tools", path: "/tools" },
        { label: "Rich Snippet Creator", path: "/rich-snippet-creator", isActive: true },
      ]} />

      <div className="space-y-2 mb-8 mt-0 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Rich Snippet Creator</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Buat schema markup untuk meningkatkan tampilan rich snippet di hasil pencarian Google
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left sidebar - Schema Types */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Schema Type</CardTitle>
              <CardDescription>
                Pilih jenis schema markup yang ingin Anda buat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="article"
                orientation="vertical"
                value={selectedTab}
                onValueChange={setSelectedTab}
                className="w-full"
              >
                <TabsList className="flex flex-col h-auto items-stretch">
                  {schemaTemplates.map((template) => (
                    <TabsTrigger
                      key={template.id}
                      value={template.id}
                      className="flex items-center justify-start px-3 py-2 h-auto text-left"
                    >
                      <div className="flex items-center">
                        <div className="mr-2">{template.icon}</div>
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {template.description.length > 40
                              ? template.description.substring(0, 40) + "..."
                              : template.description}
                          </p>
                        </div>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Main content - Schema Builder and Preview */}
        <div className="lg:col-span-2 space-y-6">
          {currentTemplate && (
            <>
              {/* Schema Builder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {currentTemplate.icon}
                    <span className="ml-2">{currentTemplate.name} Schema</span>
                  </CardTitle>
                  <CardDescription>{currentTemplate.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-lg font-semibold">
                        Basic Information
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        {currentTemplate.properties
                          .filter(prop => !prop.properties && !prop.name.includes("."))
                          .map((property) => (
                            <div key={property.name} className="space-y-2">
                              <div className="flex items-center">
                                <Label htmlFor={property.name} className="text-sm font-medium">
                                  {property.label}
                                  {property.required && (
                                    <span className="text-red-500 ml-1">*</span>
                                  )}
                                </Label>
                                {property.description && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="max-w-xs">{property.description}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                              
                              {property.type === "Text" && (
                                <Input
                                  id={property.name}
                                  placeholder={`Enter ${property.label}`}
                                  value={schemaData[property.name] || ""}
                                  onChange={(e) => handleInputChange(property.name, e.target.value)}
                                />
                              )}
                              
                              {property.type === "LongText" && (
                                <Textarea
                                  id={property.name}
                                  placeholder={`Enter ${property.label}`}
                                  value={schemaData[property.name] || ""}
                                  onChange={(e) => handleInputChange(property.name, e.target.value)}
                                  rows={3}
                                />
                              )}
                              
                              {property.type === "Number" && (
                                <Input
                                  id={property.name}
                                  type="number"
                                  placeholder={`Enter ${property.label}`}
                                  value={schemaData[property.name] || ""}
                                  onChange={(e) => handleInputChange(property.name, e.target.value ? Number(e.target.value) : "")}
                                />
                              )}
                              
                              {property.type === "URL" && (
                                <Input
                                  id={property.name}
                                  type="url"
                                  placeholder={`Enter ${property.label} URL`}
                                  value={schemaData[property.name] || ""}
                                  onChange={(e) => handleInputChange(property.name, e.target.value)}
                                />
                              )}
                              
                              {property.type === "Date" && (
                                <Input
                                  id={property.name}
                                  type="date"
                                  value={schemaData[property.name] || ""}
                                  onChange={(e) => handleInputChange(property.name, e.target.value)}
                                />
                              )}
                              
                              {property.type === "DateTime" && (
                                <Input
                                  id={property.name}
                                  type="datetime-local"
                                  value={schemaData[property.name] || ""}
                                  onChange={(e) => handleInputChange(property.name, e.target.value)}
                                />
                              )}
                              
                              {property.type === "Boolean" && (
                                <Select
                                  value={schemaData[property.name] ? "true" : "false"}
                                  onValueChange={(value) => handleInputChange(property.name, value === "true")}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select value" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="true">Yes</SelectItem>
                                    <SelectItem value="false">No</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                              
                              {property.type === "Enum" && property.options && (
                                <Select
                                  value={schemaData[property.name] || ""}
                                  onValueChange={(value) => handleInputChange(property.name, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder={`Select ${property.label}`} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {property.options.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                          ))}
                      </AccordionContent>
                    </AccordionItem>
                      
                    {/* Advanced Sections - for nested properties */}
                    {currentTemplate.properties
                      .filter(prop => prop.properties && prop.properties.length > 0)
                      .map((section, index) => (
                        <AccordionItem key={section.name} value={`item-${index + 2}`}>
                          <AccordionTrigger className="text-lg font-semibold">
                            {section.label}
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4 pt-4">
                            {section.properties?.map((property) => (
                              <div key={property.name} className="space-y-2">
                                <div className="flex items-center">
                                  <Label htmlFor={property.name} className="text-sm font-medium">
                                    {property.label}
                                    {property.required && (
                                      <span className="text-red-500 ml-1">*</span>
                                    )}
                                  </Label>
                                  {property.description && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Info className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="max-w-xs">{property.description}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                                
                                {property.type === "Text" && (
                                  <Input
                                    id={property.name}
                                    placeholder={`Enter ${property.label}`}
                                    value={schemaData[section.name]?.[property.name] || ""}
                                    onChange={(e) => handleNestedPropertyChange(section.name, property.name, e.target.value)}
                                  />
                                )}
                                
                                {property.type === "LongText" && (
                                  <Textarea
                                    id={property.name}
                                    placeholder={`Enter ${property.label}`}
                                    value={schemaData[section.name]?.[property.name] || ""}
                                    onChange={(e) => handleNestedPropertyChange(section.name, property.name, e.target.value)}
                                    rows={3}
                                  />
                                )}
                                
                                {property.type === "URL" && (
                                  <Input
                                    id={property.name}
                                    type="url"
                                    placeholder={`Enter ${property.label} URL`}
                                    value={schemaData[section.name]?.[property.name] || ""}
                                    onChange={(e) => handleNestedPropertyChange(section.name, property.name, e.target.value)}
                                  />
                                )}
                              </div>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </CardContent>
                <CardFooter>
                  <Button onClick={generateSchema} className="w-full">
                    Generate Schema Markup
                  </Button>
                </CardFooter>
              </Card>

              {/* Schema Preview and Validation */}
              {generatedSchema && (
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Schema</CardTitle>
                    <CardDescription>
                      Preview, validate, and copy your JSON-LD schema markup
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <h3 className="text-md font-medium">JSON-LD Schema</h3>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="ml-auto"
                          onClick={copyToClipboard}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      <div className="relative">
                        <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
                          <code>{generatedSchema}</code>
                        </pre>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Button 
                          onClick={validateSchema} 
                          variant="outline"
                          className="w-full"
                        >
                          Validate Schema
                        </Button>
                      </div>
                      
                      {validationMessage && (
                        <div className={`p-3 rounded-md ${isValid ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                          <div className="flex items-start">
                            {isValid ? (
                              <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
                            ) : (
                              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                            )}
                            <p className="text-sm">{validationMessage}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col items-start">
                    <h3 className="text-md font-medium mb-2">Implementation Instructions</h3>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-3 w-full">
                      <p>
                        To implement this schema on your website, add the following script tag to
                        the <code>&lt;head&gt;</code> section of your HTML:
                      </p>
                      <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                        <code>{`<script type="application/ld+json">\n${generatedSchema}\n</script>`}</code>
                      </pre>
                    </div>
                  </CardFooter>
                </Card>
              )}

              {/* Rich Snippet Preview */}
              {generatedSchema && (
                <Card>
                  <CardHeader>
                    <CardTitle>Rich Snippet Preview</CardTitle>
                    <CardDescription>
                      Simulasi tampilan rich snippet di hasil pencarian Google (perkiraan)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-md p-5 space-y-2">
                      {currentTemplate.id === "article" && (
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {schemaData.publisher?.name || "yourwebsite.com"}
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {schemaData.articleSection || "Articles"}
                            </div>
                          </div>
                          <div className="text-blue-600 dark:text-blue-400 text-xl font-medium">
                            {schemaData.headline || "Your Article Title"}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            {schemaData.datePublished && (
                              <span>
                                {new Date(schemaData.datePublished).toLocaleDateString()}
                              </span>
                            )}
                            {schemaData.author?.name && (
                              <span className="ml-2">
                                • By {schemaData.author.name}
                              </span>
                            )}
                          </div>
                          <div className="text-gray-600 dark:text-gray-300">
                            {schemaData.description || "A brief description of your article content..."}
                          </div>
                        </div>
                      )}

                      {currentTemplate.id === "product" && (
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {schemaData.brand?.name ? `${schemaData.brand.name} › ` : ''}
                            {schemaData.category || "Products"}
                          </div>
                          <div className="text-blue-600 dark:text-blue-400 text-xl font-medium">
                            {schemaData.name || "Your Product Name"}
                          </div>
                          <div className="flex items-center">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= (schemaData.aggregateRating?.ratingValue || 0)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            {schemaData.aggregateRating?.ratingValue && (
                              <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">
                                {schemaData.aggregateRating.ratingValue} ({schemaData.aggregateRating.reviewCount || "0"} reviews)
                              </span>
                            )}
                          </div>
                          <div className="text-sm">
                            <span className="font-bold text-lg">
                              {schemaData.offers?.price
                                ? `${schemaData.offers.priceCurrency || '$'}${schemaData.offers.price}`
                                : ''}
                            </span>
                            {schemaData.offers?.availability === "https://schema.org/InStock" && (
                              <span className="ml-2 text-green-600 dark:text-green-400">
                                In stock
                              </span>
                            )}
                          </div>
                          <div className="text-gray-600 dark:text-gray-300">
                            {schemaData.description || "A brief description of your product..."}
                          </div>
                        </div>
                      )}

                      {currentTemplate.id === "faq" && (
                        <div className="space-y-3">
                          <div className="text-blue-600 dark:text-blue-400 text-xl font-medium">
                            {schemaData.name || "Your FAQ Page Title"}
                          </div>
                          <div className="text-gray-600 dark:text-gray-300 mb-2">
                            {schemaData.description || "Frequently asked questions..."}
                          </div>
                          <div className="space-y-3">
                            {schemaData.mainEntity && 
                              Array.isArray(schemaData.mainEntity) && 
                              schemaData.mainEntity.slice(0, 3).map((item: any, idx: number) => (
                                <div key={idx} className="border-b pb-2">
                                  <div className="font-medium mb-1">{item.name || "Question"}</div>
                                  <div className="text-sm text-gray-600 dark:text-gray-300">
                                    {item.acceptedAnswer?.text || "Answer..."}
                                  </div>
                                </div>
                              ))}
                            {(!schemaData.mainEntity || !Array.isArray(schemaData.mainEntity)) && (
                              <div className="border-b pb-2">
                                <div className="font-medium mb-1">Sample Question</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                  Sample answer to the question...
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {currentTemplate.id === "local" && (
                        <div className="space-y-1">
                          <div className="text-blue-600 dark:text-blue-400 text-xl font-medium">
                            {schemaData.name || "Your Business Name"}
                          </div>
                          <div className="flex items-center">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= (schemaData.aggregateRating?.ratingValue || 0)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            {schemaData.aggregateRating?.ratingValue && (
                              <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">
                                {schemaData.aggregateRating.ratingValue} ({schemaData.aggregateRating.ratingCount || "0"} reviews)
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {schemaData.address?.streetAddress && (
                              <>{schemaData.address.streetAddress}, </>
                            )}
                            {schemaData.address?.addressLocality && (
                              <>{schemaData.address.addressLocality}, </>
                            )}
                            {schemaData.address?.addressRegion || ''}
                          </div>
                          {schemaData.openingHours && (
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              ⋅ {Array.isArray(schemaData.openingHours) ? schemaData.openingHours[0] : schemaData.openingHours}
                            </div>
                          )}
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {schemaData.telephone || ""}
                          </div>
                        </div>
                      )}

                      {currentTemplate.id === "event" && (
                        <div className="space-y-1">
                          <div className="text-blue-600 dark:text-blue-400 text-xl font-medium">
                            {schemaData.name || "Your Event Name"}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">
                              {schemaData.startDate && (
                                <>{new Date(schemaData.startDate).toLocaleDateString()} </>
                              )}
                              {schemaData.startDate && schemaData.startDate.includes("T") && (
                                <>{new Date(schemaData.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</>
                              )}
                              {schemaData.endDate && (
                                <> - {new Date(schemaData.endDate).toLocaleDateString()}</>
                              )}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {schemaData.location?.name ? `${schemaData.location.name}` : ''}
                            {schemaData.location?.address?.streetAddress && (
                              <>, {schemaData.location.address.streetAddress}</>
                            )}
                            {schemaData.location?.address?.addressLocality && (
                              <>, {schemaData.location.address.addressLocality}</>
                            )}
                          </div>
                          <div className="text-gray-600 dark:text-gray-300">
                            {schemaData.description || "A brief description of your event..."}
                          </div>
                        </div>
                      )}

                      {currentTemplate.id === "recipe" && (
                        <div className="space-y-1">
                          <div className="text-blue-600 dark:text-blue-400 text-xl font-medium">
                            {schemaData.name || "Your Recipe Name"}
                          </div>
                          <div className="flex items-center">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= (schemaData.aggregateRating?.ratingValue || 0)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            {schemaData.aggregateRating?.ratingValue && (
                              <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">
                                {schemaData.aggregateRating.ratingValue} ({schemaData.aggregateRating.reviewCount || "0"} reviews)
                              </span>
                            )}
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600 dark:text-gray-300">
                              By {schemaData.author?.name || "Author"}
                            </span>
                            {schemaData.prepTime && (
                              <span className="ml-3 text-gray-600 dark:text-gray-300">
                                Prep: {schemaData.prepTime.replace("PT", "").replace("M", " min").replace("H", " hr")}
                              </span>
                            )}
                            {schemaData.cookTime && (
                              <span className="ml-3 text-gray-600 dark:text-gray-300">
                                Cook: {schemaData.cookTime.replace("PT", "").replace("M", " min").replace("H", " hr")}
                              </span>
                            )}
                            {schemaData.totalTime && (
                              <span className="ml-3 text-gray-600 dark:text-gray-300">
                                Total: {schemaData.totalTime.replace("PT", "").replace("M", " min").replace("H", " hr")}
                              </span>
                            )}
                          </div>
                          <div className="text-gray-600 dark:text-gray-300">
                            {schemaData.description || "A brief description of your recipe..."}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Schema Templates
const schemaTemplates: SchemaTemplate[] = [
  {
    id: "article",
    name: "Article",
    description: "For blog posts, news articles, and other content pages",
    type: "Article",
    icon: <Code className="h-5 w-5 text-blue-500" />,
    properties: [
      {
        name: "@type",
        label: "Type Spesifik",
        type: "Enum",
        options: [
          { value: "Article", label: "Article (General)" },
          { value: "BlogPosting", label: "Blog Post" },
          { value: "NewsArticle", label: "News Article" },
          { value: "TechArticle", label: "Technical Article" }
        ],
        description: "Tipe spesifik dari artikel"
      },
      {
        name: "headline",
        label: "Judul Artikel",
        type: "Text",
        required: true,
        description: "Judul utama artikel (maksimal 110 karakter)"
      },
      {
        name: "description",
        label: "Deskripsi",
        type: "LongText",
        description: "Ringkasan singkat tentang isi artikel"
      },
      {
        name: "articleBody",
        label: "Isi Artikel",
        type: "LongText",
        description: "Isi lengkap artikel (Opsional)"
      },
      {
        name: "image",
        label: "URL Gambar",
        type: "URL",
        description: "URL gambar utama artikel"
      },
      {
        name: "datePublished",
        label: "Tanggal Publikasi",
        type: "Date",
        required: true,
        description: "Tanggal artikel dipublikasikan"
      },
      {
        name: "dateModified",
        label: "Tanggal Modifikasi",
        type: "Date",
        description: "Tanggal artikel terakhir diperbarui"
      },
      {
        name: "articleSection",
        label: "Kategori/Bagian",
        type: "Text",
        description: "Kategori atau bagian dari artikel"
      },
      {
        name: "author",
        label: "Penulis",
        type: "Object",
        properties: [
          {
            name: "name",
            label: "Nama Penulis",
            type: "Text",
            required: true
          },
          {
            name: "url",
            label: "URL Profil",
            type: "URL"
          }
        ]
      },
      {
        name: "publisher",
        label: "Penerbit",
        type: "Object",
        properties: [
          {
            name: "name",
            label: "Nama Penerbit",
            type: "Text",
            required: true
          },
          {
            name: "logo",
            label: "URL Logo",
            type: "URL"
          }
        ]
      },
      {
        name: "mainEntityOfPage",
        label: "URL Halaman",
        type: "URL",
        description: "URL halaman artikel"
      }
    ]
  },
  {
    id: "product",
    name: "Product",
    description: "For product pages, e-commerce listings, and product reviews",
    type: "Product",
    icon: <Search className="h-5 w-5 text-green-500" />,
    properties: [
      {
        name: "name",
        label: "Nama Produk",
        type: "Text",
        required: true,
        description: "Nama lengkap produk"
      },
      {
        name: "description",
        label: "Deskripsi",
        type: "LongText",
        description: "Deskripsi produk"
      },
      {
        name: "image",
        label: "URL Gambar",
        type: "URL",
        description: "URL gambar produk"
      },
      {
        name: "category",
        label: "Kategori",
        type: "Text",
        description: "Kategori produk"
      },
      {
        name: "brand",
        label: "Brand",
        type: "Object",
        properties: [
          {
            name: "name",
            label: "Nama Brand",
            type: "Text"
          }
        ]
      },
      {
        name: "sku",
        label: "SKU",
        type: "Text",
        description: "Nomor stok/SKU produk"
      },
      {
        name: "mpn",
        label: "MPN",
        type: "Text",
        description: "Manufacturer Part Number"
      },
      {
        name: "gtin13",
        label: "GTIN/EAN",
        type: "Text",
        description: "Global Trade Item Number / EAN"
      },
      {
        name: "aggregateRating",
        label: "Rating",
        type: "Object",
        properties: [
          {
            name: "ratingValue",
            label: "Nilai Rating",
            type: "Number"
          },
          {
            name: "reviewCount",
            label: "Jumlah Review",
            type: "Number"
          }
        ]
      },
      {
        name: "offers",
        label: "Penawaran",
        type: "Object",
        properties: [
          {
            name: "price",
            label: "Harga",
            type: "Number",
          },
          {
            name: "priceCurrency",
            label: "Mata Uang",
            type: "Text",
          },
          {
            name: "availability",
            label: "Ketersediaan",
            type: "Enum",
            options: [
              { value: "https://schema.org/InStock", label: "In Stock" },
              { value: "https://schema.org/OutOfStock", label: "Out of Stock" },
              { value: "https://schema.org/PreOrder", label: "Pre-Order" }
            ]
          },
          {
            name: "url",
            label: "URL Pembelian",
            type: "URL"
          }
        ]
      }
    ]
  },
  {
    id: "faq",
    name: "FAQ",
    description: "For FAQ pages with questions and answers",
    type: "FAQPage",
    icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
    properties: [
      {
        name: "name",
        label: "Judul Halaman FAQ",
        type: "Text",
        description: "Judul bagian FAQs"
      },
      {
        name: "description",
        label: "Deskripsi",
        type: "LongText",
        description: "Deskripsi singkat tentang halaman FAQ"
      },
      {
        name: "mainEntity",
        label: "FAQs",
        type: "Array",
        isArray: true,
        properties: [
          {
            name: "name",
            label: "Pertanyaan",
            type: "Text",
            required: true
          },
          {
            name: "acceptedAnswer.text",
            label: "Jawaban",
            type: "LongText",
            required: true
          }
        ]
      }
    ]
  },
  {
    id: "local",
    name: "Local Business",
    description: "For location-based businesses and organizations",
    type: "LocalBusiness",
    icon: <Search className="h-5 w-5 text-purple-500" />,
    properties: [
      {
        name: "@type",
        label: "Tipe Bisnis",
        type: "Enum",
        options: [
          { value: "LocalBusiness", label: "Local Business (General)" },
          { value: "Restaurant", label: "Restaurant" },
          { value: "Hotel", label: "Hotel" },
          { value: "Store", label: "Store" },
          { value: "MedicalOrganization", label: "Medical Organization" },
          { value: "AutomotiveBusiness", label: "Automotive Business" }
        ],
        description: "Tipe spesifik bisnis lokal"
      },
      {
        name: "name",
        label: "Nama Bisnis",
        type: "Text",
        required: true,
        description: "Nama lengkap bisnis"
      },
      {
        name: "description",
        label: "Deskripsi",
        type: "LongText",
        description: "Deskripsi bisnis"
      },
      {
        name: "image",
        label: "URL Gambar",
        type: "URL",
        description: "URL gambar bisnis atau logo"
      },
      {
        name: "address",
        label: "Alamat",
        type: "Object",
        properties: [
          {
            name: "streetAddress",
            label: "Alamat Jalan",
            type: "Text"
          },
          {
            name: "addressLocality",
            label: "Kota",
            type: "Text"
          },
          {
            name: "addressRegion",
            label: "Provinsi/State",
            type: "Text"
          },
          {
            name: "postalCode",
            label: "Kode Pos",
            type: "Text"
          },
          {
            name: "addressCountry",
            label: "Negara",
            type: "Text"
          }
        ]
      },
      {
        name: "geo",
        label: "Geolokasi",
        type: "Object",
        properties: [
          {
            name: "latitude",
            label: "Latitude",
            type: "Text"
          },
          {
            name: "longitude",
            label: "Longitude",
            type: "Text"
          }
        ]
      },
      {
        name: "telephone",
        label: "Nomor Telepon",
        type: "Text",
        description: "Nomor telepon bisnis"
      },
      {
        name: "url",
        label: "Website URL",
        type: "URL",
        description: "URL website bisnis"
      },
      {
        name: "openingHours",
        label: "Jam Operasional",
        type: "Text",
        description: "Format: Day HH:MM-HH:MM (e.g., Monday 09:00-17:00)"
      },
      {
        name: "priceRange",
        label: "Kisaran Harga",
        type: "Text",
        description: "Kisaran harga (e.g., $$, $$$)"
      },
      {
        name: "aggregateRating",
        label: "Rating",
        type: "Object",
        properties: [
          {
            name: "ratingValue",
            label: "Nilai Rating",
            type: "Number"
          },
          {
            name: "ratingCount",
            label: "Jumlah Rating",
            type: "Number"
          }
        ]
      }
    ]
  },
  {
    id: "event",
    name: "Event",
    description: "For events, performances, and gatherings",
    type: "Event",
    icon: <AlertCircle className="h-5 w-5 text-red-500" />,
    properties: [
      {
        name: "name",
        label: "Nama Event",
        type: "Text",
        required: true,
        description: "Nama lengkap event"
      },
      {
        name: "description",
        label: "Deskripsi",
        type: "LongText",
        description: "Deskripsi event"
      },
      {
        name: "image",
        label: "URL Gambar",
        type: "URL",
        description: "URL gambar event"
      },
      {
        name: "startDate",
        label: "Tanggal Mulai",
        type: "DateTime",
        required: true,
        description: "Tanggal dan waktu event dimulai"
      },
      {
        name: "endDate",
        label: "Tanggal Selesai",
        type: "DateTime",
        description: "Tanggal dan waktu event selesai"
      },
      {
        name: "location",
        label: "Lokasi",
        type: "Object",
        properties: [
          {
            name: "name",
            label: "Nama Tempat",
            type: "Text"
          },
          {
            name: "address.streetAddress",
            label: "Alamat Jalan",
            type: "Text"
          },
          {
            name: "address.addressLocality",
            label: "Kota",
            type: "Text"
          },
          {
            name: "address.addressRegion",
            label: "Provinsi/State",
            type: "Text"
          },
          {
            name: "address.postalCode",
            label: "Kode Pos",
            type: "Text"
          },
          {
            name: "address.addressCountry",
            label: "Negara",
            type: "Text"
          }
        ]
      },
      {
        name: "offers",
        label: "Tiket",
        type: "Object",
        properties: [
          {
            name: "price",
            label: "Harga",
            type: "Number"
          },
          {
            name: "priceCurrency",
            label: "Mata Uang",
            type: "Text"
          },
          {
            name: "availability",
            label: "Ketersediaan",
            type: "Enum",
            options: [
              { value: "https://schema.org/InStock", label: "Available" },
              { value: "https://schema.org/SoldOut", label: "Sold Out" },
              { value: "https://schema.org/PreOrder", label: "Pre-Order" }
            ]
          },
          {
            name: "url",
            label: "URL Pembelian",
            type: "URL"
          }
        ]
      },
      {
        name: "performer",
        label: "Performer",
        type: "Object",
        properties: [
          {
            name: "name",
            label: "Nama Performer",
            type: "Text"
          }
        ]
      },
      {
        name: "organizer",
        label: "Organizer",
        type: "Object",
        properties: [
          {
            name: "name",
            label: "Nama Organizer",
            type: "Text"
          },
          {
            name: "url",
            label: "URL Organizer",
            type: "URL"
          }
        ]
      }
    ]
  },
  {
    id: "recipe",
    name: "Recipe",
    description: "For cooking and food recipes",
    type: "Recipe",
    icon: <Search className="h-5 w-5 text-amber-500" />,
    properties: [
      {
        name: "name",
        label: "Nama Resep",
        type: "Text",
        required: true,
        description: "Nama lengkap resep"
      },
      {
        name: "description",
        label: "Deskripsi",
        type: "LongText",
        description: "Deskripsi singkat tentang resep"
      },
      {
        name: "image",
        label: "URL Gambar",
        type: "URL",
        description: "URL gambar resep"
      },
      {
        name: "author",
        label: "Penulis",
        type: "Object",
        properties: [
          {
            name: "name",
            label: "Nama Penulis",
            type: "Text"
          },
          {
            name: "url",
            label: "URL Profil",
            type: "URL"
          }
        ]
      },
      {
        name: "prepTime",
        label: "Waktu Persiapan",
        type: "Text",
        description: "Format ISO 8601 (e.g., PT15M untuk 15 menit)"
      },
      {
        name: "cookTime",
        label: "Waktu Memasak",
        type: "Text",
        description: "Format ISO 8601 (e.g., PT1H untuk 1 jam)"
      },
      {
        name: "totalTime",
        label: "Total Waktu",
        type: "Text",
        description: "Format ISO 8601 (e.g., PT1H15M untuk 1 jam 15 menit)"
      },
      {
        name: "recipeYield",
        label: "Porsi",
        type: "Text",
        description: "Jumlah porsi yang dihasilkan"
      },
      {
        name: "recipeIngredient",
        label: "Bahan-bahan",
        type: "LongText",
        description: "Daftar bahan (satu bahan per baris)"
      },
      {
        name: "recipeInstructions",
        label: "Cara Membuat",
        type: "LongText",
        description: "Langkah-langkah membuat resep (satu langkah per baris)"
      },
      {
        name: "keywords",
        label: "Kata Kunci",
        type: "Text",
        description: "Kata kunci terkait resep, pisahkan dengan koma"
      },
      {
        name: "recipeCategory",
        label: "Kategori",
        type: "Text",
        description: "Kategori resep (e.g., Appetizer, Main Course)"
      },
      {
        name: "recipeCuisine",
        label: "Jenis Masakan",
        type: "Text",
        description: "Jenis masakan (e.g., Italian, Chinese)"
      },
      {
        name: "aggregateRating",
        label: "Rating",
        type: "Object",
        properties: [
          {
            name: "ratingValue",
            label: "Nilai Rating",
            type: "Number"
          },
          {
            name: "reviewCount",
            label: "Jumlah Review",
            type: "Number"
          }
        ]
      }
    ]
  }
];