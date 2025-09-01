import { Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGates } from "@/hooks/useGateQueries";
import { Spinner } from "@/components/shared/Spinner";

function Home() {
  const navigate = useNavigate();

  const gatesQuery = useGates();
  const gates = gatesQuery.data;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gatesQuery.isLoading && (
            <div className="col-span-full flex items-center justify-center">
              <Spinner size={32} className="text-blue-600" />
            </div>
          )}
          {gates?.map((gate) => (
            <div
              key={gate.id}
              onClick={() => navigate(`gate/${gate.id}`)}
              className="cursor-pointer rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 transition-all hover:shadow-md"
            >
              <div className="mb-3 flex items-center space-x-3">
                <Building className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {gate.name}
                </h3>
              </div>
              <p className="mb-2 text-sm text-gray-600">{gate.location}</p>
              <p className="text-xs text-blue-600">
                {gate.zoneIds.length} zones available
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Home;
