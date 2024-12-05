import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY;

if (!apiKey) {
  throw new Error("Missing Google API key");
}

declare global {
  interface Window {
    gapi: any;
  }
}

export const useGoogleCalendar = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [gapiInitialized, setGapiInitialized] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeGapi = async () => {
      if (!isLoaded || !isSignedIn) return;

      try {
        const response = await fetch("/api/google-calendar-token");
        if (!response.ok) throw new Error(`Failed to fetch token`);

        const { accessToken } = await response.json();

        const loadGapi = () => {
          const script = document.createElement("script");
          script.src = "https://apis.google.com/js/api.js";
          script.onload = () => {
            window.gapi.load("client", () => initClient(accessToken));
          };
          document.body.appendChild(script);
        };

        const initClient = (token: string) => {
          window.gapi.client
            .init({
              apiKey,
              discoveryDocs: [
                "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
              ],
            })
            .then(() => {
              window.gapi.client.setToken({ access_token: token });
              setGapiInitialized(true);
            });
        };

        loadGapi();
      } catch (error: any) {
        setError(`Error initializing Google Calendar: ${error.message}`);
      }
    };

    initializeGapi();
  }, [isSignedIn, isLoaded]);

  const listUpcomingEvents = async () => {
    if (!gapiInitialized) return;
    try {
      const queryOptions = {
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        timeMax: new Date(
          new Date().setDate(new Date().getDate() + 10)
        ).toISOString(),
        maxResults: 10,
        orderBy: "startTime",
        singleEvents: true,
      };

      const response = await window.gapi.client.calendar.events.list(
        queryOptions
      );
      setEvents(response.result.items);
    } catch (error) {
      setError("Failed to fetch events.");
    }
  };

  const addEventToCalendar = async (taskName: string, dueDate: Date) => {
    if (!gapiInitialized) {
      setError("Google Calendar is not initialized. Please try again.");
      return false;
    }
    try {
      const event = {
        summary: taskName,
        start: {
          dateTime: dueDate.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: new Date(dueDate.getTime() + 60 * 60 * 1000).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };
      const response = await window.gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });
      console.log("Event created: %s", response.htmlLink);
      return true;
    } catch (error) {
      console.error("Error creating calendar event:", error);
      setError("Failed to add event to calendar. Please try again.");
      return false;
    }
  };

  useEffect(() => {
    if (gapiInitialized) listUpcomingEvents();
  }, [gapiInitialized]);

  return { events, error, addEventToCalendar, gapiInitialized };
};
