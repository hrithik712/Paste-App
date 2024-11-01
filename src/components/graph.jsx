import React from 'react';
import { Bar } from 'react-chartjs-2';

const ActivityGraph = ({ activityData }) => {
  const chartData = {
    labels: ['Likes', 'Shares', 'Views'],
    datasets: [
      {
        label: 'User Activity',
        data: [activityData.likes, activityData.shares, activityData.views],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default ActivityGraph;
