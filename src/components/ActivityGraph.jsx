import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ActivityGraph = ({ paste, onClose }) => {
  const data = {
    labels: ["Likes", "Shares", "Views"],
    datasets: [
      {
        label: "Total Count",
        data: [paste.likes || 0, paste.shares || 0, paste.views || 0], 
        backgroundColor: [
          "#0080FF",
          "#FF8000",
          "#00FFFF",
        ],
        borderColor: [
          "black",
          "black",
          "black",
        ],
        borderWidth: 1.5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Graphical Analysis of Paste "${paste.title}"`,
      },
    },
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 shadow-lg relative w-11/12 sm:w-2/3 lg:w-1/2">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black hover:bg-gray-300 rounded-full p-1"
        >
          X
        </button>
        <h2 className="text-lg font-bold mb-4">{paste.title}</h2>
        <div className="h-64">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ActivityGraph;


