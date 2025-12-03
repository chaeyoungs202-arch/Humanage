import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';

const Performance = ({ showToast }) => {
  const { employees, performanceData, addPerformance, updatePerformance, deletePerformance } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerformance, setEditingPerformance] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    employeeId: '',
    reviewDate: '',
    period: '',
    rating: '',
    strengths: '',
    improvements: '',
    goals: '',
    reviewerName: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const employee = employees.find(emp => emp.id === formData.employeeId);
    const performanceRecord = {
      ...formData,
      employeeName: employee ? `${employee.firstName} ${employee.lastName}` : ''
    };
    
    if (editingPerformance) {
      updatePerformance(editingPerformance.id, performanceRecord);
      showToast('Performance review updated successfully', 'success');
    } else {
      addPerformance(performanceRecord);
      showToast('Performance review added successfully', 'success');
    }
    
    handleCloseModal();
  };

  const handleEdit = (performance) => {
    setEditingPerformance(performance);
    setFormData(performance);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this performance review?')) {
      deletePerformance(id);
      showToast('Performance review deleted successfully', 'success');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPerformance(null);
    setFormData({
      employeeId: '',
      reviewDate: '',
      period: '',
      rating: '',
      strengths: '',
      improvements: '',
      goals: '',
      reviewerName: ''
    });
  };

  const getRatingColor = (rating) => {
    switch(rating) {
      case 'Excellent': return 'success';
      case 'Good': return 'success';
      case 'Satisfactory': return 'warning';
      case 'Needs Improvement': return 'danger';
      default: return 'secondary';
    }
  };

  const filteredPerformance = performanceData.filter(perf => {
    const employee = employees.find(emp => emp.id === perf.employeeId);
    const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : '';
    return employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           perf.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
           perf.rating.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <div className="page-header">
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search reviews..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <i className="fas fa-plus"></i> Add Review
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Review Date</th>
                <th>Period</th>
                <th>Rating</th>
                <th>Reviewer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPerformance.map(performance => {
                const employee = employees.find(emp => emp.id === performance.employeeId);
                const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
                
                return (
                  <tr key={performance.id}>
                    <td>{employeeName}</td>
                    <td>{performance.reviewDate}</td>
                    <td>{performance.period}</td>
                    <td>
                      <span className={`badge badge-${getRatingColor(performance.rating)}`}>
                        {performance.rating}
                      </span>
                    </td>
                    <td>{performance.reviewerName}</td>
                    <td>
                      <button className="btn-icon" onClick={() => handleEdit(performance)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn-icon" onClick={() => handleDelete(performance.id)}>
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
        title={editingPerformance ? 'Edit Performance Review' : 'Add Performance Review'}
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
          <div className="form-row">
            <div className="form-group">
              <label>Review Date *</label>
              <input
                type="date"
                name="reviewDate"
                value={formData.reviewDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Review Period *</label>
              <input
                type="text"
                name="period"
                placeholder="e.g., Q1 2024"
                value={formData.period}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Overall Rating *</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Rating</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Satisfactory">Satisfactory</option>
              <option value="Needs Improvement">Needs Improvement</option>
            </select>
          </div>
          <div className="form-group">
            <label>Strengths</label>
            <textarea
              name="strengths"
              value={formData.strengths}
              onChange={handleInputChange}
              rows="3"
              placeholder="List key strengths..."
            />
          </div>
          <div className="form-group">
            <label>Areas for Improvement</label>
            <textarea
              name="improvements"
              value={formData.improvements}
              onChange={handleInputChange}
              rows="3"
              placeholder="List areas that need improvement..."
            />
          </div>
          <div className="form-group">
            <label>Goals for Next Period</label>
            <textarea
              name="goals"
              value={formData.goals}
              onChange={handleInputChange}
              rows="3"
              placeholder="Set goals for the next review period..."
            />
          </div>
          <div className="form-group">
            <label>Reviewer Name *</label>
            <input
              type="text"
              name="reviewerName"
              value={formData.reviewerName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingPerformance ? 'Update' : 'Add'} Review
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Performance;
