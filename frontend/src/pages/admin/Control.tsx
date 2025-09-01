import AddRushHour from "@/components/admin/controls/AddRushHour";
import AddVacation from "@/components/admin/controls/AddVacation";
import CategoryRateEditor from "@/components/admin/controls/CategoryRateEditor";
import ZoneControl from "@/components/admin/controls/ZoneControl";
import { Spinner } from "@/components/shared/Spinner";
import {
  useAddRushHour,
  useAddVacation,
  useAllZones,
  useCategories,
  useToggleZone,
  useUpdateCategory,
  useWebSocketAdminUpdate,
} from "@/hooks/useAdminQueries";
import { useState } from "react";

function Control() {
  const [rushHour, setRushHour] = useState({
    weekDay: 1,
    from: "07:00",
    to: "09:00",
  });
  const [vacation, setVacation] = useState({ name: "", from: "", to: "" });

  //Queries
  const categoriesQuery = useCategories();
  const zonesQuery = useAllZones();
  useWebSocketAdminUpdate();
  //mutation
  const updateCategoryMutation = useUpdateCategory();
  const toggleZoneMutation = useToggleZone();
  const addRushHourMutation = useAddRushHour();
  const addVacationMutation = useAddVacation();

  //data
  const categoriesData = categoriesQuery.data;
  const zonesData = zonesQuery.data;

  //handlers
  const updateCategoryRates = (
    id: string,
    rateNormal: number,
    rateSpecial: number
  ) => {
    updateCategoryMutation.mutate({ id, rateNormal, rateSpecial });
  };
  const toggleZone = (id: string, open: boolean) => {
    toggleZoneMutation.mutate({ id, open });
  };

  const addRushHour = () => {
    addRushHourMutation.mutate(rushHour);
    setRushHour({
      weekDay: 1,
      from: "",
      to: "",
    });
  };
  const addVacation = async () => {
    await addVacationMutation.mutate(vacation);
    setVacation({
      name: "",
      from: "",
      to: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Category Rates */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Category Rates
        </h3>
        {categoriesQuery.isLoading && (
          <div className="flex items-center justify-center">
            <Spinner size={32} className="text-blue-600" />
          </div>
        )}
        <div className="space-y-4">
          {categoriesData && categoriesData.length > 0 ? (
            categoriesData.map((category) => (
              <CategoryRateEditor
                key={category.id}
                category={category}
                onUpdate={updateCategoryRates}
                isLoading={updateCategoryMutation.isPending}
              />
            ))
          ) : (
            <div>there's no current categories to view</div>
          )}
        </div>
      </div>

      {zonesQuery.isLoading && (
        <div className="flex items-center justify-center">
          <Spinner size={32} className="text-blue-600" />
        </div>
      )}

      {zonesData && zonesData.length > 0 ? (
        <ZoneControl zonesData={zonesData} toggleZone={toggleZone} />
      ) : (
        <div>there's no current zones to view</div>
      )}

      {/* Rush Hours */}
      <AddRushHour
        rushHour={rushHour}
        setRushHour={setRushHour}
        addRushHour={addRushHour}
        isLoading={addRushHourMutation.isPending}
      />

      {/* Vacations */}
      <AddVacation
        vacation={vacation}
        setVacation={setVacation}
        addVacation={addVacation}
        isLoading={addVacationMutation.isPending}
      />
    </div>
  );
}

export default Control;
