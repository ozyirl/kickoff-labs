import { Calendar } from "@/components/ui/calendar";
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { create } from "zustand";

interface DateState {
  date: Date | undefined;
  changeDate: (newDate: Date | undefined) => void;
}

export const useDateStore = create<DateState>((set) => ({
  date: new Date(),
  changeDate: (newDate: Date | undefined) => set({ date: newDate }),
}));

export function DatePicker() {
  const { date, changeDate } = useDateStore();

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <Calendar mode="single" selected={date} onSelect={changeDate} />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
