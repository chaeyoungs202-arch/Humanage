import React from 'react';
import { useData } from '../context/DataContext';
import DashboardCard from '../components/DashboardCard';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const { employees, attendanceData, payrollData, performanceData } = useData();

  // Calculate statistics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
  
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceData.filter(att => att.date === today);
  const presentToday = todayAttendance.filter(att => att.status === 'Present').length;
  
  const totalPayroll = payrollData
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + parseFloat(p.netPay || 0), 0);

  // Department distribution chart data
  const deptCount = {};
  employees.forEach(emp => {
    deptCount[emp.department] = (deptCount[emp.department] || 0) + 1;
  });

  const departmentChartData = {
    labels: Object.keys(deptCount).length > 0 ? Object.keys(deptCount) : ['No Data'],
    datasets: [{
      data: Object.keys(deptCount).length > 0 ? Object.values(deptCount) : [1],
      backgroundColor: [
        '#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0',
        '#560bad', '#b5179e', '#480ca8', '#3f37c9', '#4895ef'
      ],
      borderWidth: 0
    }]
  };

  // Payroll chart data
  const months = [];
  const monthlyTotals = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    months.push(monthYear);
    
    const monthlyTotal = payrollData
      .filter(p => p.period === monthYear && p.status === 'Paid')
      .reduce((sum, p) => sum + parseFloat(p.netPay || 0), 0);
    monthlyTotals.push(monthlyTotal);
  }

  const payrollChartData = {
    labels: months,
    datasets: [{
      label: 'Monthly Payroll (₱)',
      data: monthlyTotals,
      backgroundColor: '#4361ee',
      borderColor: '#3a0ca3',
      borderWidth: 0
    }]
  };

  const payrollOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₱' + (value / 1000).toFixed(0) + 'K';
          }
        }
      }
    }
  };

  return (
    <div>
      <div className="dashboard-grid">
        <DashboardCard
          title="Total Employees"
          value={totalEmployees}
          icon="fa-users"
          iconColor="primary"
          subtitle={`${activeEmployees} active`}
        />
        <DashboardCard
          title="Present Today"
          value={presentToday}
          icon="fa-user-check"
          iconColor="success"
          subtitle={`Out of ${totalEmployees}`}
        />
        <DashboardCard
          title="Total Payroll"
          value={`₱${totalPayroll.toLocaleString()}`}
          icon="fa-money-bill-wave"
          iconColor="warning"
          subtitle="This month"
        />
        <DashboardCard
          title="Performance Reviews"
          value={performanceData.length}
          icon="fa-star"
          iconColor="info"
          subtitle="Total evaluations"
        />
      </div>

      <div className="charts-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="card">
          <h3 className="card-title">Department Distribution</h3>
          <div style={{ height: '300px', padding: '1rem' }}>
            <Doughnut data={departmentChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="card">
          <h3 className="card-title">Payroll Overview</h3>
          <div style={{ height: '300px', padding: '1rem' }}>
            <Bar data={payrollChartData} options={payrollOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
