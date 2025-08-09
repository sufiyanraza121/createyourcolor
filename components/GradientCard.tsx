import { motion } from 'motion/react';
import { 
  Copy, 
  Palette, 
  Heart, 
  Share2, 
  Twitter, 
  Facebook, 
  Link, 
  Download,
  FolderPlus 
} from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { GradientData } from './GradientGallery';
import { Collection } from './CollectionsManager';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';

interface GradientCardProps {
  gradient: GradientData;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onExport: () => void;
  onAddToCollection: () => void;
  collections: Collection[];
}

export function GradientCard({ 
  gradient, 
  isFavorite, 
  onToggleFavorite, 
  onExport, 
  onAddToCollection,
  collections 
}: GradientCardProps) {
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  const copyGradientCSS = () => {
    const css = `background: ${gradient.gradient};`;
    copyToClipboard(css, 'Gradient CSS');
  };

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=Check out this beautiful "${gradient.name}" gradient!&url=${encodeURIComponent(window.location.href)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
  };

  const copyLink = () => {
    copyToClipboard(window.location.href, 'Link');
  };

  const openShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  // Find collections containing this gradient
  const containingCollections = collections.filter(c => 
    c.gradientIds.includes(gradient.id)
  );

  return (
    <motion.div 
      className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-sm mx-auto"
      layout
    >
      {/* Gradient Preview */}
      <motion.div 
        className="h-48 w-full relative"
        style={{ background: gradient.gradient }}
        layoutId={`gradient-${gradient.id}`}
      >
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Floating actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="sm"
            variant={isFavorite ? "default" : "secondary"}
            className={`shadow-lg backdrop-blur-sm ${
              isFavorite 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-white/90 hover:bg-white text-gray-700'
            }`}
            onClick={() => onToggleFavorite(gradient.id)}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="sm" 
                variant="secondary" 
                className="shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onExport}>
                <Download className="w-4 h-4 mr-2" />
                Export Gradient
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAddToCollection}>
                <FolderPlus className="w-4 h-4 mr-2" />
                Add to Collection
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openShare(shareUrls.twitter)}>
                <Twitter className="w-4 h-4 mr-2" />
                Share on Twitter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openShare(shareUrls.facebook)}>
                <Facebook className="w-4 h-4 mr-2" />
                Share on Facebook
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyLink}>
                <Link className="w-4 h-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div 
        className="p-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-500 uppercase tracking-wide">{gradient.category}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{gradient.name}</h2>
          <p className="text-gray-600">{gradient.description}</p>
          
          {/* Collections info */}
          {containingCollections.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {containingCollections.map((collection) => (
                <div
                  key={collection.id}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full"
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: collection.color }}
                  />
                  <span className="text-xs text-gray-600">{collection.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Color Palette */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Colors</h3>
          <div className="flex gap-3">
            {gradient.colors.map((color, index) => (
              <motion.div
                key={index}
                className="flex-1 space-y-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <div 
                  className="h-16 rounded-lg shadow-sm border cursor-pointer hover:scale-105 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => copyToClipboard(color, 'Color code')}
                />
                <p className="text-xs font-mono text-gray-700 text-center">{color}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <motion.div 
          className="pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button 
            onClick={copyGradientCSS}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy CSS
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}