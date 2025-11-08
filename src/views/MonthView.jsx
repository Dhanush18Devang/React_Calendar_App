import React from "react";
import dayjs from "dayjs";

// Utility to format 24-hour to 12-hour time
const formatTime12 = (t) => {
  const [h, m] = t.split(":").map(Number);
  const isPM = h >= 12;
  const displayHour = h % 12 || 12;
  return `${displayHour}:${m.toString().padStart(2, "0")} ${isPM ? "PM" : "AM"}`;
};

const MonthView = ({ currentDate, events, onRightClick, onEventClick }) => {
  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");
  const startDay = startOfMonth.day();
  const daysInMonth = currentDate.daysInMonth();

  const days = [];

  // Fill previous month's padding days
  for (let i = startDay - 1; i >= 0; i--) {
    const day = startOfMonth.subtract(i + 1, "day");
    days.push({ date: day, current: false });
  }

  // Fill current month's days
  for (let i = 0; i < daysInMonth; i++) {
    const day = startOfMonth.add(i, "day");
    days.push({ date: day, current: true });
  }

  // Fill next month's padding days to complete 6x7 grid
  const totalCells = Math.ceil(days.length / 7) * 7;
  const extraDays = totalCells - days.length;
  for (let i = 1; i <= extraDays; i++) {
    const day = endOfMonth.add(i, "day");
    days.push({ date: day, current: false });
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-[#111] rounded-lg overflow-hidden border border-[#333] text-gray-100">
      {/* Header row for weekdays */}
      <div className="grid grid-cols-7 border-b border-[#333] bg-[#1a1a1a] text-orange-400 font-semibold uppercase text-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="py-3 text-center tracking-wide border-r border-[#333] last:border-r-0"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 flex-1 bg-[#0d0d0d]">
        {days.map(({ date, current }, i) => {
          const dayEvents = events
            .filter((e) => dayjs(e.date).isSame(date, "day"))
            .slice(0, 3); // show up to 3 events

          return (
            <div
              key={i}
              className={`relative p-2 border border-[#222] cursor-pointer transition-all duration-150 ${
                current
                  ? "bg-[#1a1a1a] hover:bg-[#222]"
                  : "bg-[#111] text-gray-600 hover:bg-[#1a1a1a]"
              }`}
              style={{ minHeight: "7rem" }}
              onClick={(e) => onRightClick(e, date, 9)} // default 9AM slot
            >
              {/* Date number */}
              <div
                className={`text-right text-sm pr-1 ${
                  dayjs().isSame(date, "day")
                    ? "font-bold text-orange-400"
                    : current
                    ? "text-gray-200"
                    : "text-gray-600"
                }`}
              >
                {date.date()}
              </div>

              {/* Events list */}
              <div className="mt-1 flex flex-col space-y-1">
                {dayEvents.map((e, j) => (
                  <div
                    key={j}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      onEventClick(e);
                    }}
                    className={`rounded-md text-black shadow-md truncate px-2 py-[3px] text-[0.75rem] font-medium`}
                    style={{
                      backgroundColor: e.color || "#f97316",
                    }}
                    title={`${e.title} (${formatTime12(e.startTime)} - ${formatTime12(e.endTime)})`}
                  >
                    <div className="truncate">{e.title}</div>
                    <div className="opacity-90 text-[0.65rem]">
                      {formatTime12(e.startTime)}
                    </div>
                  </div>
                ))}

                {/* “+ More” indicator */}
                {events.filter((e) => dayjs(e.date).isSame(date, "day")).length >
                  3 && (
                  <div className="text-[0.7rem] text-gray-400 mt-1">
                    + More events
                  </div>
                )}
              </div>

              {/* Today highlight ring */}
              {dayjs().isSame(date, "day") && (
                <div className="absolute inset-0 ring-2 ring-orange-500 rounded-md pointer-events-none"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
