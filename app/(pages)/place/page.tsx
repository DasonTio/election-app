import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./client/client-component"), {
  ssr: false,
});

export default function PlacePage() {
  return <MapComponent />;
}
