import { Card } from '@/components/ui/card';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsChartsProps {
  workMinutes: number;
  breakMinutes: number;
  taskData: { title: string; minutes: number }[];
  hourlyProductivity: number[];
}

export default function AnalyticsCharts({
  workMinutes,
  breakMinutes,
  taskData,
  hourlyProductivity
}: AnalyticsChartsProps) {
  const doughnutData = {
    labels: ['Work', 'Break'],
    datasets: [{
      data: [workMinutes, breakMinutes],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(99, 102, 241, 0.8)',
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(99, 102, 241, 1)',
      ],
      borderWidth: 2,
    }]
  };

  const barData = {
    labels: taskData.map(t => t.title),
    datasets: [{
      label: 'Minutes',
      data: taskData.map(t => t.minutes),
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
    }]
  };

  const lineData = {
    labels: hourlyProductivity.map((_, i) => `${i + 9}:00`),
    datasets: [{
      label: 'Productivity %',
      data: hourlyProductivity,
      fill: true,
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
      tension: 0.4,
      pointBackgroundColor: 'rgba(59, 130, 246, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.9)',
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: 'rgba(255, 255, 255, 1)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      y: {
        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card
        className="p-6 bg-card/50 border-primary/30"
        style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)' }}
        data-testid="chart-work-vs-break"
      >
        <h3 className="text-xl font-semibold mb-4 text-primary">Work vs Break</h3>
        <div className="w-64 h-64 mx-auto">
          <Doughnut data={doughnutData} options={{ ...chartOptions, scales: undefined }} />
        </div>
      </Card>

      <Card
        className="p-6 bg-card/50 border-primary/30"
        style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)' }}
        data-testid="chart-task-hours"
      >
        <h3 className="text-xl font-semibold mb-4 text-primary">Task-wise Hours</h3>
        <div className="h-48">
          <Bar data={barData} options={{ ...chartOptions, maintainAspectRatio: false }} />
        </div>
      </Card>

      <Card
        className="p-6 bg-card/50 border-primary/30"
        style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)' }}
        data-testid="chart-productivity"
      >
        <h3 className="text-xl font-semibold mb-4 text-primary">Productivity Progress</h3>
        <div className="h-48">
          <Line data={lineData} options={{ ...chartOptions, maintainAspectRatio: false }} />
        </div>
      </Card>
    </div>
  );
}
