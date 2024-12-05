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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

        <h1 className="text-black font-semibold text-xl py-4 px-8">
          {" "}
          Upcoming Events
        </h1>
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
                <Card>
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
    </SidebarProvider>
  );
}
