export interface BasicResponse<T> {
    body: T;
    message: string;
    success: boolean;
}
export interface UserLogin {
    email: string;
    password: string;
}
export interface RideInfo {
  id: string;
  requesterID: string;
  coords: {
    lat: number;
    lng: number;
  };
  distance: number;
  price: number;
}
export interface Order {
  id: number;
  requesterID: string;
  driverID: string;
  price: number;
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  status: string;
}