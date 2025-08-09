import { useState } from 'react';
import { motion } from 'motion/react';
import { FolderPlus, Check, X, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { Collection } from './CollectionsManager';
import { GradientData } from './GradientGallery';

interface AddToCollectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gradient: GradientData;
  collections: Collection[];
  onUpdateCollections: (collections: Collection[]) => void;
}

export function AddToCollectionDialog({ 
  isOpen, 
  onClose, 
  gradient, 
  collections, 
  onUpdateCollections 
}: AddToCollectionDialogProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const toggleGradientInCollection = (collectionId: string) => {
    const updatedCollections = collections.map(collection => {
      if (collection.id === collectionId) {
        const isInCollection = collection.gradientIds.includes(gradient.id);
        return {
          ...collection,
          gradientIds: isInCollection 
            ? collection.gradientIds.filter(id => id !== gradient.id)
            : [...collection.gradientIds, gradient.id]
        };
      }
      return collection;
    });

    onUpdateCollections(updatedCollections);
    
    const collection = collections.find(c => c.id === collectionId);
    const isAdding = !collection?.gradientIds.includes(gradient.id);
    
    toast.success(
      isAdding 
        ? `Added to "${collection?.name}"` 
        : `Removed from "${collection?.name}"`
    );
  };

  const createQuickCollection = () => {
    if (!newCollectionName.trim()) {
      toast.error('Please enter a collection name');
      return;
    }

    const newCollection: Collection = {
      id: Date.now().toString(),
      name: newCollectionName.trim(),
      description: '',
      gradientIds: [gradient.id],
      color: gradient.colors[0] || '#667eea',
      createdAt: new Date().toISOString()
    };

    onUpdateCollections([...collections, newCollection]);
    setNewCollectionName('');
    setShowCreateForm(false);
    toast.success(`Created "${newCollection.name}" and added gradient!`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-white rounded-3xl">
        <DialogTitle className="sr-only">Add to Collection</DialogTitle>
        <DialogDescription className="sr-only">
          Add {gradient.name} gradient to one of your collections or create a new collection
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
              <FolderPlus className="w-5 h-5 text-gray-600" />
              <h2 className="font-bold text-gray-900">Add to Collection</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Gradient Info */}
          <div className="mb-6">
            <div 
              className="h-16 rounded-xl border shadow-sm mb-3"
              style={{ background: gradient.gradient }}
            />
            <p className="font-semibold text-gray-900">{gradient.name}</p>
            <p className="text-sm text-gray-500">{gradient.category}</p>
          </div>

          {/* Collections List */}
          <div className="space-y-3 mb-6">
            {collections.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-2">No collections yet</p>
                <p className="text-sm">Create your first collection below</p>
              </div>
            ) : (
              collections.map((collection) => {
                const isInCollection = collection.gradientIds.includes(gradient.id);
                
                return (
                  <motion.div
                    key={collection.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      isInCollection 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => toggleGradientInCollection(collection.id)}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: collection.color }}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{collection.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {collection.gradientIds.length} gradient{collection.gradientIds.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {isInCollection && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Create New Collection */}
          <div className="border-t border-gray-100 pt-4">
            {!showCreateForm ? (
              <Button 
                variant="outline" 
                onClick={() => setShowCreateForm(true)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Collection
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Collection Name</Label>
                  <Input
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="e.g., My Favorites"
                    onKeyPress={(e) => e.key === 'Enter' && createQuickCollection()}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={createQuickCollection} size="sm" className="flex-1">
                    Create & Add
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewCollectionName('');
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}