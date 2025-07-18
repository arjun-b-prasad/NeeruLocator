import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { db, auth, provider } from "../firebase";
import { FaGoogle } from "react-icons/fa";
import toast from "react-hot-toast";
import { FaLocationCrosshairs } from "react-icons/fa6";

const GEOCODE_API_KEY = import.meta.env.VITE_GEOCODE_API_KEY;

// SupplyInfo type
type SupplyInfo = {
  id: string;
  name: string;
  location: string;
  openHours: string;
  waterLevel: string;
  queueStatus: string;
  plusCode: string;
  updatedBy?: string;
  updatedAt?: string;
};

export default function AdminForm() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<Omit<SupplyInfo, "id">>({
    name: "",
    location: "",
    openHours: "",
    waterLevel: "Full",
    queueStatus: "Light",
    plusCode: "",
  });

  const [supplyList, setSupplyList] = useState<SupplyInfo[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch {
      toast.error("Sign-in failed");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const fetchData = async () => {
    const snapshot = await getDocs(collection(db, "supplyPoints"));
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as SupplyInfo[];
    setSupplyList(items);
  };

  const loadForEdit = (id: string) => {
    const item = supplyList.find((s) => s.id === id);
    if (item) {
      const { id: _, ...rest } = item;
      setForm(rest);
      setSelectedId(id);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userName = user?.displayName || "Unknown";
    const now = new Date();
    const formattedTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${now.getDate().toString().padStart(2, "0")}-${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${now.getFullYear()}`;

    const dataToSave = {
      ...form,
      updatedBy: userName,
      updatedAt: formattedTime,
    };

    try {
      if (selectedId) {
        await updateDoc(doc(db, "supplyPoints", selectedId), dataToSave);
        toast.success("Updated successfully");
      } else {
        await addDoc(collection(db, "supplyPoints"), dataToSave);
        toast.success("Added successfully");
      }
      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Error while saving");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await deleteDoc(doc(db, "supplyPoints", deleteId));
    toast.success("Deleted successfully");
    setDeleteId(null);
    fetchData();
  };

  const resetForm = () => {
    setForm({
      name: "",
      location: "",
      openHours: "",
      waterLevel: "Full",
      queueStatus: "Light",
      plusCode: "",
    });
    setSelectedId("");
  };

  const getDeviceLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const coords = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

        try {
          const response = await fetch(
            `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=${GEOCODE_API_KEY}`
          );
          const data = await response.json();

          setForm((prev) => ({
            ...prev,
            plusCode: coords, // or data.display_name if preferred
          }));
        } catch (err) {
          toast.error("Failed to fetch address");
        }
      },
      () => toast.error("Permission denied or location unavailable")
    );
  };

  if (!user) {
    return (
      <div className="text-center mt-20">
        <button
          onClick={signIn}
          className="relative inline-flex items-center gap-2 mt-4 text-white bg-purple-600 hover:bg-blue-700 transition duration-300 font-medium rounded-xl text-lg px-6 py-3 z-10 overflow-hidden"
        >
          <span className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-green-500 blur-md animate-pulse z-0"></span>
          <span className="relative z-10 flex items-center gap-2">
            Sign in with Google <FaGoogle className="text-2xl" />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-end items-center mb-4 gap-4 text-white">
        <span>Hello, {user.displayName?.split(" ")[0]}</span>
        <button
          onClick={logout}
          className="bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 shadow-lg shadow-rose-500/50 dark:shadow-lg dark:shadow-rose-800/80 px-4 py-1 rounded-xl text-white text-sm shadow"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/30 mb-6"
      >
        <h2 className="text-xl font-semibold text-white mb-4">
          {selectedId ? "Edit" : "Add"} Supply Point
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="input text-gray-900 placeholder-gray-400 rounded-full px-2"
            required
          />
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="input text-gray-900 placeholder-gray-400 rounded-full px-2"
            required
          />
          <input
            name="openHours"
            placeholder="Open Hours"
            value={form.openHours}
            onChange={handleChange}
            className="input text-gray-900 placeholder-gray-400 rounded-full px-2"
            required
          />
          <div className="relative w-full">
            <input
              name="plusCode"
              placeholder="Co-ordinates"
              value={form.plusCode}
              onChange={handleChange}
              className="input text-gray-900 placeholder-gray-400 rounded-full px-4 pr-10 w-full"
              required
            />
            <button
              type="button"
              onClick={getDeviceLocation}
              className="absolute inset-y-0 right-2 flex items-center px-1 text-blue-600 hover:text-blue-800"
              title="Use Current Location"
            >
              <FaLocationCrosshairs className="w-5 h-5" />
            </button>
          </div>
          <label htmlFor="waterLevel">Water Level</label>
          <select
            name="waterLevel"
            value={form.waterLevel}
            onChange={handleChange}
            className="input text-gray-900 placeholder-gray-400 rounded-md px-2"
          >
            <option value="Full">Full</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <label htmlFor="queueStatus">Queue</label>
          <select
            name="queueStatus"
            value={form.queueStatus}
            onChange={handleChange}
            className="input text-gray-900 placeholder-gray-400 rounded-md px-2"
          >
            <option value="Light">Light</option>
            <option value="Moderate">Moderate</option>
            <option value="Heavy">Heavy</option>
          </select>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-8 py-2.5 text-center me-2 mb-2"
          >
            {selectedId ? "Update" : "Add"}
          </button>
          {selectedId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-8 py-2.5 text-center me-2 mb-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow border border-white/30 text-white">
        <h3 className="text-lg font-semibold mb-2">Existing Entries</h3>
        <ul className="space-y-3">
          {supplyList.map((supply) => (
            <li
              key={supply.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 rounded-lg bg-white/10 border border-white/10"
            >
              <div>
                <p className="font-semibold">{supply.name}</p>
                <p className="text-xs text-white/80">{supply.location}</p>
                <p className="text-xs">{supply.openHours}</p>
                <p className="text-xs mt-1">
                  Water:{" "}
                  <span
                    className={`font-bold ${
                      supply.waterLevel === "Low"
                        ? "text-red-900"
                        : supply.waterLevel === "Medium"
                        ? "text-yellow-400"
                        : "text-green-500"
                    }`}
                  >
                    {supply.waterLevel}
                  </span>
                </p>
                <p className="text-xs">
                  Queue:{" "}
                  <span
                    className={`font-bold ${
                      supply.queueStatus === "Heavy"
                        ? "text-red-900"
                        : supply.queueStatus === "Moderate"
                        ? "text-yellow-400"
                        : "text-green-500"
                    }`}
                  >
                    {supply.queueStatus}
                  </span>
                </p>
                {supply.updatedBy && supply.updatedAt && (
                  <p className="text-xs text-white/70 mt-1">
                    Updated by{" "}
                    <span className="font-semibold">{supply.updatedBy}</span> at{" "}
                    {supply.updatedAt}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => loadForEdit(supply.id)}
                  className="text-sky-200 text-sm font-bold hover:underline hover:text-sky-900"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(supply.id)}
                  className="text-rose-400 text-sm font-bold hover:underline hover:text-rose-900"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this entry? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
