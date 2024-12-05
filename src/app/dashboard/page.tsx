"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import { useDateStore } from "@/components/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Page() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {
    fetch("/api/getevents")
      .then((res) => res.json())
      .then((data) => setEvents(data.events))
      .catch(console.error);
  }, []);

  const date = useDateStore((state) => state.date);
  const today = new Date(date || new Date());
  today.setHours(0, 0, 0, 0);

  const formattedDate = today.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleCardClick = (event: any) => {
    console.log("Selected event:", event);
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Editing event:", selectedEvent);

    try {
      const response = await fetch("/api/editevent", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedEvent),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === updatedEvent.event.id ? updatedEvent.event : event
          )
        );
        setIsDialogOpen(false);
      } else {
        console.error("Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      router.refresh();
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent?.id) {
      console.error("No event selected for deletion");
      return;
    }

    try {
      const response = await fetch("/api/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedEvent.id }),
      });

      if (response.ok) {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== selectedEvent.id)
        );
        setIsDialogOpen(false);
      } else {
        console.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      router.refresh();
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
          <div className="flex items-center">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>{formattedDate}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center ml-auto">
            <ModeToggle />
          </div>
        </header>

        <h1 className="font-semibold text-xl py-4 px-8">Upcoming Events</h1>
        <div className="flex flex-row flex-wrap gap-4 p-4">
          {events
            .filter((event) => {
              const eventDate = new Date(event.startTime);
              eventDate.setHours(0, 0, 0, 0);
              return eventDate.getTime() === today.getTime();
            })
            .map((event, index) => (
              <div
                key={index}
                className="p-4 rounded flex items-center justify-center max-w-[300px]"
              >
                <Card
                  onClick={() => handleCardClick(event)}
                  className="transform transition duration-500 hover:scale-105"
                >
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Start:{" "}
                      {new Date(event.startTime).toLocaleString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <p>
                      End:{" "}
                      {new Date(event.endTime).toLocaleString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </CardFooter>
                </Card>
              </div>
            ))}
        </div>
      </SidebarInset>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
            <DialogDescription>Enter your Event details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditEvent} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={selectedEvent?.title || ""}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={selectedEvent?.description || ""}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    description: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Start Time
              </Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={
                  selectedEvent
                    ? new Date(selectedEvent.startTime)
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    startTime: new Date(e.target.value).toISOString(),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                End Time
              </Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={
                  selectedEvent
                    ? new Date(selectedEvent.endTime).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    endTime: new Date(e.target.value).toISOString(),
                  })
                }
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button onClick={handleDeleteEvent} variant="destructive">
                Delete Event
              </Button>
              <Button type="submit">Edit Event</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
