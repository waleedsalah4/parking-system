import type { Category } from "@/types";
import { useState } from "react";

export default function CategoryRateEditor({
  category,
  onUpdate,
  isLoading,
}: {
  isLoading: boolean;
  category: Category;
  onUpdate: (id: string, rateNormal: number, rateSpecial: number) => void;
}) {
  const [rates, setRates] = useState({
    rateNormal: category.rateNormal,
    rateSpecial: category.rateSpecial,
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    await onUpdate(category.id, rates.rateNormal, rates.rateSpecial);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setRates({
      rateNormal: category.rateNormal,
      rateSpecial: category.rateSpecial,
    });
    setIsEditing(false);
  };

  return (
    <div className="flex-start flex flex-col justify-between gap-4 rounded-lg border p-4 md:flex-row md:items-center">
      <div>
        <h4 className="font-medium text-gray-900">{category.name}</h4>
        <p className="text-sm text-gray-600">Category ID: {category.id}</p>
      </div>

      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
        {isEditing ? (
          <>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Normal:</label>
              <input
                type="number"
                step="0.1"
                value={rates.rateNormal}
                onChange={(e) =>
                  setRates((prev) => ({
                    ...prev,
                    rateNormal: parseFloat(e.target.value),
                  }))
                }
                className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Special:</label>
              <input
                type="number"
                step="0.1"
                value={rates.rateSpecial}
                onChange={(e) =>
                  setRates((prev) => ({
                    ...prev,
                    rateSpecial: parseFloat(e.target.value),
                  }))
                }
                className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="cursor-pointer rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="cursor-pointer rounded bg-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-400"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <div className="text-sm text-gray-600">
              Normal:{" "}
              <span className="font-medium">${category.rateNormal}</span> |
              Special:{" "}
              <span className="font-medium">${category.rateSpecial}</span>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="cursor-pointer rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
}
