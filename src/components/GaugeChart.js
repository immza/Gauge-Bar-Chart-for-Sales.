import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import GaugeChart from "react-gauge-chart";

const GaugeStatusChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [currentSales, setCurrentSales] = useState(0);
  const [category, setCategory] = useState("Select a month to view the status");

  const ticks = [
    { label: "10.0k", angle: -100 },
    { label: "1.0m", angle: -80 },
    { label: "3.0m", angle: -45 },
    { label: "5.0m", angle: 0 },
    { label: "7.0m", angle: 45 },
    { label: "9.0m", angle: 80 },
    { label: "10.0m", angle: 100 },
  ];

  useEffect(() => {
    Papa.parse("/data2.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const parsed = results.data.map((row) => ({
          month: row.month.trim(),
          sales: parseInt(row.sales),
        }));
        setSalesData(parsed);
      },
    });
  }, []);

  const updateSales = (month, data = salesData) => {
    const found = data.find((item) => item.month === month);
    if (found) {
      const sales = found.sales;
      setCurrentSales(sales);
      if (sales <= 3000000) setCategory("Low");
      else if (sales < 7000000) setCategory("Medium");
      else setCategory("High");
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "m";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div
      style={{
        width: "600px",
        margin: "0 auto",
        textAlign: "center",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {/* Month Selector */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginRight: "20px",
          marginTop: "100px",
        }}
      >
        {monthNames.map((month, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedMonth(month);
              updateSales(month);
            }}
            style={{
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: "6px",
              backgroundColor: selectedMonth === month ? "#007BFF" : "#e0e0e0",
              color: selectedMonth === month ? "#fff" : "#333",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            {month}
          </div>
        ))}
      </div>

      {/* Main Chart Area */}
      <div style={{ position: "relative", flexGrow: 1 }}>
        <h1>Monthly Sales</h1>

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "300px",
            top: "50px",
          }}
        >
          {/* Gauge Always Visible */}
          <GaugeChart
            id="gauge-chart"
            nrOfLevels={30}
            arcsLength={[0.3, 0.4, 0.3]}
            colors={["#CC2647", "#FFA342", "#4287f5"]}
            percent={currentSales / 10000000}
            arcPadding={0.02}
            textColor="#000"
            needleColor="#555"
            formatTextValue={() => formatNumber(currentSales)}
          />

          {/* Custom Tick Labels */}
          {ticks.map((tick, index) => {
            const radius = 155;
            const angleInRad = (tick.angle - 90) * (Math.PI / 180);
            const x = radius * Math.cos(angleInRad) + 250 - 20;
            const y = radius * Math.sin(angleInRad) + 140 - 10;
            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: `${x}px`,
                  top: `${y}px`,
                  fontSize: "12px",
                  color: "#111111",
                }}
              >
                {tick.label}
              </div>
            );
          })}

          {/* Status Box */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "-100px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                backgroundColor: "#007BFF",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Status
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#555",
                fontWeight: "500",
                marginRight: "-150px",
              }}
            >
              {category}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaugeStatusChart;
