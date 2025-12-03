import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';

const Attendance = ({ showToast }) => {
  const { employees, attendanceData, addAttendance, updateAttendance, deleteAttendance } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    timeIn: '',
    timeOut: '',
    status: 'Present',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateHours = (timeIn, timeOut) => {
    if (!timeIn || !timeOut) return 0;
    const [inHour, inMin] = timeIn.split(':').map(Number);
    const [outHour, outMin] = timeOut.split(':').map(Number);
    const inMinutes = inHour * 60 + inMin;
    const outMinutes = outHour * 60 + outMin;
    let diff = outMinutes - inMinutes;
    if (diff < 0) diff += 24 * 60;
    return (diff / 60).toFixed(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const hours = calculateHours(formData.timeIn, formData.timeOut);
    const employee = employees.find(emp => emp.id === formData.employeeId);
    
    const attendanceRecord = {
      ...formData,
      employeeName: employee ? `${employee.firstName} ${employee.lastName}` : '',
      hoursWorked: hours
    };
    
    if (editingAttendance) {
      updateAttendance(editingAttendance.id, attendanceRecord);
      showToast('Attendance updated successfully', 'success');
    } else {
      addAttendance(attendanceRecord);
      showToast('Attendance recorded successfully', 'success');
    }
    
    handleCloseModal();
  };

  const handleEdit = (attendance) => {
    setEditingAttendance(attendance);
    setFormData(attendance);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      deleteAttendance(id);
      showToast('Attendance record deleted successfully', 'success');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAttendance(null);
    setFormData({
      employeeId: '',
      date: new Date().toISOString().split('T')[0],
      timeIn: '',
      timeOut: '',
      status: 'Present',
      notes: ''
    });
  };

  const filteredAttendance = attendanceData.filter(att => {
    const employee = employees.find(emp => emp.id === att.employeeId);
    const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : '';
    return employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           att.date.includes(searchTerm) ||
           att.status.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <div className="page-header">
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search attendance..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <i className="fas fa-plus"></i> Record Attendance
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Hours</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map(attendance => {
                const employee = employees.find(emp => emp.id === attendance.employeeId);
                const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
                
                return (
                  <tr key={attendance.id}>
                    <td>{employeeName}</td>
                    <td>{attendance.date}</td>
                    <td>{attendance.timeIn}</td>
                    <td>{attendance.timeOut}</td>
                    <td>{attendance.hoursWorked}h</td>
                    <td>
                      <span className={`badge badge-${
                        attendance.status === 'Present' ? 'success' :
                        attendance.status === 'Late' ? 'warning' :
                        attendance.status === 'Absent' ? 'danger' : 'secondary'
                      }`}>
                        {attendance.status}
                      </span>
                    </td>
                    <td>{attendance.notes || '-'}</td>
                    <td>
                      <button className="btn-icon" onClick={() => handleEdit(attendance)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn-icon" onClick={() => handleDelete(attendance.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAttendance ? 'Edit Attendance' : 'Record Attendance'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Employee *</label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Time In *</label>
              <input
                type="time"
                name="timeIn"
                value={formData.timeIn}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Time Out *</label>
              <input
                type="time"
                name="timeOut"
                value={formData.timeOut}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
              <option value="Half Day">Half Day</option>
            </select>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingAttendance ? 'Update' : 'Record'} Attendance
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Attendance;
