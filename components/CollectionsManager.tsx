import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderPlus, 
  Folder, 
  Edit3, 
  Trash2, 
  X, 
  Plus,
  FolderOpen,
  MoreHorizontal
} from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { GradientData } from './GradientGallery';

export interface Collection {
  id: string;
  name: string;
  description: string;
  gradientIds: number[];
  color: string;
  createdAt: string;
}

interface CollectionsManagerProps {
  isOpen: boolean;
  onClose: () => void;
  gradients: GradientData[];
  collections: Collection[];
  onUpdateCollections: (collections: Collection[]) => void;
}

export function CollectionsManager({ 
  isOpen, 
  onClose, 
  gradients, 
  collections, 
  onUpdateCollections 
}: CollectionsManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    color: '#667eea'
  });

  const collectionColors = [
    '#667eea', '#f093fb', '#43e97b', '#4facfe', 
    '#a8edea', '#ffecd2', '#fa709a', '#6a11cb'
  ];

  const createCollection = () => {
    if (!newCollection.name.trim()) {
      toast.error('Please enter a collection name');
      return;
    }

    const collection: Collection = {
      id: Date.now().toString(),
      name: newCollection.name.trim(),
      description: newCollection.description.trim(),
      gradientIds: [],
      color: newCollection.color,
      createdAt: new Date().toISOString()
    };

    onUpdateCollections([...collections, collection]);
    setNewCollection({ name: '', description: '', color: '#667eea' });
    setShowCreateForm(false);
    toast.success('Collection created successfully!');
  };

  const updateCollection = () => {
    if (!editingCollection || !editingCollection.name.trim()) {
      toast.error('Please enter a collection name');
      return;
    }

    const updatedCollections = collections.map(c => 
      c.id === editingCollection.id ? editingCollection : c
    );
    onUpdateCollections(updatedCollections);
    setEditingCollection(null);
    toast.success('Collection updated successfully!');
  };

  const deleteCollection = (collectionId: string) => {
    const updatedCollections = collections.filter(c => c.id !== collectionId);
    onUpdateCollections(updatedCollections);
    toast.success('Collection deleted successfully!');
  };

  const getCollectionGradients = (collection: Collection) => {
    return gradients.filter(g => collection.gradientIds.includes(g.id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 bg-white rounded-3xl max-h-[80vh] overflow-hidden">
        <DialogTitle className="sr-only">Manage Collections</DialogTitle>
        <DialogDescription className="sr-only">
          Create, edit, and organize your gradient collections. You have {collections.length} collection{collections.length !== 1 ? 's' : ''}.
        </DialogDescription>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex flex-col h-full"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Folder className="w-5 h-5 text-gray-600" />
                <h2 className="font-bold text-gray-900">Manage Collections</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowCreateForm(true)}
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  New Collection
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Create Form */}
            <AnimatePresence>
              {showCreateForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50"
                >
                  <h3 className="font-semibold text-gray-900 mb-4">Create New Collection</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Name *</Label>
                      <Input
                        value={newCollection.name}
                        onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                        placeholder="e.g., Sunset Gradients"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={newCollection.description}
                        onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                        placeholder="Describe your collection..."
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Color</Label>
                      <div className="flex gap-2">
                        {collectionColors.map((color) => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-lg border-2 transition-all ${
                              newCollection.color === color 
                                ? 'border-gray-900 scale-110' 
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setNewCollection({ ...newCollection, color })}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={createCollection} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Create
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowCreateForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Collections List */}
            <div className="space-y-4">
              {collections.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No collections yet</p>
                  <p className="text-sm">Create your first collection to organize gradients</p>
                </div>
              ) : (
                collections.map((collection) => {
                  const collectionGradients = getCollectionGradients(collection);
                  
                  return (
                    <motion.div
                      key={collection.id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      layout
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div 
                            className="w-4 h-4 rounded-full mt-1"
                            style={{ backgroundColor: collection.color }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{collection.name}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {collectionGradients.length} gradient{collectionGradients.length !== 1 ? 's' : ''}
                              </Badge>
                            </div>
                            {collection.description && (
                              <p className="text-sm text-gray-600 mb-3">{collection.description}</p>
                            )}
                            
                            {/* Gradient preview */}
                            {collectionGradients.length > 0 && (
                              <div className="flex gap-2 mb-2">
                                {collectionGradients.slice(0, 5).map((gradient) => (
                                  <div
                                    key={gradient.id}
                                    className="w-6 h-6 rounded border shadow-sm"
                                    style={{ background: gradient.gradient }}
                                    title={gradient.name}
                                  />
                                ))}
                                {collectionGradients.length > 5 && (
                                  <div className="w-6 h-6 rounded border bg-gray-100 flex items-center justify-center">
                                    <span className="text-xs text-gray-600">+{collectionGradients.length - 5}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingCollection(collection)}>
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit Collection
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deleteCollection(collection.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Collection
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>

        {/* Edit Dialog */}
        <AnimatePresence>
          {editingCollection && (
            <Dialog open={!!editingCollection} onOpenChange={() => setEditingCollection(null)}>
              <DialogContent className="max-w-md p-6 bg-white rounded-3xl">
                <DialogTitle className="sr-only">Edit Collection</DialogTitle>
                <DialogDescription className="sr-only">
                  Edit the details of {editingCollection?.name} collection
                </DialogDescription>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <h3 className="font-bold text-gray-900 mb-4">Edit Collection</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Name *</Label>
                      <Input
                        value={editingCollection.name}
                        onChange={(e) => setEditingCollection({ 
                          ...editingCollection, 
                          name: e.target.value 
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={editingCollection.description}
                        onChange={(e) => setEditingCollection({ 
                          ...editingCollection, 
                          description: e.target.value 
                        })}
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Color</Label>
                      <div className="flex gap-2">
                        {collectionColors.map((color) => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-lg border-2 transition-all ${
                              editingCollection.color === color 
                                ? 'border-gray-900 scale-110' 
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setEditingCollection({ 
                              ...editingCollection, 
                              color 
                            })}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button onClick={updateCollection} className="flex-1">
                        Update Collection
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditingCollection(null)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}