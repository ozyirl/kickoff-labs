"use client";
import * as React from "react";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendars } from "@/components/calendars";
import { DatePicker } from "@/components/date-picker";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useGoogleCalendar } from "@/app/google-calendar/addEvent";
import { Switch } from "./ui/switch";
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addToCalendarEnabled, setAddToCalendarEnabled] = useState(false);
  const {
    addEventToCalendar,
    gapiInitialized,
    error: calendarError,
  } = useGoogleCalendar();

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, startTime, endTime }),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      const data = await response.json();
      console.log("Event created:", data);

      setTitle("");
      setDescription("");
      setStartTime("");
      setEndTime("");
      setIsDialogOpen(false);
      const formattedStartTime = new Date(startTime).toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      if (addToCalendarEnabled) {
        const startDate = new Date(startTime);
        const eventAdded = await addEventToCalendar(title, startDate);
        if (!eventAdded) {
          console.error(
            "Failed to add event to calendar. Task was created but not added to calendar."
          );
        }
      }
      toast("Event has been created", {
        description: `Starts on ${formattedStartTime}`,
        action: {
          label: "Undo",
          //WIP: UNDO BUTTOn
          onClick: () => console.log("Undo"),
        },
      });
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const data = {
    details: {
      name: user?.firstName || "",
      email:
        typeof user?.primaryEmailAddress === "string"
          ? user.primaryEmailAddress
          : user?.primaryEmailAddress?.emailAddress || "",
      avatar: user?.imageUrl || "",
    },
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser user={data?.details} />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker />
        <SidebarSeparator className="mx-0" />
        <div className="flex items-center justify-center p-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Event Details</DialogTitle>
                <DialogDescription>Enter your Event details</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateEvent} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
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
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={addToCalendarEnabled}
                    onCheckedChange={setAddToCalendarEnabled}
                    id="add-to-calendar"
                    disabled={!gapiInitialized}
                  />
                  <Label htmlFor="airplane-mode">
                    {gapiInitialized
                      ? "Add Task to your google calendar"
                      : "Calendar not initialized"}
                  </Label>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Event</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>{/* WIP */}</SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
