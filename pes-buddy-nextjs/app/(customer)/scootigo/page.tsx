"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useSocket } from "@/components/providers/SocketProvider";
import { formatCurrency } from "@/lib/utils";
import type { Scooter } from "@/types";

const LOCATIONS = [
  "GJBC Block", "SKM Block", "BE Block", "MRD Block", "F Block",
  "OAT (Open Air Theatre)", "Library", "Admin Block", "Hostel Area", "Main Gate",
];

const ROUTES: Record<string, number> = {
  "GJBC Block-OAT (Open Air Theatre)": 2,
  "OAT (Open Air Theatre)-GJBC Block": 2,
  "SKM Block-BE Block": 3,
  "BE Block-SKM Block": 3,
  "MRD Block-F Block": 2,
  "F Block-MRD Block": 2,
  "Main Gate-Admin Block": 1.5,
  "Library-Hostel Area": 2.5,
};

type Step = 1 | 2;

export default function ScootigoPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { socket } = useSocket();

  const [step, setStep] = useState<Step>(1);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [scooters, setScooters] = useState<Scooter[]>([]);
  const [filteredScooters, setFilteredScooters] = useState<Scooter[]>([]);
  const [selectedScooter, setSelectedScooter] = useState<Scooter | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchScooters = async () => {
    const res = await fetch("/api/scootigo/scooters");
    if (res.ok) setScooters(await res.json());
  };

  useEffect(() => {
    fetchScooters();
  }, []);

  // Real-time scooter availability
  useEffect(() => {
    if (!socket) return;

    const handleBooked = (data: { scooterId: string; available: boolean; bookedBy: string }) => {
      setScooters((prev) => prev.map((s) => s.scooterId === data.scooterId ? { ...s, available: data.available } : s));
      setFilteredScooters((prev) => prev.map((s) => s.scooterId === data.scooterId ? { ...s, available: data.available } : s));
      if (data.bookedBy !== session?.user?.name) {
        setMsg(`${data.scooterId} was just booked by ${data.bookedBy}`);
        setTimeout(() => setMsg(""), 5000);
      }
    };

    socket.on("scooter:booked", handleBooked);
    socket.on("scooter:availability", handleBooked);
    return () => {
      socket.off("scooter:booked", handleBooked);
      socket.off("scooter:availability", handleBooked);
    };
  }, [socket, session]);

  const getDistance = () => ROUTES[`${pickup}-${destination}`] ?? 2;
  const getEstTime = () => Math.round(getDistance() * 3);
  const calcFare = (s: Scooter) => Math.round(s.farePerKm * getDistance());

  const handleSearch = () => {
    if (!pickup || !destination) { toast.error("Select both pickup and destination"); return; }
    if (pickup === destination) { toast.error("Pickup and destination cannot be the same"); return; }

    const matching = scooters.filter(
      (s) => s.available && s.route && s.route.includes(pickup) && s.route.includes(destination)
    );
    setFilteredScooters(matching.length > 0 ? matching : scooters.filter((s) => s.available));
    setStep(2);
  };

  const handleBook = async () => {
    if (!selectedScooter) return;
    setLoading(true);
    try {
      const res = await fetch("/api/scootigo/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scooterId: selectedScooter.scooterId,
          pickup, destination,
          distance: getDistance(),
        }),
      });

      const data = await res.json();
      if (!res.ok) { toast.error(data.message ?? "Booking failed"); return; }

      toast.success(`🎉 Ride booked! Fare: ${formatCurrency(data.booking.totalFare)}`);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch {
      toast.error("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10">
        <h1 className="text-5xl font-bold text-white mb-3">🛵 Scootigo</h1>
        <p className="text-xl text-gray-300">Book scooters in real-time. Availability updates instantly!</p>
      </div>

      {msg && (
        <div className="mb-6 p-4 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
          {msg}
        </div>
      )}

      {/* Step 1: Route Selection */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <div className="glass rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-8">Where would you like to go?</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Pickup Location</label>
                  <select value={pickup} onChange={(e) => setPickup(e.target.value)} className="input-base">
                    <option value="">Select pickup point</option>
                    {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => { const t = pickup; setPickup(destination); setDestination(t); }}
                    className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-all"
                  >
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Destination</label>
                  <select value={destination} onChange={(e) => setDestination(e.target.value)} className="input-base">
                    <option value="">Select destination</option>
                    {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={!pickup || !destination}
                  className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  Search Available Rides
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Driver Selection */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {/* Trip summary */}
            <div className="glass rounded-2xl p-6 mb-6">
              <button onClick={() => setStep(1)} className="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2">
                ← Change Route
              </button>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full" />
                  <div className="w-0.5 h-8 bg-gray-600" />
                  <div className="w-4 h-4 bg-red-500 rounded-full" />
                </div>
                <div>
                  <p className="text-white font-semibold">{pickup}</p>
                  <p className="text-gray-400 text-sm">~{getEstTime()} min</p>
                  <p className="text-white font-semibold">{destination}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-gray-400 text-sm">Distance</p>
                  <p className="text-white font-bold">{getDistance()} km</p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-6">Available Drivers</h2>

            {filteredScooters.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">🛵</div>
                <h3 className="text-2xl font-bold text-white mb-2">No drivers available</h3>
                <p className="text-gray-400 mb-6">Try a different route or check back later</p>
                <button onClick={() => setStep(1)} className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all">
                  Select Different Route
                </button>
              </div>
            ) : (
              <div className="space-y-4 mb-40">
                {filteredScooters.map((scooter) => (
                  <motion.div
                    key={scooter.id}
                    whileHover={{ scale: scooter.available ? 1.01 : 1 }}
                    onClick={() => scooter.available && setSelectedScooter(selectedScooter?.id === scooter.id ? null : scooter)}
                    className={`glass rounded-2xl p-6 cursor-pointer transition-all border-2 ${
                      selectedScooter?.id === scooter.id
                        ? "border-blue-500 shadow-lg shadow-blue-500/20"
                        : "border-transparent hover:border-gray-700"
                    } ${!scooter.available ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-3xl">
                          🛵
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{scooter.driverName}</h3>
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-yellow-400">★★★★★</span>
                            <span className="text-gray-400 text-sm">4.8</span>
                          </div>
                          <p className="text-gray-400 text-sm">
                            {scooter.vehicleNumber} • {formatCurrency(scooter.farePerKm)}/km
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className={`w-2 h-2 rounded-full ${scooter.available ? "bg-green-500" : "bg-red-500"}`} />
                            <span className={`text-sm ${scooter.available ? "text-green-400" : "text-red-400"}`}>
                              {scooter.available ? "Available Now" : "Busy"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-white">{formatCurrency(calcFare(scooter))}</p>
                        <p className="text-gray-400 text-sm">Total Fare</p>
                        <p className="text-gray-400 text-xs mt-1">{getEstTime()} min</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Fixed bottom CTA */}
            <AnimatePresence>
              {selectedScooter && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  className="fixed bottom-6 left-0 right-0 px-4 max-w-4xl mx-auto"
                >
                  <div className="glass rounded-2xl p-5 shadow-2xl border border-blue-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-gray-400 text-sm">Driver: {selectedScooter.driverName}</p>
                        <p className="text-white font-bold">{getDistance()} km • {getEstTime()} min</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">Total</p>
                        <p className="text-3xl font-bold text-white">{formatCurrency(calcFare(selectedScooter))}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleBook}
                      disabled={loading}
                      className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold text-xl rounded-xl transition-all border-2 border-red-500 shadow-lg disabled:opacity-50"
                    >
                      {loading ? "Processing..." : "💳 Confirm Booking"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
