import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapPopup.css";
import s from "./MapPopup.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Loader } from "../Loader/Loader";
import { AnimatePresence, motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useWindowSize } from "../../hooks/useWindowSize";

interface NovaPoshtaMapPopupProps {
  selectedCity: string;
  onClose: () => void;
  onSelect: (warehouseName: string) => void;
  tab: "PostOffice" | "ParcelLocker";
  setTab: (tab: "PostOffice" | "ParcelLocker") => void;
}

export const NovaPoshtaMapPopup: React.FC<NovaPoshtaMapPopupProps> = ({
  selectedCity,
  onClose,
  tab,
  onSelect,
  setTab,
}) => {
  const { cities } = useSelector((state: RootState) => state.cities);
  const [search, setSearch] = useState("");

  const { width } = useWindowSize();
  const isMobile = width < 1024;

  const [filteredWarehouses, setFilteredWarehouses] = useState<any[]>([]);

  const [isListVisible, setIsListVisible] = useState(isMobile ? false : true);

  const customIcon = new L.Icon({
    iconUrl: "/icons/nova-icon.png",
    iconSize: [50, 62],
  });

  const warehouses =
    cities.find((city) => city.name === selectedCity)?.warehouses || [];

  // ✅ замість цього користуйся tab з props:
  const filteredByTab = warehouses.filter((w) =>
    tab === "PostOffice"
      ? !w.name.toLowerCase().includes("поштомат")
      : w.name.toLowerCase().includes("поштомат")
  );

  useEffect(() => {
    setFilteredWarehouses(
      search
        ? filteredByTab.filter((w) =>
            w.name.toLowerCase().includes(search.toLowerCase())
          )
        : filteredByTab
    );
  }, [search, tab, warehouses]);

  const cityData = cities.find((city) => city.name === selectedCity);

  const userPosition = cityData
    ? {
        lat: parseFloat(cityData.warehouses[0].position.latitude),
        lng: parseFloat(cityData.warehouses[0].position.longitude),
      }
    : {
        lat: 50.4501, // fallback: Київ
        lng: 30.5234,
      };

  if (!userPosition) {
    return createPortal(
      <div className={s.overlay}>
        <Loader />
      </div>,
      document.body
    );
  }

  return createPortal(
    <AnimatePresence>
      <div id="mapPopup" className={s.overlay}>
        <motion.div className="relative">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={s.popup}
          >
            <div className={s.sidebar}>
              <div className={s.topBar}>
                <h2>Оберіть адресу доставки</h2>
              </div>

              <div className={s.tabs}>
                <div
                  className={`${s.tabItem} ${
                    tab === "PostOffice" ? s.active : ""
                  }`}
                  onClick={() => setTab("PostOffice")}
                >
                  На відділення
                </div>
                <div
                  className={`${s.tabItem} ${
                    tab === "ParcelLocker" ? s.active : ""
                  }`}
                  onClick={() => setTab("ParcelLocker")}
                >
                  Поштомат
                </div>
              </div>

              <div className={s.mapInputContainer}>
                <input
                  className={s.searchInput}
                  placeholder="Введіть назву вулиці"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setIsListVisible(true)}
                />
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.17076 11.2098C3.28709 11.2098 0.94946 8.9128 0.94946 6.07483C0.94946 3.23685 3.28709 0.935312 6.17076 0.935312C9.05442 0.935312 11.3925 3.23685 11.3925 6.07483C11.3925 8.9128 9.05442 11.2098 6.17076 11.2098ZM14.5274 13.8689L10.7411 10.1415C11.7322 9.0641 12.3415 7.64282 12.3415 6.07483C12.3415 2.71877 9.57889 0 6.17076 0C2.76263 0 0 2.71877 0 6.07483C0 9.4263 2.76263 12.1451 6.17076 12.1451C7.6433 12.1451 8.99391 11.6362 10.0548 10.788L13.8562 14.5291C14.0419 14.7125 14.3422 14.7125 14.5274 14.5291C14.7131 14.3503 14.7131 14.0523 14.5274 13.8689Z"
                    fill="black"
                  />
                </svg>
              </div>

              {isListVisible && (
                <div className={s.list}>
                  {filteredWarehouses.map((w, i) => (
                    <div
                      key={i}
                      className={s.listItem}
                      onClick={() => {
                        onSelect(w.name);
                        onClose();
                      }}
                    >
                      <svg
                        width="28"
                        height="29"
                        viewBox="0 0 28 29"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M16.1221 21.8931V16.9656H11.8853V21.8931H8.64675L12.5799 25.7824C13.3706 26.5644 14.6501 26.5644 15.4409 25.7824L19.374 21.8931H16.1205H16.1221ZM6.52619 19.7947V9.19429L2.59308 13.0836C1.80231 13.8656 1.80231 15.1307 2.59308 15.9127L6.52619 19.7947ZM11.8853 7.10467V12.0322H16.1221V7.10467H19.3606L15.426 3.21538C14.6353 2.43342 13.3558 2.43342 12.5651 3.21538L8.63195 7.10467H11.8853ZM25.4069 13.0851L21.4738 9.19576V19.7947L25.4069 15.9127C26.1977 15.1307 26.1977 13.8656 25.4069 13.0836" />
                      </svg>

                      <p>{w.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={s.mapWrapper}>
              <MapContainer
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                center={userPosition}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {filteredWarehouses.map((w, i) => (
                  <Marker
                    key={i}
                    position={[
                      parseFloat(w.position.latitude),
                      parseFloat(w.position.longitude),
                    ]}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    icon={customIcon as any} // тимчасово привели до any
                    eventHandlers={{
                      click: () => {
                        onSelect(w.name);
                        onClose();
                      },
                      mouseover: (e: any) => e.target.openPopup(),
                      mouseout: (e: any) => e.target.closePopup(),
                    }}
                  >
                    <Popup>{w.name}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </motion.div>

          <button onClick={onClose} className={s.closeBtn}>
            <svg
              viewBox="0 0 52 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M39 13L13 39M13 13L39 39"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
