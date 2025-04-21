// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   useMapEvents,
// } from "react-leaflet";
// import { useSelector } from "react-redux";
// import { RootState } from "../../store/index";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { useEffect, useState } from "react";

// const customIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//   iconSize: [32, 32],
// });

// // Компонент, щоб відстежувати видимі відділення на мапі
// const VisibleWarehouses = ({ warehouses }: { warehouses: any[] }) => {
//   const [visibleWarehouses, setVisibleWarehouses] = useState<any[]>(warehouses);

//   useMapEvents({
//     moveend(e) {
//       const bounds = e.target.getBounds();
//       const filtered = warehouses.filter((w) => {
//         const lat = parseFloat(w.position.latitude);
//         const lng = parseFloat(w.position.longitude);
//         return bounds.contains([lat, lng]);
//       });
//       setVisibleWarehouses(filtered);
//     },
//     zoomend(e) {
//       const bounds = e.target.getBounds();
//       const filtered = warehouses.filter((w) => {
//         const lat = parseFloat(w.position.latitude);
//         const lng = parseFloat(w.position.longitude);
//         return bounds.contains([lat, lng]);
//       });
//       setVisibleWarehouses(filtered);
//     },
//   });

//   return (
//     <>
//       {visibleWarehouses.map((warehouse, index) => (
//         <Marker
//           key={index}
//           position={[
//             parseFloat(warehouse.position.latitude),
//             parseFloat(warehouse.position.longitude),
//           ]}
//           icon={customIcon}
//         >
//           <Popup>{warehouse.name}</Popup>
//         </Marker>
//       ))}
//     </>
//   );
// };

// export const NovaPoshtaMap = () => {
//   const { cities, loading } = useSelector((state: RootState) => state.cities);
//   const [userPosition, setUserPosition] = useState<[number, number] | null>(
//     null
//   );

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setUserPosition([position.coords.latitude, position.coords.longitude]);
//       },
//       (error) => {
//         console.error("Помилка отримання геолокації", error);
//       }
//     );
//   }, []);

//   if (loading) return <div>Завантаження мапи...</div>;
//   if (!userPosition) return <div>Отримую вашу геолокацію...</div>;

//   const warehouses = cities.flatMap((city) => city.warehouses).slice(0, 100);

//   return (
//     <MapContainer
//       center={userPosition}
//       zoom={13}
//       style={{ height: "100vh", width: "100%" }}
//     >
//       <TileLayer
//         attribution="&copy; OpenStreetMap contributors"
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       {/* Показуємо тільки видимі зараз відділення */}
//       <VisibleWarehouses warehouses={warehouses} />
//     </MapContainer>
//   );
// };
