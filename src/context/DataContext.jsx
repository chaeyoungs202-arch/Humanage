import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // Initialize state from localStorage or with empty arrays
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('employees');
    return saved ? JSON.parse(saved) : [];
  });

  const [attendanceData, setAttendanceData] = useState(() => {
    const saved = localStorage.getItem('attendanceData');
    return saved ? JSON.parse(saved) : [];
  });

  const [payrollData, setPayrollData] = useState(() => {
    const saved = localStorage.getItem('payrollData');
    return saved ? JSON.parse(saved) : [];
  });

  const [performanceData, setPerformanceData] = useState(() => {
    const saved = localStorage.getItem('performanceData');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
  }, [attendanceData]);

  useEffect(() => {
    localStorage.setItem('payrollData', JSON.stringify(payrollData));
  }, [payrollData]);

  useEffect(() => {
    localStorage.setItem('performanceData', JSON.stringify(performanceData));
  }, [performanceData]);

  // Employee operations
  const addEmployee = (employee) => {
    const newEmployee = {
      ...employee,
      id: Date.now().toString()
    };
    setEmployees([...employees, newEmployee]);
    return newEmployee;
  };

  const updateEmployee = (id, updatedEmployee) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, ...updatedEmployee } : emp
    ));
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  // Attendance operations
  const addAttendance = (attendance) => {
    const newAttendance = {
      ...attendance,
      id: Date.now().toString()
    };
    setAttendanceData([...attendanceData, newAttendance]);
    return newAttendance;
  };

  const updateAttendance = (id, updatedAttendance) => {
    setAttendanceData(attendanceData.map(att => 
      att.id === id ? { ...att, ...updatedAttendance } : att
    ));
  };

  const deleteAttendance = (id) => {
    setAttendanceData(attendanceData.filter(att => att.id !== id));
  };

  // Payroll operations
  const addPayroll = (payroll) => {
    const newPayroll = {
      ...payroll,
      id: Date.now().toString()
    };
    setPayrollData([...payrollData, newPayroll]);
    return newPayroll;
  };

  const updatePayroll = (id, updatedPayroll) => {
    setPayrollData(payrollData.map(pay => 
      pay.id === id ? { ...pay, ...updatedPayroll } : pay
    ));
  };

  const deletePayroll = (id) => {
    setPayrollData(payrollData.filter(pay => pay.id !== id));
  };

  // Performance operations
  const addPerformance = (performance) => {
    const newPerformance = {
      ...performance,
      id: Date.now().toString()
    };
    setPerformanceData([...performanceData, newPerformance]);
    return newPerformance;
  };

  const updatePerformance = (id, updatedPerformance) => {
    setPerformanceData(performanceData.map(perf => 
      perf.id === id ? { ...perf, ...updatedPerformance } : perf
    ));
  };

  const deletePerformance = (id) => {
    setPerformanceData(performanceData.filter(perf => perf.id !== id));
  };

  const value = {
    employees,
    attendanceData,
    payrollData,
    performanceData,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addAttendance,
    updateAttendance,
    deleteAttendance,
    addPayroll,
    updatePayroll,
    deletePayroll,
    addPerformance,
    updatePerformance,
    deletePerformance
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
