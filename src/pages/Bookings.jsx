import React, { useState } from "react";
import { Plus, CalendarDays, Clock3, MapPin } from "../components/Icons";
import { saveData } from "../services/storage";
import { Card, Header, Button, Status } from "../components/UI";

export default function Bookings() {
  const seed = [
    {
      id: "BK-201",
      resource: "Computer Lab 1",
      user: "Aman Gupta",
      date: "2026-09-08",
      time: "10:00 AM – 12:00 PM",
      status: "Approved",
    },
    {
      id: "BK-202",
      resource: "Meeting Room 3",
      user: "Priya Singh",
      date: "2026-09-08",
      time: "02:00 PM – 03:00 PM",
      status: "Pending",
    },
    {
      id: "BK-203",
      resource: "Main Auditorium",
      user: "Student Council",
      date: "2026-09-10",
      time: "11:00 AM – 01:00 PM",
      status: "Approved",
    },
    {
      id: "BK-204",
      resource: "Computer Lab 2",
      user: "Faculty Team",
      date: "2026-09-11",
      time: "09:00 AM – 11:00 AM",
      status: "Cancelled",
    },
  ];

  const [rows, setRows] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("netflow_bookings")) || seed;
    } catch {
      return seed;
    }
  });

  function approve(id) {
    const n = rows.map((x) => (x.id === id ? { ...x, status: "Approved" } : x));
    setRows(n);
    saveData("bookings", n);
  }

  return (
    <Card>
      <Header
        title="Resource Bookings"
        subtitle={`${rows.length} booking requests`}
        action={
          <Button
            icon={<Plus size={15} />}
            onClick={() =>
              alert(
                "Connect this booking form to the Spring Boot REST API in the final backend."
              )
            }
          >
            New Booking
          </Button>
        }
      />
      <div className="booking-list">
        {rows.map((b) => (
          <div className="booking" key={b.id}>
            <div className="date">
              <CalendarDays size={17} />
              <b>{b.date}</b>
            </div>
            <div>
              <b>{b.resource}</b>
              <small>{b.user}</small>
            </div>
            <div className="booking-time">
              <span>
                <Clock3 size={13} />
                {b.time}
              </span>
              <span>
                <MapPin size={13} />
                Campus
              </span>
            </div>
            <Status value={b.status} />
            {b.status === "Pending" && (
              <Button variant="ghost" onClick={() => approve(b.id)}>
                Approve
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

export { Bookings };
