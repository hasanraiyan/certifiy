'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, X } from 'lucide-react';

export default function MultiSelectSheet({
  isOpen,
  onOpenChange,
  title,
  items = [],
  selectedIds = [],
  onSave,
  itemDisplayField = 'name',
  itemSearchFields = ['name'],
  itemFilterField = null,
  itemFilterOptions = [],
  renderItem = null,
  renderSelectedItem = null
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [localSelectedIds, setLocalSelectedIds] = useState(selectedIds);

  // Reset local state when sheet opens/closes or selectedIds change
  useState(() => {
    setLocalSelectedIds(selectedIds);
  }, [selectedIds, isOpen]);

  // Filter and search items
  const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    
    return items.filter(item => {
      // Ensure item exists and has required properties
      if (!item || typeof item !== 'object') return false;
      
      // Search filter
      const matchesSearch = searchTerm === '' || itemSearchFields.some(field => {
        const fieldValue = item[field];
        return fieldValue && typeof fieldValue === 'string' && 
               fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
      });
      
      // Category/domain filter
      const matchesFilter = filterValue === 'all' || 
        !itemFilterField || 
        item[itemFilterField] === filterValue;
      
      return matchesSearch && matchesFilter;
    });
  }, [items, searchTerm, filterValue, itemSearchFields, itemFilterField]);

  // Get selected items for display
  const selectedItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.filter(item => item && item.id && localSelectedIds.includes(item.id));
  }, [items, localSelectedIds]);

  const toggleItem = (itemId) => {
    setLocalSelectedIds(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const removeItem = (itemId) => {
    setLocalSelectedIds(prev => prev.filter(id => id !== itemId));
  };

  const clearAll = () => {
    setLocalSelectedIds([]);
  };

  const handleSave = () => {
    onSave(localSelectedIds);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalSelectedIds(selectedIds); // Reset to original
    onOpenChange(false);
  };

  // Default item renderer
  const defaultRenderItem = (item) => (
    <div className="flex-1">
      <div className="font-medium">{item?.[itemDisplayField] || 'Untitled'}</div>
      {item?.description && (
        <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
      )}
      <div className="flex gap-2 mt-2">
        {item?.type && <Badge variant="secondary">{item.type}</Badge>}
        {item?.domain && <Badge variant="outline">{item.domain}</Badge>}
        {item?.difficulty && <Badge variant="outline">{item.difficulty}</Badge>}
        {item?.status && <Badge variant="outline">{item.status}</Badge>}
      </div>
    </div>
  );

  // Default selected item renderer
  const defaultRenderSelectedItem = (item) => (
    <div className="flex-1">
      <div className="font-medium">{item?.[itemDisplayField] || 'Untitled'}</div>
      {item?.description && (
        <div className="text-sm text-muted-foreground truncate">{item.description}</div>
      )}
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full min-w-[800px] max-w-6xl p-0 flex flex-col">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="text-xl">{title}</SheetTitle>
          <div className="text-sm text-muted-foreground">
            {localSelectedIds.length} selected • {filteredItems.length} available
          </div>
        </SheetHeader>

        <div className="flex-grow overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 h-full">
            {/* Selected Items */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">
                  Selected ({localSelectedIds.length})
                </h3>
                {localSelectedIds.length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearAll}>
                    Clear All
                  </Button>
                )}
              </div>
              
              <div className="flex-grow overflow-y-auto space-y-3 pr-2">
                {selectedItems.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
                    No items selected yet. Choose items from the available list.
                  </div>
                ) : (
                  selectedItems.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex justify-between items-start">
                        {renderSelectedItem ? renderSelectedItem(item) : defaultRenderSelectedItem(item)}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeItem(item.id)}
                          className="ml-2 flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Available Items */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Available Items</h3>
                <div className="text-sm text-muted-foreground">
                  {filteredItems.length} items
                </div>
              </div>

              {/* Search and Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    placeholder="Search items..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {itemFilterField && itemFilterOptions.length > 0 && (
                  <Select value={filterValue} onValueChange={setFilterValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter items" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All {itemFilterField}s</SelectItem>
                      {itemFilterOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Items List */}
              <div className="flex-grow overflow-y-auto space-y-3 pr-2">
                {filteredItems.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">
                    No items found matching your criteria.
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <Card 
                      key={item.id} 
                      className={`p-4 cursor-pointer hover:border-primary transition-colors ${
                        localSelectedIds.includes(item.id) ? 'border-primary ring-1 ring-primary' : ''
                      }`}
                      onClick={() => toggleItem(item.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox 
                          checked={localSelectedIds.includes(item.id)} 
                          className="mt-0.5"
                          onClick={(e) => e.stopPropagation()}
                        />
                        {renderItem ? renderItem(item) : defaultRenderItem(item)}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {localSelectedIds.length} items selected
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Selection
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}