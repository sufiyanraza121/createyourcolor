import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Copy, Save, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { GradientData } from './GradientGallery';

interface GradientCreatorProps {
  onClose: () => void;
  onSave: (gradient: Omit<GradientData, 'id'>) => void;
}

const gradientDirections = [
  { label: 'Diagonal ↗', value: '135deg' },
  { label: 'Horizontal →', value: '90deg' },
  { label: 'Vertical ↓', value: '180deg' },
  { label: 'Diagonal ↖', value: '45deg' },
];

const categories = ['Nature', 'Sky', 'Space', 'Custom'];

export function GradientCreator({ onClose, onSave }: GradientCreatorProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Custom');
  const [color1, setColor1] = useState('#667eea');
  const [color2, setColor2] = useState('#764ba2');
  const [direction, setDirection] = useState('135deg');

  const gradientCSS = `linear-gradient(${direction}, ${color1} 0%, ${color2} 100%)`;

  const randomizeColors = () => {
    const randomColor = () => {
      const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#43e97b', '#38f9d7', '#4facfe', '#00f2fe', '#a8edea', '#fed6e3'];
      return colors[Math.floor(Math.random() * colors.length)];
    };
    setColor1(randomColor());
    setColor2(randomColor());
  };

  const copyCSS = () => {
    navigator.clipboard.writeText(`background: ${gradientCSS};`);
    toast.success('Gradient CSS copied to clipboard');
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Please enter a name for your gradient');
      return;
    }

    const newGradient = {
      name: name.trim(),
      gradient: gradientCSS,
      colors: [color1, color2],
      description: description.trim() || `Custom ${category.toLowerCase()} gradient`,
      category,
    };

    onSave(newGradient);
    toast.success('Gradient saved successfully!');
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-white rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Create Gradient</DialogTitle>
        <DialogDescription className="sr-only">
          Create a custom gradient by selecting colors, direction, and adding details
        </DialogDescription>
        <motion.div 
          className="p-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Create Gradient</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Preview */}
        <div className="space-y-4 mb-6">
          <Label>Preview</Label>
          <div 
            className="h-32 rounded-xl shadow-sm border"
            style={{ background: gradientCSS }}
          />
        </div>

        {/* Color Controls */}
        <div className="space-y-4 mb-6">
          <Label>Colors</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Color 1</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="w-12 h-10 p-1 border rounded cursor-pointer"
                />
                <Input
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="flex-1 font-mono text-sm"
                  placeholder="#667eea"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Color 2</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-12 h-10 p-1 border rounded cursor-pointer"
                />
                <Input
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="flex-1 font-mono text-sm"
                  placeholder="#764ba2"
                />
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={randomizeColors}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Randomize
          </Button>
        </div>

        {/* Direction */}
        <div className="space-y-2 mb-6">
          <Label>Direction</Label>
          <Select value={direction} onValueChange={setDirection}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {gradientDirections.map((dir) => (
                <SelectItem key={dir.value} value={dir.value}>
                  {dir.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Details */}
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Sunset Dreams"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your gradient..."
              rows={2}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyCSS} className="flex-1">
            <Copy className="w-4 h-4 mr-2" />
            Copy CSS
          </Button>
          <Button onClick={handleSave} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}