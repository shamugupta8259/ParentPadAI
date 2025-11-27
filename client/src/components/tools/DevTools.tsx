import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Copy, AlertTriangle, CheckCircle2 } from "lucide-react";

// --- JSON Formatter ---
export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError("Invalid JSON format");
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setError(null);
    } catch (e) {
      setError("Invalid JSON format");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button onClick={format}>Beautify</Button>
          <Button variant="outline" onClick={minify}>Minify</Button>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setInput("")}>Clear</Button>
      </div>
      
      <div className="relative">
        <Textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Paste JSON here e.g. {"key": "value"}'
          className="min-h-[400px] font-mono text-sm"
        />
        {error && (
          <div className="absolute bottom-4 left-4 right-4 bg-destructive/10 text-destructive p-2 rounded-md text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> {error}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Base64 ---
export function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const process = () => {
    try {
      if (mode === 'encode') {
        setOutput(btoa(input));
      } else {
        setOutput(atob(input));
      }
    } catch (e) {
      setOutput("Error: Invalid input for decoding");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button 
          variant={mode === 'encode' ? 'default' : 'outline'} 
          onClick={() => setMode('encode')}
        >
          Encode
        </Button>
        <Button 
          variant={mode === 'decode' ? 'default' : 'outline'} 
          onClick={() => setMode('decode')}
        >
          Decode
        </Button>
      </div>

      <div className="grid gap-4">
        <div>
          <Label>Input</Label>
          <Textarea 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            className="font-mono h-32" 
          />
        </div>
        
        <Button onClick={process}>Process</Button>

        <div>
          <Label>Output</Label>
          <div className="relative">
            <Textarea 
              value={output} 
              readOnly 
              className="font-mono h-32 bg-muted" 
            />
            <Button 
              size="icon" 
              variant="ghost" 
              className="absolute top-2 right-2"
              onClick={() => {
                navigator.clipboard.writeText(output);
                toast({ title: "Copied!" });
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- URL Encoder ---
export function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div>
          <Label>Input URL</Label>
          <Textarea 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            className="h-32" 
          />
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => setOutput(encodeURIComponent(input))}>Encode</Button>
          <Button variant="outline" onClick={() => setOutput(decodeURIComponent(input))}>Decode</Button>
        </div>

        <div>
          <Label>Result</Label>
          <Textarea value={output} readOnly className="h-32 bg-muted" />
        </div>
      </div>
    </div>
  );
}

// --- UUID Generator ---
export function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);

  const generate = () => {
    const newUuids = Array.from({ length: count }, () => crypto.randomUUID());
    setUuids(newUuids);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-4">
        <div className="space-y-2 w-32">
          <Label>How many?</Label>
          <Input 
            type="number" 
            min={1} 
            max={50} 
            value={count} 
            onChange={(e) => setCount(parseInt(e.target.value) || 1)} 
          />
        </div>
        <Button onClick={generate}>Generate UUIDs</Button>
      </div>

      {uuids.length > 0 && (
        <div className="space-y-2">
          <Label>Results</Label>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2 max-h-[400px] overflow-y-auto">
            {uuids.map((uuid) => (
              <div key={uuid} className="flex justify-between items-center group">
                <span>{uuid}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={() => {
                    navigator.clipboard.writeText(uuid);
                    toast({ title: "Copied!" });
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full" onClick={() => {
            navigator.clipboard.writeText(uuids.join('\n'));
            toast({ title: "All copied!" });
          }}>
            Copy All
          </Button>
        </div>
      )}
    </div>
  );
}

// --- JWT Decoder ---
export function JwtDecoder() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");

  const decode = (input: string) => {
    setToken(input);
    try {
      const parts = input.split('.');
      if (parts.length !== 3) throw new Error("Invalid JWT format");
      
      setHeader(JSON.stringify(JSON.parse(atob(parts[0])), null, 2));
      setPayload(JSON.stringify(JSON.parse(atob(parts[1])), null, 2));
    } catch (e) {
      // Silent fail or simple clear if invalid
      if (input === "") {
        setHeader("");
        setPayload("");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Paste JWT Token</Label>
        <Textarea 
          value={token} 
          onChange={(e) => decode(e.target.value)}
          className="font-mono text-xs h-24 break-all"
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label className="text-muted-foreground">Header</Label>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono min-h-[200px]">
            {header || "// Header will appear here"}
          </pre>
        </div>
        <div>
          <Label className="text-muted-foreground">Payload</Label>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono min-h-[200px]">
            {payload || "// Payload will appear here"}
          </pre>
        </div>
      </div>
    </div>
  );
}
