import AnalyticsCharts from '../AnalyticsCharts';

export default function AnalyticsChartsExample() {
  const mockTaskData = [
    { title: 'Code Review', minutes: 45 },
    { title: 'Development', minutes: 120 },
    { title: 'Meeting', minutes: 30 },
    { title: 'Documentation', minutes: 60 }
  ];

  const mockProductivity = [20, 40, 60, 75, 85, 90, 88, 70];

  return (
    <div className="p-8 max-w-md">
      <AnalyticsCharts
        workMinutes={255}
        breakMinutes={45}
        taskData={mockTaskData}
        hourlyProductivity={mockProductivity}
      />
    </div>
  );
}
