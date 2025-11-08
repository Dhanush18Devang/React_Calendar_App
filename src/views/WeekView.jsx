import React from "react";
import dayjs from "dayjs";

const formatTime12 = (t) => {
  const [h, m] = t.split(":").map(Number);
  const isPM = h >= 12;
  const displayHour = h % 12 || 12;
  return `${displayHour}:${m.toString().padStart(2, "0")} ${isPM ? "PM" : "AM"}`;
};

const WeekView = ({ currentDate, events = [], onRightClick, onEventClick }) => {
  const days = Array.from({ length: 7 }, (_, i) =>
    currentDate.startOf("week").add(i, "day")
  );
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const today = dayjs();

  return (
    <div className="overflow-x-auto w-full bg-[#0d0d0d] text-gray-100 rounded-lg border border-[#333]">
      <div className="min-w-[768px]">
        {/* Header */}
        <div className="grid grid-cols-8 border-b border-[#333] bg-[#1a1a1a] sticky top-0 z-10">
          <div></div>
          {days.map((d, i) => (
            <div
              key={i}
              className={`text-center py-3 font-semibold text-sm md:text-base tracking-wide uppercase transition ${
                d.isSame(today, "day")
                  ? "text-orange-400 border-b-2 border-orange-500"
                  : "text-gray-300"
              }`}
            >
              {d.format("ddd, MMM D")}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-8 h-[calc(100vh-130px)] overflow-y-auto relative">
          {/* Time Column */}
          <div className="border-r border-[#333] pr-2 text-right text-xs md:text-sm text-gray-400 bg-[#111] sticky left-0 z-10">
            {hours.map((h, i) => (
              <div key={i} className="h-16 border-t border-[#222]">
                {`${h.toString().padStart(2, "0")}:00`}
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {days.map((d, di) => {
            const dayEvents = events.filter((e) =>
              dayjs(e.date).isSame(d, "day")
            );

            const timeBuckets = {};
            dayEvents.forEach((e) => {
              const key = `${e.startTime}-${e.endTime}`;
              if (!timeBuckets[key]) timeBuckets[key] = [];
              timeBuckets[key].push(e);
            });

            return (
              <div
                key={di}
                className={`border-l border-[#222] relative ${
                  d.isSame(today, "day") ? "bg-[#1a1a1a]" : "bg-[#0d0d0d]"
                }`}
              >
                {/* Hour Slots */}
                {hours.map((h, hi) => (
                  <div
                    key={hi}
                    className="h-16 border-t border-[#1f1f1f] hover:bg-[#1c1c1c] cursor-pointer transition"
                    onContextMenu={(e) => onRightClick(e, d, h)}
                    onClick={(e) => onRightClick(e, d, h)}
                  />
                ))}

                {/* Events */}
                {Object.entries(timeBuckets).map(([key, group], idx) => {
                  const [startTime, endTime] = key.split("-");
                  const [sh, sm] = startTime.split(":").map(Number);
                  const [eh, em] = endTime.split(":").map(Number);
                  const top = (sh + sm / 60) * 4;
                  const height = (eh + em / 60 - sh - sm / 60) * 4;

                  return group.map((ev, j) => {
                    const width = 100 / group.length;
                    const left = j * width;
                    return (
                      <div
                        key={`${ev.title}-${j}`}
                        onClick={() => onEventClick(ev)}
                        className="absolute p-1 rounded-md shadow-md cursor-pointer text-xs md:text-sm font-medium hover:shadow-lg transition"
                        style={{
                          top: `${top}rem`,
                          height: `${height}rem`,
                          width: `${width}%`,
                          left: `${left}%`,
                          backgroundColor: ev.color
                            ? `${ev.color}33`
                            : "rgba(249, 115, 22, 0.2)",
                          borderLeft: `4px solid ${ev.color || "#f97316"}`,
                          color: "#fff",
                        }}
                        title={`${ev.title} (${formatTime12(
                          ev.startTime
                        )} - ${formatTime12(ev.endTime)})`}
                      >
                        <div className="text-[0.7rem] text-orange-300 font-semibold">
                          {formatTime12(ev.startTime)}
                        </div>
                        <div className="truncate">{ev.title}</div>
                      </div>
                    );
                  });
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeekView;
