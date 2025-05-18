import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { AlertTriangle } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SkillGapChart = ({ skillAverages, selectedCategory }) => {
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    if (!skillAverages || !selectedCategory) return;
    
    const categoryData = skillAverages[selectedCategory] || {};
    
    // Prepare data for the chart
    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);
    
    // Create a color array based on the values using our skill level colors
    const colors = data.map(value => {
      const roundedValue = Math.round(value);
      switch (roundedValue) {
        case 0: return 'rgba(229, 62, 62, 0.7)';   // Red for zero
        case 1: return 'rgba(245, 101, 101, 0.7)'; // Lighter red for 1
        case 2: return 'rgba(237, 137, 54, 0.7)';  // Orange for 2
        case 3: return 'rgba(104, 211, 145, 0.7)'; // Light green for 3
        case 4: return 'rgba(72, 187, 120, 0.7)';  // Brighter green for 4
        case 5: return 'rgba(47, 133, 90, 0.7)';   // Full green for 5
        default: return 'rgba(128, 128, 128, 0.7)'; // Gray for unknown
      }
    });
    
    setChartData({
      labels,
      datasets: [
        {
          label: 'Average Skill Level',
          data,
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('0.7', '1')),
          borderWidth: 1,
        },
      ],
    });
  }, [skillAverages, selectedCategory]);
  
  if (!chartData) {
    return <div className="text-center py-6 text-gray-400">Loading chart data...</div>;
  }
  
  // Check if we have any gaps (scores <= 1)
  const hasGaps = chartData.datasets[0].data.some(value => value <= 1);
  
  return (
    <div>
      {hasGaps && (
        <div className="mb-6 p-4 bg-danger-900 bg-opacity-20 border border-danger-800 rounded-md">
          <div className="flex items-center text-danger-400 mb-2">
            <AlertTriangle size={18} className="mr-2" />
            <h4 className="font-medieval">Knowledge Gaps Detected!</h4>
          </div>
          <p className="text-sm text-danger-300">
            The guild has critical knowledge gaps in some areas. Consider assigning quests to improve these skills.
          </p>
        </div>
      )}
      
      <div className="p-4 bg-dark-800 rounded-lg">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 5,
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              },
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.7)',
                  maxRotation: 45,
                  minRotation: 45,
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const value = context.parsed.y;
                    let label = `Average: ${value.toFixed(1)}`;
                    
                    if (value <= 1) {
                      label += ' - Critical Gap!';
                    } else if (value <= 2) {
                      label += ' - Needs Improvement';
                    }
                    
                    return label;
                  }
                }
              }
            },
          }}
          height={300}
        />
      </div>
    </div>
  );
};

export default SkillGapChart;