// components/BarChart.js
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Papa from "papaparse";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const BarChart = () => {
  const [chartData, setChartData] = useState(null);

  // Define color ranges with labels
  const colorRanges = [
    { color: "#5C0909", label: "35 - 40" },
    { color: "#ED2B00", label: "30 - 35" },
    { color: "#F15735", label: "25 - 30" },
    { color: "#F5856C", label: "20 - 25" },
    { color: "#FBCDC3", label: "15 - 20" },
    { color: "#FDE6E0", label: "10 - 15" },
  ];

  const getColorForValue = (val) => {
    if (val >= 35) return "#5C0909";
    if (val >= 30) return "#ED2B00";
    if (val >= 25) return "#F15735";
    if (val >= 20) return "#F5856C";
    if (val >= 15) return "#FBCDC3";
    if (val >= 10) return "#FDE6E0";
    return "#FFFFFF";
  };

  useEffect(() => {
    Papa.parse("/data.csv", {
      download: true,
      header: true,
      complete: (result) => {
        const data = result.data.filter((row) => row.Product);
        const products = data.map((row) => row.Product);
        const totalSales = data.map((row) => +row.TotalSales);
        const totalValues = data.map((row) => +row.TotalValue);

        const backgroundColors = totalValues.map((val) =>
          getColorForValue(val)
        );

        setChartData({
          labels: products,
          datasets: [
            {
              label: "Total Sales",
              data: totalSales.map((sales, i) => ({
                x: products[i],
                y: sales,
                totalValue: totalValues[i],
              })),
              backgroundColor: backgroundColors,
              borderWidth: 1,
            },
          ],
        });
      },
    });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const dataPoint = context.raw;
            return [
              `Product: ${context.label}`,
              `Total Sales: ${dataPoint.y}`,
              `Total Value: ${dataPoint.totalValue}`,
            ];
          },
        },
      },
      legend: {
        display: false, // Hide default legend
      },
    },
    scales: {
      y: {
        title: { display: true, text: "Total Sales" },
      },
      x: {
        title: { display: true, text: "Product" },
      },
    },
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "95%",
        margin: "auto",
      }}
    >
      <div style={{ flex: 1 }}>
        {chartData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {/* Legend box */}
      <div
        style={{
          marginLeft: 20,
          minWidth: 130,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h4 style={{ marginBottom: 10 }}>Total Value Legend</h4>
        {colorRanges.map(({ color, label }) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", marginBottom: 6 }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: color,
                border: "1px solid #ccc",
                marginRight: 8,
              }}
            />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
