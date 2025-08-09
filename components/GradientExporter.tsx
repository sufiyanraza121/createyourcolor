import { useState } from 'react';
import { motion } from 'motion/react';
import { Download, FileImage, Code, Palette, X, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import { GradientData } from './GradientGallery';

interface GradientExporterProps {
  gradient: GradientData;
  isOpen: boolean;
  onClose: () => void;
}

export function GradientExporter({ gradient, isOpen, onClose }: GradientExporterProps) {
  const [exportFormat, setExportFormat] = useState<'png' | 'svg' | 'css'>('png');
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [cssVariableName, setCssVariableName] = useState(
    gradient.name.toLowerCase().replace(/\s+/g, '-')
  );

  const exportToPNG = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    if (ctx) {
      // Create gradient
      const gradient2D = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.colors.forEach((color, index) => {
        gradient2D.addColorStop(index / (gradient.colors.length - 1), color);
      });
      
      ctx.fillStyle = gradient2D;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${gradient.name.toLowerCase().replace(/\s+/g, '-')}.png`;
          a.click();
          URL.revokeObjectURL(url);
          toast.success('PNG exported successfully!');
        }
      });
    }
  };

  const exportToSVG = () => {
    const svgContent = `<svg width="${dimensions.width}" height="${dimensions.height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${cssVariableName}" x1="0%" y1="0%" x2="100%" y2="100%">
      ${gradient.colors.map((color, index) => 
        `<stop offset="${(index / (gradient.colors.length - 1)) * 100}%" style="stop-color:${color};stop-opacity:1" />`
      ).join('\n      ')}
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#${cssVariableName})" />
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${gradient.name.toLowerCase().replace(/\s+/g, '-')}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('SVG exported successfully!');
  };

  const exportToCSS = () => {
    const cssContent = `/* ${gradient.name} - ${gradient.description} */
:root {
  --gradient-${cssVariableName}: ${gradient.gradient};
  ${gradient.colors.map((color, index) => 
    `--gradient-${cssVariableName}-color-${index + 1}: ${color};`
  ).join('\n  ')}
}

/* Usage examples */
.gradient-${cssVariableName} {
  background: var(--gradient-${cssVariableName});
}

.gradient-${cssVariableName}-fallback {
  background: ${gradient.colors[0]}; /* Fallback for older browsers */
  background: var(--gradient-${cssVariableName});
}`;

    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${gradient.name.toLowerCase().replace(/\s+/g, '-')}.css`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSS variables exported successfully!');
  };

  const handleExport = () => {
    switch (exportFormat) {
      case 'png':
        exportToPNG();
        break;
      case 'svg':
        exportToSVG();
        break;
      case 'css':
        exportToCSS();
        break;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-white rounded-3xl">
        <DialogTitle className="sr-only">Export Gradient</DialogTitle>
        <DialogDescription className="sr-only">
          Export {gradient.name} gradient in various formats including PNG, SVG, or CSS variables
        </DialogDescription>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-gray-600" />
              <h2 className="font-bold text-gray-900">Export Gradient</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Preview */}
          <div className="space-y-4 mb-6">
            <Label>Preview</Label>
            <div 
              className="h-24 rounded-xl border shadow-sm"
              style={{ background: gradient.gradient }}
            />
            <p className="text-sm text-gray-600">
              {gradient.name} • {gradient.category}
            </p>
          </div>

          <Separator className="my-6" />

          {/* Export Format */}
          <div className="space-y-4 mb-6">
            <Label>Export Format</Label>
            <Select value={exportFormat} onValueChange={(value: 'png' | 'svg' | 'css') => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">
                  <div className="flex items-center gap-2">
                    <FileImage className="w-4 h-4" />
                    PNG Image
                  </div>
                </SelectItem>
                <SelectItem value="svg">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    SVG Vector
                  </div>
                </SelectItem>
                <SelectItem value="css">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    CSS Variables
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Format-specific options */}
          {(exportFormat === 'png' || exportFormat === 'svg') && (
            <div className="space-y-4 mb-6">
              <Label>Dimensions</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Width (px)</Label>
                  <Input
                    type="number"
                    value={dimensions.width}
                    onChange={(e) => setDimensions({ ...dimensions, width: parseInt(e.target.value) || 800 })}
                    min="100"
                    max="4000"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Height (px)</Label>
                  <Input
                    type="number"
                    value={dimensions.height}
                    onChange={(e) => setDimensions({ ...dimensions, height: parseInt(e.target.value) || 600 })}
                    min="100"
                    max="4000"
                  />
                </div>
              </div>
            </div>
          )}

          {exportFormat === 'css' && (
            <div className="space-y-4 mb-6">
              <Label>CSS Variable Name</Label>
              <Input
                value={cssVariableName}
                onChange={(e) => setCssVariableName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                placeholder="gradient-name"
              />
              <p className="text-xs text-gray-500">
                This will generate: --gradient-{cssVariableName}
              </p>
            </div>
          )}

          {/* Export Button */}
          <Button onClick={handleExport} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Export {exportFormat.toUpperCase()}
          </Button>

          {/* Format Info */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              {exportFormat === 'png' && 'PNG: Perfect for using in designs, presentations, or as background images.'}
              {exportFormat === 'svg' && 'SVG: Scalable vector format ideal for web use and high-DPI displays.'}
              {exportFormat === 'css' && 'CSS: Ready-to-use CSS variables for your web projects with fallbacks.'}
            </p>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}