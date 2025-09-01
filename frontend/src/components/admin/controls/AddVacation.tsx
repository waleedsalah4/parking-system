import React from "react";

interface Vacation {
  name: string;
  from: string;
  to: string;
}

function AddVacation({
  vacation,
  setVacation,
  addVacation,
  isLoading,
}: {
  addVacation: () => void;
  vacation: Vacation;
  setVacation: (value: React.SetStateAction<Vacation>) => void;
  isLoading: boolean;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Add Vacation Period
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={vacation.name}
            onChange={(e) =>
              setVacation((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="e.g., Summer Break"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            From Date
          </label>
          <input
            type="date"
            value={vacation.from}
            onChange={(e) =>
              setVacation((prev) => ({ ...prev, from: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            To Date
          </label>
          <input
            type="date"
            value={vacation.to}
            onChange={(e) =>
              setVacation((prev) => ({ ...prev, to: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
      <button
        onClick={addVacation}
        disabled={!vacation.name || !vacation.from || !vacation.to || isLoading}
        className="mt-4 cursor-pointer rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
      >
        {isLoading ? "Adding..." : "Add Vacation Period"}
      </button>
    </div>
  );
}

export default AddVacation;
