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

  const AddMarker = () => {
    useMapEvents({
      click(e) {
        setTempMarker((prev) => ({
          ...prev,
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        }));
        setModalIsOpen(true);
      },
    });
    return null;
  };

  const onCloseModal = () => {
    setModalState(ModalState.add);
    setModalIsOpen(false);
  };

  const handleSaveMarker = async () => {
    if (modalState == ModalState.edit) {
      try {
        await axiosInstance.put(`/vote/place/${tempMarker.id}`, tempMarker, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast("Update Success", {
          description: "This will help people",
        });
      } catch (e) {}
    } else {
      const respnose = await axiosInstance.post(
        "/vote/place",
        {
          ...tempMarker,
          latitude: tempMarker.lat,
          longitude: tempMarker.lng,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // setMarkers((prevMarkers: any) => [...prevMarkers, { ...tempMarker }]);
    }
    fetchVotePlaces();
    setModalIsOpen(false);
    setModalState(ModalState.add);
  };

  const handleEditMarker = async (data: any) => {
    setModalState(ModalState.edit);
    setTempMarker(data);
    setModalIsOpen(true);
  };

  const handleDeleteMarker = async (id: any) => {
    const isConfirmed = confirm("Are you sure you want to delete it?");
    if (isConfirmed) {
      try {
        const response = await axiosInstance.delete(`/vote/place/${id}`);
        toast("Delete success", {
          description: "That was a wrong place",
        });
      } catch (e) {}
      onCloseModal();
      fetchVotePlaces();
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value, files } = e.target;
    setTempMarker({
      ...tempMarker,
      [name]: files ? files[0] : value,
    });
  };

  return (
    <>
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
        <AddMarker />
      </MapContainer>
      <div className="z-20">
        <Dialog
          open={modalIsOpen}
          onOpenChange={setModalIsOpen}
        >
          <DialogContent>
            <form className="flex flex-col gap-4">
              <div>
                <label>Address: </label>
                <Input
                  type="text"
                  value={tempMarker.address}
                  name="address"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Description: </label>
                <Input
                  type="text"
                  value={tempMarker.description}
                  name="description"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Latitude: </label>
                <Input
                  type="text"
                  value={tempMarker.lat}
                  readOnly
                />
              </div>
              <div>
                <label>Longitude: </label>
                <Input
                  type="text"
                  value={tempMarker.lng}
                  readOnly
                />
              </div>
              <div>
                <label>Image: </label>
                <Input
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-between">
                <div className=" flex gap-2">
                  <Button
                    type="button"
                    onClick={handleSaveMarker}
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    onClick={onCloseModal}
                  >
                    Cancel
                  </Button>
                </div>
                <Button
                  type="button"
                  onClick={() => handleDeleteMarker(tempMarker.id)}
                  className="bg-white text-red-500 hover:bg-red-500 hover:text-white"
                >
                  Delete
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default MapComponent;
