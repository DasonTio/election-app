"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";
import ContainerComponent from "@/components/base/containerComponent";
import dynamic from "next/dynamic";

enum ModalState {
  edit = "edit",
  add = "add",
}

const MapComponent = () => {
  const [markers, setMarkers] = useState<any>([]);
  const [customIcon, setCustomIcon] = useState<L.Icon>();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalState, setModalState] = useState<ModalState>(ModalState.add);
  const [tempMarker, setTempMarker] = useState({
    id: null,
    lat: 0,
    lng: 0,
    imageUrl: "",
    description: "",
    address: "",
    image: null,
  });

  const fetchVotePlaces = async () => {
    const response = await axiosInstance.get("/vote/place");
    setMarkers(
      response.data.data.map((d: any) => ({
        ...d,
        lat: d.latitude,
        lng: d.longitude,
      }))
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCustomIcon(
        new L.Icon({
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        })
      );
    }

    fetchVotePlaces();
  }, []);

  const handleEditMarker = async (data: any) => {
    setModalState(ModalState.edit);
    setTempMarker(data);
    setModalIsOpen(true);
  };

  return (
    <ContainerComponent>
      <MapContainer
        center={[-6.3005, 106.6526]}
        zoom={13}
        style={{ height: "100vh", width: "100%", zIndex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map(
          (marker: {
            id: React.Key | null | undefined;
            lat: number;
            lng: number;
          }) => (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lng]}
              icon={customIcon}
              eventHandlers={{
                click: () => handleEditMarker(marker),
              }}
            />
          )
        )}
      </MapContainer>
      <div className="z-20">
        <Dialog
          open={modalIsOpen}
          onOpenChange={setModalIsOpen}
        >
          <DialogContent>
            <div>
              <img
                src={`${process.env.NEXT_PUBLIC_URL}/${tempMarker.imageUrl}`}
                alt=""
              />
            </div>
            <section className="flex flex-col gap-4">
              <div>
                <label>Address: </label>
                <p>{tempMarker.address}</p>
              </div>
              <div>
                <label>Description: </label>
                <p>{tempMarker.description}</p>
              </div>
            </section>
          </DialogContent>
        </Dialog>
      </div>
    </ContainerComponent>
  );
};

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });
