import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Plus, Heart, Folder } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface GradientToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  onCreateClick: () => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  categories: string[];
  onManageCollections: () => void;
  collectionsCount: number;
}

export function GradientToolbar({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  onCreateClick,
  showFavoritesOnly,
  onToggleFavorites,
  categories,
  onManageCollections,
  collectionsCount,
}: GradientToolbarProps) {
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto mb-8 space-y-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search gradients..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm border border-gray-200"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Collections */}
          <Button
            variant="outline"
            size="sm"
            onClick={onManageCollections}
          >
            <Folder className="w-4 h-4 mr-2" />
            Collections
            {collectionsCount > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {collectionsCount}
              </Badge>
            )}
          </Button>

          {/* Favorites toggle */}
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            size="sm"
            onClick={onToggleFavorites}
            className={showFavoritesOnly ? "bg-red-500 hover:bg-red-600 text-white" : ""}
          >
            <Heart className={`w-4 h-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            Favorites
          </Button>

          {/* Category filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Categories
                {selectedCategories.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {selectedCategories.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryToggle(category)}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Create button */}
          <Button onClick={onCreateClick} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create
          </Button>
        </div>
      </div>

      {/* Active filters */}
      {selectedCategories.length > 0 && (
        <motion.div 
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {selectedCategories.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="cursor-pointer hover:bg-gray-200"
              onClick={() => handleCategoryToggle(category)}
            >
              {category}
              <span className="ml-1">×</span>
            </Badge>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}