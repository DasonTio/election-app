import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import HeadbarComponent from "./headbarComponent";

const ContainerComponent = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="w-full h-full">
      <ResizablePanelGroup
        direction="vertical"
        className="rounded-lg w-full h-full !overflow-y-auto"
      >
        <ResizablePanel
          defaultSize={8}
          className="h-full overflow-auto"
        >
          <HeadbarComponent />
        </ResizablePanel>
        <ResizablePanel
          defaultSize={92}
          className="h-full overflow-auto"
        >
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
};

export default ContainerComponent;
