import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { GradientCard } from './GradientCard';
import { GradientToolbar } from './GradientToolbar';
import { GradientCreator } from './GradientCreator';
import { GradientExporter } from './GradientExporter';
import { CollectionsManager, Collection } from './CollectionsManager';
import { AddToCollectionDialog } from './AddToCollectionDialog';

export interface GradientData {
  id: number;
  name: string;
  gradient: string;
  colors: string[];
  description: string;
  category: string;
}

const defaultGradients: GradientData[] = [
  {
    id: 1,
    name: "Ocean Breeze",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    colors: ["#667eea", "#764ba2"],
    description: "A calming blue-purple gradient reminiscent of ocean depths",
    category: "Nature"
  },
  {
    id: 2,
    name: "Sunset Glow",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    colors: ["#f093fb", "#f5576c"],
    description: "Warm pink to coral transition capturing golden hour magic",
    category: "Nature"
  },
  {
    id: 3,
    name: "Forest Dream",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    colors: ["#43e97b", "#38f9d7"],
    description: "Fresh green to aqua blend inspired by lush forests",
    category: "Nature"
  },
  {
    id: 4,
    name: "Midnight Sky",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    colors: ["#4facfe", "#00f2fe"],
    description: "Deep blue to cyan evoking clear night skies",
    category: "Sky"
  },
  {
    id: 5,
    name: "Lavender Fields",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    colors: ["#a8edea", "#fed6e3"],
    description: "Soft mint to blush pink like endless lavender fields",
    category: "Nature"
  },
  {
    id: 6,
    name: "Golden Hour",
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    colors: ["#ffecd2", "#fcb69f"],
    description: "Warm cream to peach capturing the perfect golden hour",
    category: "Nature"
  },
  {
    id: 7,
    name: "Aurora Borealis",
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    colors: ["#fa709a", "#fee140"],
    description: "Vibrant pink to yellow like dancing northern lights",
    category: "Sky"
  },
  {
    id: 8,
    name: "Deep Space",
    gradient: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    colors: ["#6a11cb", "#2575fc"],
    description: "Purple to blue gradient reminiscent of cosmic nebulae",
    category: "Space"
  }
];

export function GradientGallery() {
  const [selectedGradient, setSelectedGradient] = useState<GradientData | null>(null);
  const [gradients, setGradients] = useState<GradientData[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showCreator, setShowCreator] = useState(false);
  const [showCollectionsManager, setShowCollectionsManager] = useState(false);
  const [showExporter, setShowExporter] = useState(false);
  const [showAddToCollection, setShowAddToCollection] = useState(false);
  const [exportingGradient, setExportingGradient] = useState<GradientData | null>(null);
  const [addingToCollectionGradient, setAddingToCollectionGradient] = useState<GradientData | null>(null);
  const [nextId, setNextId] = useState(9);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedGradients = localStorage.getItem('customGradients');
    const savedFavorites = localStorage.getItem('favoriteGradients');
    const savedCollections = localStorage.getItem('gradientCollections');
    
    if (savedGradients) {
      const customGradients = JSON.parse(savedGradients);
      setGradients([...defaultGradients, ...customGradients]);
      setNextId(Math.max(...defaultGradients.map(g => g.id), ...customGradients.map((g: GradientData) => g.id)) + 1);
    } else {
      setGradients(defaultGradients);
    }
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    if (savedCollections) {
      setCollections(JSON.parse(savedCollections));
    }
  }, []);

  // Save custom gradients to localStorage
  const saveCustomGradients = (allGradients: GradientData[]) => {
    const customGradients = allGradients.filter(g => g.id > 8);
    localStorage.setItem('customGradients', JSON.stringify(customGradients));
  };

  // Save favorites to localStorage
  const saveFavorites = (favs: number[]) => {
    localStorage.setItem('favoriteGradients', JSON.stringify(favs));
  };

  // Save collections to localStorage
  const saveCollections = (colls: Collection[]) => {
    localStorage.setItem('gradientCollections', JSON.stringify(colls));
  };

  const categories = useMemo(() => {
    return [...new Set(gradients.map(g => g.category))].sort();
  }, [gradients]);

  const filteredGradients = useMemo(() => {
    let filtered = gradients;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(gradient =>
        gradient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gradient.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gradient.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(gradient =>
        selectedCategories.includes(gradient.category)
      );
    }

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter(gradient => favorites.includes(gradient.id));
    }

    return filtered;
  }, [gradients, searchQuery, selectedCategories, showFavoritesOnly, favorites]);

  const handleSaveGradient = (newGradient: Omit<GradientData, 'id'>) => {
    const gradientWithId = { ...newGradient, id: nextId };
    const updatedGradients = [...gradients, gradientWithId];
    setGradients(updatedGradients);
    setNextId(nextId + 1);
    saveCustomGradients(updatedGradients);
  };

  const toggleFavorite = (gradientId: number) => {
    const newFavorites = favorites.includes(gradientId)
      ? favorites.filter(id => id !== gradientId)
      : [...favorites, gradientId];
    
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const handleUpdateCollections = (newCollections: Collection[]) => {
    setCollections(newCollections);
    saveCollections(newCollections);
  };

  const handleExportGradient = (gradient: GradientData) => {
    setExportingGradient(gradient);
    setShowExporter(true);
    setSelectedGradient(null);
  };

  const handleAddToCollection = (gradient: GradientData) => {
    setAddingToCollectionGradient(gradient);
    setShowAddToCollection(true);
    setSelectedGradient(null);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Gradient Gallery</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover beautiful gradients, create your own, and organize them in collections. 
            Export in multiple formats and share with the world.
          </p>
        </motion.div>

        {/* Toolbar */}
        <GradientToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          onCreateClick={() => setShowCreator(true)}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
          categories={categories}
          onManageCollections={() => setShowCollectionsManager(true)}
          collectionsCount={collections.length}
        />

        {/* Results count */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-gray-600">
            {filteredGradients.length} gradient{filteredGradients.length !== 1 ? 's' : ''} found
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredGradients.map((gradient, index) => (
              <motion.div
                key={gradient.id}
                className="aspect-square rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                style={{ background: gradient.gradient }}
                onClick={() => setSelectedGradient(gradient)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.05,
                  ease: "easeOut" 
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                layout
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredGradients.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-500 text-lg mb-4">No gradients found</p>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedGradient && (
          <Dialog open={!!selectedGradient} onOpenChange={() => setSelectedGradient(null)}>
            <DialogContent className="max-w-md p-0 bg-transparent border-none shadow-none">
              <DialogTitle className="sr-only">
                {selectedGradient.name} - Gradient Details
              </DialogTitle>
              <DialogDescription className="sr-only">
                {selectedGradient.description}. Colors: {selectedGradient.colors.join(', ')}
              </DialogDescription>
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <GradientCard 
                  gradient={selectedGradient} 
                  isFavorite={favorites.includes(selectedGradient.id)}
                  onToggleFavorite={toggleFavorite}
                  onExport={() => handleExportGradient(selectedGradient)}
                  onAddToCollection={() => handleAddToCollection(selectedGradient)}
                  collections={collections}
                />
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Creator Modal */}
      <AnimatePresence>
        {showCreator && (
          <GradientCreator
            onClose={() => setShowCreator(false)}
            onSave={handleSaveGradient}
          />
        )}
      </AnimatePresence>

      {/* Collections Manager */}
      <AnimatePresence>
        {showCollectionsManager && (
          <CollectionsManager
            isOpen={showCollectionsManager}
            onClose={() => setShowCollectionsManager(false)}
            gradients={gradients}
            collections={collections}
            onUpdateCollections={handleUpdateCollections}
          />
        )}
      </AnimatePresence>

      {/* Exporter */}
      <AnimatePresence>
        {showExporter && exportingGradient && (
          <GradientExporter
            gradient={exportingGradient}
            isOpen={showExporter}
            onClose={() => {
              setShowExporter(false);
              setExportingGradient(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Add to Collection */}
      <AnimatePresence>
        {showAddToCollection && addingToCollectionGradient && (
          <AddToCollectionDialog
            isOpen={showAddToCollection}
            onClose={() => {
              setShowAddToCollection(false);
              setAddingToCollectionGradient(null);
            }}
            gradient={addingToCollectionGradient}
            collections={collections}
            onUpdateCollections={handleUpdateCollections}
          />
        )}
      </AnimatePresence>
    </div>
  );
}