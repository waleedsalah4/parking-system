import React from "react";

interface RushHour {
  weekDay: number;
  from: string;
  to: string;
}

function AddRushHour({
  rushHour,
  setRushHour,
  addRushHour,
  isLoading,
}: {
  addRushHour: () => void;
  rushHour: RushHour;
  setRushHour: (value: React.SetStateAction<RushHour>) => void;
  isLoading: boolean;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Add Rush Hour
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Day
          </label>
          <select
            value={rushHour.weekDay}
            onChange={(e) =>
              setRushHour((prev) => ({
                ...prev,
                weekDay: parseInt(e.target.value),
              }))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500"
          >
            <option value={1}>Monday</option>
            <option value={2}>Tuesday</option>
            <option value={3}>Wednesday</option>
            <option value={4}>Thursday</option>
            <option value={5}>Friday</option>
            <option value={6}>Saturday</option>
            <option value={0}>Sunday</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            From
          </label>
          <input
            type="time"
            value={rushHour.from}
            onChange={(e) =>
              setRushHour((prev) => ({ ...prev, from: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            To
          </label>
          <input
            type="time"
            value={rushHour.to}
            onChange={(e) =>
              setRushHour((prev) => ({ ...prev, to: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
      <button
        onClick={addRushHour}
        disabled={isLoading}
        className="mt-4 cursor-pointer rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
      >
        {isLoading ? "Adding..." : "Add Rush Hour"}
      </button>
    </div>
  );
}

export default AddRushHour;
