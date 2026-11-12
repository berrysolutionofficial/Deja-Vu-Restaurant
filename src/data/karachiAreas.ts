export interface KarachiArea {
  id: string;
  name: string;
  zone: string;
  distanceKm: number;
  deliveryFee: number;
  estimatedMinutes: number;
  lat: number;
  lng: number;
}

// Restaurant Location Coordinates: Plot # B-54/13, Johar Hill Rd, Block 1, Gulistan-e-Johar, Karachi
export const RESTAURANT_LOCATION = {
  address: "Plot # B-54/13, Johar Hill Rd, Block 1, Gulistan-e-Johar, Karachi, Pakistan 75290",
  googleMapsUrl: "https://maps.app.goo.gl/ucxLdBaNWbbfDDpv8",
  lat: 24.9185,
  lng: 67.1325,
  phone: "0325-9111555",
  whatsapp: "923259111555"
};

// Fuel index calculation rule: Base delivery Rs 90 + ~Rs 18/km for motorcycle fuel & logistics in Karachi
export function calculateDeliveryFee(distanceKm: number): number {
  if (distanceKm <= 2) return 90;
  if (distanceKm <= 5) return 140;
  if (distanceKm <= 8) return 190;
  if (distanceKm <= 12) return 260;
  if (distanceKm <= 16) return 330;
  if (distanceKm <= 22) return 420;
  return Math.round(90 + (distanceKm * 18));
}

// Haversine formula to compute distance from user GPS to Johar Block 1
export function calculateDistanceKm(lat1: number, lon1: number, lat2 = RESTAURANT_LOCATION.lat, lon2 = RESTAURANT_LOCATION.lng): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

export const KARACHI_AREAS: KarachiArea[] = [
  { id: 'johar-b1', name: 'Gulistan-e-Johar - Block 1 (Restaurant Neighborhood)', zone: 'Johar', distanceKm: 0.8, deliveryFee: 90, estimatedMinutes: 20, lat: 24.9185, lng: 67.1325 },
  { id: 'johar-b2', name: 'Gulistan-e-Johar - Block 2', zone: 'Johar', distanceKm: 1.2, deliveryFee: 90, estimatedMinutes: 20, lat: 24.9195, lng: 67.1350 },
  { id: 'johar-b3', name: 'Gulistan-e-Johar - Block 3', zone: 'Johar', distanceKm: 1.5, deliveryFee: 90, estimatedMinutes: 25, lat: 24.9210, lng: 67.1380 },
  { id: 'johar-b4', name: 'Gulistan-e-Johar - Block 4', zone: 'Johar', distanceKm: 1.8, deliveryFee: 90, estimatedMinutes: 25, lat: 24.9220, lng: 67.1400 },
  { id: 'johar-b5', name: 'Gulistan-e-Johar - Block 5', zone: 'Johar', distanceKm: 2.1, deliveryFee: 110, estimatedMinutes: 25, lat: 24.9240, lng: 67.1420 },
  { id: 'johar-b6', name: 'Gulistan-e-Johar - Block 6', zone: 'Johar', distanceKm: 2.4, deliveryFee: 110, estimatedMinutes: 25, lat: 24.9250, lng: 67.1440 },
  { id: 'johar-b7', name: 'Gulistan-e-Johar - Block 7', zone: 'Johar', distanceKm: 2.5, deliveryFee: 110, estimatedMinutes: 25, lat: 24.9260, lng: 67.1460 },
  { id: 'johar-b8', name: 'Gulistan-e-Johar - Block 8', zone: 'Johar', distanceKm: 2.8, deliveryFee: 120, estimatedMinutes: 30, lat: 24.9270, lng: 67.1480 },
  { id: 'johar-b9', name: 'Gulistan-e-Johar - Block 9', zone: 'Johar', distanceKm: 3.0, deliveryFee: 120, estimatedMinutes: 30, lat: 24.9280, lng: 67.1500 },
  { id: 'johar-b10', name: 'Gulistan-e-Johar - Block 10', zone: 'Johar', distanceKm: 3.2, deliveryFee: 120, estimatedMinutes: 30, lat: 24.9290, lng: 67.1510 },
  { id: 'johar-b11', name: 'Gulistan-e-Johar - Block 11', zone: 'Johar', distanceKm: 3.4, deliveryFee: 120, estimatedMinutes: 30, lat: 24.9300, lng: 67.1530 },
  { id: 'johar-b12', name: 'Gulistan-e-Johar - Block 12', zone: 'Johar', distanceKm: 3.5, deliveryFee: 120, estimatedMinutes: 30, lat: 24.9310, lng: 67.1550 },
  { id: 'johar-b13', name: 'Gulistan-e-Johar - Block 13', zone: 'Johar', distanceKm: 3.6, deliveryFee: 130, estimatedMinutes: 35, lat: 24.9320, lng: 67.1570 },
  { id: 'johar-b14', name: 'Gulistan-e-Johar - Block 14', zone: 'Johar', distanceKm: 3.8, deliveryFee: 130, estimatedMinutes: 35, lat: 24.9330, lng: 67.1590 },
  { id: 'johar-b15', name: 'Gulistan-e-Johar - Block 15', zone: 'Johar', distanceKm: 4.0, deliveryFee: 140, estimatedMinutes: 35, lat: 24.9340, lng: 67.1610 },
  { id: 'johar-b16', name: 'Gulistan-e-Johar - Block 16', zone: 'Johar', distanceKm: 4.2, deliveryFee: 140, estimatedMinutes: 35, lat: 24.9350, lng: 67.1630 },
  { id: 'johar-b17', name: 'Gulistan-e-Johar - Block 17', zone: 'Johar', distanceKm: 4.4, deliveryFee: 140, estimatedMinutes: 35, lat: 24.9360, lng: 67.1650 },
  { id: 'johar-b18', name: 'Gulistan-e-Johar - Block 18', zone: 'Johar', distanceKm: 4.6, deliveryFee: 140, estimatedMinutes: 35, lat: 24.9370, lng: 67.1670 },
  { id: 'johar-b19', name: 'Gulistan-e-Johar - Block 19', zone: 'Johar', distanceKm: 4.8, deliveryFee: 140, estimatedMinutes: 35, lat: 24.9380, lng: 67.1690 },
  { id: 'johar-b20', name: 'Gulistan-e-Johar - Block 20', zone: 'Johar', distanceKm: 5.0, deliveryFee: 150, estimatedMinutes: 35, lat: 24.9390, lng: 67.1710 },
  { id: 'johar-chowrangi', name: 'Johar Chowrangi', zone: 'Johar', distanceKm: 1.6, deliveryFee: 90, estimatedMinutes: 20, lat: 24.9205, lng: 67.1370 },
  { id: 'johar-mor', name: 'Johar Mor / Millennium Mall', zone: 'Johar', distanceKm: 2.2, deliveryFee: 110, estimatedMinutes: 25, lat: 24.9080, lng: 67.1250 },
  { id: 'kamran-chowrangi', name: 'Kamran Chowrangi', zone: 'Johar', distanceKm: 2.5, deliveryFee: 110, estimatedMinutes: 25, lat: 24.9275, lng: 67.1435 },
  { id: 'safoora-goth', name: 'Safoora Chowrangi / Safoora Goth', zone: 'Scheme 33', distanceKm: 4.5, deliveryFee: 150, estimatedMinutes: 35, lat: 24.9450, lng: 67.1650 },
  { id: 'scheme-33', name: 'Scheme 33 (Metrovil, Kiran Hospital)', zone: 'Scheme 33', distanceKm: 5.5, deliveryFee: 160, estimatedMinutes: 40, lat: 24.9580, lng: 67.1500 },
  { id: 'gulshan-b1', name: 'Gulshan-e-Iqbal - Block 1 & 2', zone: 'Gulshan', distanceKm: 4.8, deliveryFee: 150, estimatedMinutes: 35, lat: 24.9120, lng: 67.0980 },
  { id: 'gulshan-b4-7', name: 'Gulshan-e-Iqbal - Block 4 to 7 (Disco Bakery)', zone: 'Gulshan', distanceKm: 5.5, deliveryFee: 170, estimatedMinutes: 35, lat: 24.9200, lng: 67.0930 },
  { id: 'gulshan-b10-13', name: 'Gulshan-e-Iqbal - Block 10 to 13 (NIPA Chowrangi)', zone: 'Gulshan', distanceKm: 4.2, deliveryFee: 140, estimatedMinutes: 30, lat: 24.9190, lng: 67.1080 },
  { id: 'gulshan-b13d', name: 'Gulshan-e-Iqbal - Block 13D (Hassan Square)', zone: 'Gulshan', distanceKm: 6.8, deliveryFee: 190, estimatedMinutes: 40, lat: 24.9040, lng: 67.0850 },
  { id: 'malir-cantt', name: 'Malir Cantt (Check Post 1 to 6)', zone: 'Malir', distanceKm: 6.2, deliveryFee: 190, estimatedMinutes: 40, lat: 24.9250, lng: 67.1950 },
  { id: 'malir-halt', name: 'Malir Halt / Model Colony', zone: 'Malir', distanceKm: 7.5, deliveryFee: 210, estimatedMinutes: 45, lat: 24.8960, lng: 67.1850 },
  { id: 'bahadurabad', name: 'Bahadurabad / Char Minar Chowrangi', zone: 'Central', distanceKm: 10.5, deliveryFee: 250, estimatedMinutes: 45, lat: 24.8820, lng: 67.0680 },
  { id: 'tariq-road', name: 'Tariq Road / PECHS Block 2 & 6', zone: 'Central', distanceKm: 11.2, deliveryFee: 260, estimatedMinutes: 45, lat: 24.8720, lng: 67.0620 },
  { id: 'fb-area', name: 'Federal B Area (Water Pump, Ayesha Manzil)', zone: 'Central', distanceKm: 9.0, deliveryFee: 240, estimatedMinutes: 40, lat: 24.9420, lng: 67.0780 },
  { id: 'north-nazimabad', name: 'North Nazimabad (Hyderi, Five Star)', zone: 'Central', distanceKm: 12.8, deliveryFee: 290, estimatedMinutes: 50, lat: 24.9450, lng: 67.0420 },
  { id: 'north-karachi', name: 'North Karachi / Buffer Zone', zone: 'North', distanceKm: 15.0, deliveryFee: 320, estimatedMinutes: 55, lat: 24.9750, lng: 67.0650 },
  { id: 'surjani-town', name: 'Surjani Town (4K Chowrangi)', zone: 'North', distanceKm: 20.5, deliveryFee: 420, estimatedMinutes: 65, lat: 25.0250, lng: 67.0580 },
  { id: 'shahrah-faisal', name: 'Shahrah-e-Faisal (FTC to Baloch Bridge)', zone: 'South', distanceKm: 10.0, deliveryFee: 250, estimatedMinutes: 45, lat: 24.8620, lng: 67.0850 },
  { id: 'clifton', name: 'Clifton (Blocks 1 to 9, Sea View, Teen Talwar)', zone: 'South', distanceKm: 18.0, deliveryFee: 380, estimatedMinutes: 60, lat: 24.8250, lng: 67.0320 },
  { id: 'dha-ph1-4', name: 'DHA Phase 1 to Phase 4', zone: 'South', distanceKm: 17.5, deliveryFee: 370, estimatedMinutes: 60, lat: 24.8450, lng: 67.0650 },
  { id: 'dha-ph5-8', name: 'DHA Phase 5 to Phase 8 (Khayaban-e-Shahbaz)', zone: 'South', distanceKm: 21.0, deliveryFee: 420, estimatedMinutes: 65, lat: 24.8050, lng: 67.0580 },
  { id: 'korangi', name: 'Korangi Crossing / Creek', zone: 'East', distanceKm: 14.5, deliveryFee: 310, estimatedMinutes: 50, lat: 24.8350, lng: 67.1250 },
  { id: 'saddar', name: 'Saddar / Saddar Dawakhana / Preedy St', zone: 'Central', distanceKm: 16.5, deliveryFee: 350, estimatedMinutes: 55, lat: 24.8600, lng: 67.0250 }
];
