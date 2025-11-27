import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Download, Image as ImageIcon } from "lucide-react";

// --- Image Resizer ---
export function ImageResizer() {
  const [image, setImage] = useState<string | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          setWidth(img.width);
          setHeight(img.height);
          setImage(img.src);
        };
        img.src = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current || !image) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      
      const link = document.createElement('a');
      link.download = 'resized-image.png';
      link.href = canvas.toDataURL();
      link.click();
    };
    img.src = image;
  };

  return (
    <div className="space-y-6">
      <Input type="file" accept="image/*" onChange={handleUpload} />
      
      {image && (
        <div className="space-y-6">
          <div className="flex gap-4 max-w-xs">
            <div className="space-y-2">
              <Label>Width</Label>
              <Input 
                type="number" 
                value={width} 
                onChange={(e) => setWidth(Number(e.target.value))} 
              />
            </div>
            <div className="space-y-2">
              <Label>Height</Label>
              <Input 
                type="number" 
                value={height} 
                onChange={(e) => setHeight(Number(e.target.value))} 
              />
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden bg-muted/50 flex items-center justify-center p-4">
            <img src={image} style={{ maxWidth: '100%', maxHeight: '300px' }} alt="Preview" />
          </div>

          <Button onClick={handleDownload} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Download Resized Image
          </Button>
          
          {/* Hidden canvas for processing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}

// --- PNG to JPG ---
export function ImageConverter() {
  // For this demo, we'll reuse the resizer logic but just change the export format
  // In a full app, this would be separate, but for brevity I'll implement a simple version
  const [image, setImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertToJpg = () => {
    if (!canvasRef.current || !image) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      // Draw white background for JPG transparency handling
      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      
      const link = document.createElement('a');
      link.download = 'converted-image.jpg';
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
    };
    img.src = image;
  };

  return (
    <div className="space-y-6">
      <div className="p-8 border-2 border-dashed rounded-xl text-center space-y-4">
        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
        <Label htmlFor="file-upload" className="block">Upload PNG Image</Label>
        <Input id="file-upload" type="file" accept="image/png" onChange={handleUpload} />
      </div>

      {image && (
        <div className="text-center space-y-4">
          <img src={image} className="mx-auto max-h-48 rounded shadow-md" alt="Preview" />
          <Button onClick={convertToJpg}>Convert to JPG & Download</Button>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
