import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// --- Word Counter ---
export function WordCounter() {
  const [text, setText] = useState("");
  
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const paragraphs = text.trim() === "" ? 0 : text.split(/\n+/).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox label="Words" value={words} />
        <StatBox label="Characters" value={chars} />
        <StatBox label="No Spaces" value={charsNoSpace} />
        <StatBox label="Paragraphs" value={paragraphs} />
      </div>
      <Textarea 
        placeholder="Type or paste your text here..." 
        className="min-h-[300px] text-lg"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setText("")}>Clear</Button>
        <Button onClick={() => copyToClipboard(text)}>Copy Text</Button>
      </div>
    </div>
  );
}

// --- Character Counter ---
export function CharacterCounter() {
  const [text, setText] = useState("");
  
  // Calculate character frequency
  const frequency = text.split('').reduce((acc: Record<string, number>, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});

  const sortedChars = Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <Textarea 
        placeholder="Type to analyze characters..." 
        className="min-h-[200px]"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Top Characters</h3>
            <div className="space-y-2">
              {sortedChars.map(([char, count]) => (
                <div key={char} className="flex justify-between text-sm border-b pb-1 last:border-0">
                  <span className="font-mono bg-muted px-2 rounded">
                    {char === " " ? "Space" : char}
                  </span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
              {text.length === 0 && <div className="text-muted-foreground text-sm">Start typing to see analysis</div>}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Length</span>
                <span className="font-bold">{text.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Unique Characters</span>
                <span className="font-bold">{Object.keys(frequency).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- Case Converter ---
export function CaseConverter() {
  const [text, setText] = useState("");

  const convert = (type: 'upper' | 'lower' | 'camel' | 'snake' | 'kebab' | 'title') => {
    let result = text;
    switch(type) {
      case 'upper': result = text.toUpperCase(); break;
      case 'lower': result = text.toLowerCase(); break;
      case 'title': 
        result = text.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        break;
      case 'camel':
        result = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        break;
      case 'snake':
        result = text.toLowerCase().replace(/\s+/g, '_');
        break;
      case 'kebab':
        result = text.toLowerCase().replace(/\s+/g, '-');
        break;
    }
    setText(result);
  };

  return (
    <div className="space-y-4">
      <Textarea 
        placeholder="Enter text to convert..." 
        className="min-h-[200px]"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => convert('upper')}>UPPER CASE</Button>
        <Button variant="outline" onClick={() => convert('lower')}>lower case</Button>
        <Button variant="outline" onClick={() => convert('title')}>Title Case</Button>
        <Button variant="outline" onClick={() => convert('camel')}>camelCase</Button>
        <Button variant="outline" onClick={() => convert('snake')}>snake_case</Button>
        <Button variant="outline" onClick={() => convert('kebab')}>kebab-case</Button>
        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(text)} title="Copy">
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// --- Remove Line Breaks ---
export function RemoveLineBreaks() {
  const [text, setText] = useState("");
  const [option, setOption] = useState<'space' | 'none'>('space');

  const process = () => {
    const replacement = option === 'space' ? ' ' : '';
    setText(text.replace(/(\r\n|\n|\r)/gm, replacement));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <Label>Replace with:</Label>
        <div className="flex gap-2">
          <Button 
            variant={option === 'space' ? 'default' : 'outline'} 
            onClick={() => setOption('space')}
            size="sm"
          >
            Space
          </Button>
          <Button 
            variant={option === 'none' ? 'default' : 'outline'} 
            onClick={() => setOption('none')}
            size="sm"
          >
            Nothing
          </Button>
        </div>
      </div>
      <Textarea 
        placeholder="Paste text with line breaks..." 
        className="min-h-[200px]"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex gap-2">
        <Button onClick={process}>Remove Line Breaks</Button>
        <Button variant="outline" onClick={() => copyToClipboard(text)}>Copy Result</Button>
      </div>
    </div>
  );
}

// --- Helpers ---
function StatBox({ label, value }: { label: string, value: number }) {
  return (
    <div className="bg-muted p-4 rounded-lg text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  );
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  toast({ title: "Copied to clipboard" });
}
