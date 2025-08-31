import { CheckCircle } from "lucide-react";
import type { Gate, Ticket, Zone } from "@/types";

type Props = {
  ticket: Ticket | null;
  gate: Gate | undefined;
  onClose: () => void;
  zone: Zone | undefined;
};

export default function TicketModal({ ticket, gate, zone, onClose }: Props) {
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="p-6">
          <div className="mb-6 text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Check-in Successful!
            </h2>
            <div className="h-1 w-full animate-pulse rounded-full bg-green-500" />
          </div>

          <div className="space-y-3 rounded-lg bg-gray-50 p-4">
            <div className="border-b border-gray-200 pb-3 text-center">
              <h3 className="text-lg font-bold text-gray-900">
                PARKING TICKET
              </h3>
              <p className="text-sm text-gray-600">
                Keep this ticket for checkout
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Ticket ID:</span>
                <span className="font-mono font-bold">{ticket?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gate:</span>
                <span className="font-medium">{gate?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Zone:</span>
                <span className="font-medium">{zone?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium capitalize">{ticket?.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in:</span>
                <span className="font-medium">
                  {ticket && new Date(ticket.checkinAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={() => window.print()}
              className="flex-1 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Print Ticket
            </button>
            <button
              onClick={onClose}
              className="flex-1 cursor-pointer rounded-lg bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
