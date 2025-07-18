import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { BiSolidNavigation } from "react-icons/bi";

type SupplyInfo = {
  id: string
  name: string
  location: string
  openHours: string
  waterLevel: string
  queueStatus: string
  plusCode: string // Stored as "lat,lng"
}

export default function SupplyList() {
  const [supplies, setSupplies] = useState<SupplyInfo[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "supplyPoints"))
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SupplyInfo[]
      setSupplies(list)
    }
    fetchData()
  }, [])

  return (
    <div className="grid gap-6 max-w-5xl mx-auto">
      {supplies.map(supply => {
        const [lat, lng] = supply.plusCode.split(',').map(p => p.trim())

        return (
          <div
            key={supply.id}
            className="p-5 rounded-2xl shadow-xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex flex-col md:flex-row gap-6"
          >
            {/* Left: Info */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{supply.name}</h2>
              <p className="text-sm text-white/80">{supply.location}</p>
              <p className="text-sm">{supply.openHours}</p>

              <p className="text-sm mt-1">
                Water Level:{" "}
                <span className={`font-bold ${supply.waterLevel === 'Low'
                  ? 'text-red-900'
                  : supply.waterLevel === 'Medium'
                    ? 'text-yellow-400'
                    : 'text-green-200'
                  }`}
                >
                  {supply.waterLevel}
                  <span className="ml-1">
                    {supply.waterLevel === 'Low' && '⚠️'}
                  </span>
                </span>
              </p>

              <p className="text-sm">
                Queue:{" "}
                <span className={`font-bold ${supply.queueStatus === 'Heavy'
                  ? 'text-red-900'
                  : supply.queueStatus === 'Moderate'
                    ? 'text-yellow-400'
                    : 'text-green-200'
                  }`}
                >
                  {supply.queueStatus}
                  <span className="ml-1">
                    {supply.queueStatus === 'Heavy' && '⚠️'}
                  </span>
                </span>
              </p>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${lat},${lng}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-4 text-white 
                bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 
                hover:bg-gradient-to-br focus:ring-4 focus:outline-none 
                focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg 
                shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 
                font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                <BiSolidNavigation /> Go To Location
              </a>
            </div>

            {/* Right: Map */}
            <div className="flex-1">
              <iframe
                width="100%"
                height="200"
                loading="lazy"
                className="rounded-lg border border-white/30"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${+lng - 0.005}%2C${+lat - 0.005}%2C${+lng + 0.005}%2C${+lat + 0.005}&layer=mapnik&marker=${lat}%2C${lng}`}
              />
              <a
                className="block text-xs text-cyan-300 mt-1 underline text-right"
                href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on OSM
              </a>
            </div>
          </div>
        )
      })}
    </div>
  )
}
