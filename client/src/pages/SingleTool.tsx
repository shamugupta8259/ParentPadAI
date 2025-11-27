import { Layout, AdPlaceholder } from "@/components/layout/MainLayout";
import { getItemById } from "@/data/content";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Tool Imports
import { WordCounter, CharacterCounter, CaseConverter, RemoveLineBreaks } from "@/components/tools/TextTools";
import { JsonFormatter, Base64Tool, UrlEncoder, UuidGenerator, JwtDecoder } from "@/components/tools/DevTools";
import { AgeCalculator, PercentageCalculator } from "@/components/tools/CalcTools";
import { ImageResizer, ImageConverter } from "@/components/tools/ImageTools";

// Registry of components
const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  "word-counter": WordCounter,
  "character-counter": CharacterCounter,
  "case-converter": CaseConverter,
  "remove-line-breaks": RemoveLineBreaks,
  "json-formatter": JsonFormatter,
  "base64": Base64Tool,
  "url-encoder": UrlEncoder,
  "uuid-generator": UuidGenerator,
  "jwt-decoder": JwtDecoder,
  "age-calculator": AgeCalculator,
  "percentage-calculator": PercentageCalculator,
  "image-resizer": ImageResizer,
  "png-jpg": ImageConverter,
  // Default fallback for unimplemented tools
  "default": () => <div className="text-center py-20">Tool Coming Soon</div>
};

export default function SingleTool() {
  const { id } = useParams();
  const tool = getItemById(id || "");
  
  if (!tool) {
    return (
      <Layout>
        <div className="container py-20 text-center">Tool not found</div>
      </Layout>
    );
  }

  const ToolComponent = TOOL_COMPONENTS[tool.id] || TOOL_COMPONENTS["default"];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/tools">
          <Button variant="ghost" className="mb-6 pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tools
          </Button>
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <div className="p-2 bg-secondary rounded-lg inline-flex">
              <tool.icon className="h-6 w-6" />
            </div>
            {tool.title}
          </h1>
          <p className="text-lg text-muted-foreground">{tool.description}</p>
        </div>

        {/* Ad Space */}
        <AdPlaceholder className="mb-8 h-[90px]" label="Top Ad" />

        {/* Tool Workspace */}
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <ToolComponent />
        </div>

        {/* Content / SEO Text (Placeholder) */}
        <div className="mt-12 prose dark:prose-invert max-w-none">
          <h2>About {tool.title}</h2>
          <p>
            This free online {tool.title.toLowerCase()} helps you {tool.description.toLowerCase()}. 
            It runs entirely in your browser, ensuring your data stays private and secure. 
            No installation required.
          </p>
          <h3>How to use</h3>
          <ul>
            <li>Enter your input in the designated field.</li>
            <li>Click the action button to process.</li>
            <li>Copy the result to your clipboard.</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
