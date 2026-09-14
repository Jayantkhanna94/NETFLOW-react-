import React from "react";
import { FileText, Download, Database, TrendingUp, CalendarDays } from "../components/Icons";
import { Card, Header, Button } from "../components/UI";

export default function Reports() {
  const reports = [
    ["Monthly Network Health Report", "Network", "Sep 2026", "2.4 MB"],
    ["Device Availability Report", "Devices", "Sep 2026", "1.1 MB"],
    ["Incident Summary", "Incidents", "Aug 2026", "840 KB"],
    ["Resource Utilization", "Resources", "Aug 2026", "1.7 MB"],
  ];

  return (
    <>
      <Card>
        <Header
          title="Reports & Exports"
          subtitle="Generate operational reports for your project demo"
          action={
            <Button
              icon={<FileText size={15} />}
              onClick={() => alert("Report generated successfully.")}
            >
              Generate Report
            </Button>
          }
        />
        <div className="report-grid">
          {reports.map((r) => (
            <div className="report" key={r[0]}>
              <div className="report-icon">
                <FileText size={19} />
              </div>
              <div>
                <b>{r[0]}</b>
                <small>
                  {r[1]} • {r[2]} • {r[3]}
                </small>
              </div>
              <button
                className="icon-btn"
                onClick={() => alert(`Downloading ${r[0]}...`)}
                aria-label={`Download ${r[0]}`}
              >
                <Download size={15} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <div className="three-grid">
        <Card>
          <Database size={20} />
          <h3>Network Report</h3>
          <p>Devices, interfaces, bandwidth and availability.</p>
        </Card>
        <Card>
          <TrendingUp size={20} />
          <h3>Performance Report</h3>
          <p>Traffic trends and utilization metrics.</p>
        </Card>
        <Card>
          <CalendarDays size={20} />
          <h3>Booking Report</h3>
          <p>Resource booking and occupancy summary.</p>
        </Card>
      </div>
    </>
  );
}

export { Reports };
