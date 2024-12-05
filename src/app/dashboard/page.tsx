"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

export default function Page() {
  const [events, setEvents] = useState<any[]>([]);
  const formattedDate = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    fetch("/api/getevents")
      .then((res) => res.json())
      .then((data) => setEvents(data.events))
      .catch(console.error);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{formattedDate}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-5">
            <h1 className="text-black">Events</h1>
            {events.map((event, index) => (
              <div key={index} className="p-4 bg-gray-200 rounded">
                <h2>{event.title}</h2>
                <p>{event.description}</p>
                <p>Start: {new Date(event.startTime).toLocaleString()}</p>
                <p>End: {new Date(event.endTime).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
