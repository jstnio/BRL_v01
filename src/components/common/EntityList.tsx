import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Button from './Button';

interface Props<T> {
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onAdd?: () => void;
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
  addButtonText?: string;
}

const EntityList = <T,>({
  title,
  items,
  renderItem,
  onAdd,
  onEdit,
  onDelete,
  addButtonText = 'Add New'
}: Props<T>) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        {onAdd && (
          <Button onClick={onAdd} variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            {addButtonText}
          </Button>
        )}
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {items.map((item, index) => (
            <li key={index} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-grow">{renderItem(item)}</div>
                <div className="flex space-x-2 ml-4">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(index)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="px-4 py-4 sm:px-6 text-gray-500 text-center">
              No items to display
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default EntityList;
