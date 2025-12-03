import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';

const Payroll = ({ showToast }) => {
  const { employees, payrollData, addPayroll, updatePayroll, deletePayroll } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    employeeId: '',
    period: '',
    basicSalary: '',
    allowances: '',
    deductions: '',
    netPay: '',
    status: 'Pending'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-calculate net pay
      if (name === 'basicSalary' || name === 'allowances' || name === 'deductions') {
        const basic = parseFloat(updated.basicSalary) || 0;
        const allow = parseFloat(updated.allowances) || 0;
        const deduct = parseFloat(updated.deductions) || 0;
        updated.netPay = (basic + allow - deduct).toFixed(2);
      }
      
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const employee = employees.find(emp => emp.id === formData.employeeId);
    const payrollRecord = {
      ...formData,
      employeeName: employee ? `${employee.firstName} ${employee.lastName}` : '',
      basicSalary: parseFloat(formData.basicSalary),
      allowances: parseFloat(formData.allowances),
      deductions: parseFloat(formData.deductions),
      netPay: parseFloat(formData.netPay)
    };
    
    if (editingPayroll) {
      updatePayroll(editingPayroll.id, payrollRecord);
      showToast('Payroll updated successfully', 'success');
    } else {
      addPayroll(payrollRecord);
      showToast('Payroll added successfully', 'success');
    }
    
    handleCloseModal();
  };

  const handleEdit = (payroll) => {
    setEditingPayroll(payroll);
    setFormData(payroll);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this payroll record?')) {
      deletePayroll(id);
      showToast('Payroll deleted successfully', 'success');
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const payroll = payrollData.find(p => p.id === id);
    if (payroll) {
      updatePayroll(id, { ...payroll, status: newStatus });
      showToast(`Payroll status updated to ${newStatus}`, 'success');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPayroll(null);
    setFormData({
      employeeId: '',
      period: '',
      basicSalary: '',
      allowances: '',
      deductions: '',
      netPay: '',
      status: 'Pending'
    });
  };

  const filteredPayroll = payrollData.filter(pay => {
    const employee = employees.find(emp => emp.id === pay.employeeId);
    const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : '';
    return employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           pay.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
           pay.status.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <div className="page-header">
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search payroll..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <i className="fas fa-plus"></i> Add Payroll
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Period</th>
                <th>Basic Salary</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Pay</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayroll.map(payroll => {
                const employee = employees.find(emp => emp.id === payroll.employeeId);
                const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
                
                return (
                  <tr key={payroll.id}>
                    <td>{employeeName}</td>
                    <td>{payroll.period}</td>
                    <td>₱{parseFloat(payroll.basicSalary).toLocaleString()}</td>
                    <td>₱{parseFloat(payroll.allowances).toLocaleString()}</td>
                    <td>₱{parseFloat(payroll.deductions).toLocaleString()}</td>
                    <td>₱{parseFloat(payroll.netPay).toLocaleString()}</td>
                    <td>
                      <select
                        className={`badge badge-${
                          payroll.status === 'Paid' ? 'success' :
                          payroll.status === 'Processing' ? 'warning' : 'secondary'
                        }`}
                        value={payroll.status}
                        onChange={(e) => handleStatusChange(payroll.id, e.target.value)}
                        style={{ border: 'none', cursor: 'pointer' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </td>
                    <td>
                      <button className="btn-icon" onClick={() => handleEdit(payroll)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn-icon" onClick={() => handleDelete(payroll.id)}>
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
        title={editingPayroll ? 'Edit Payroll' : 'Add Payroll'}
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
            <label>Pay Period *</label>
            <input
              type="text"
              name="period"
              placeholder="e.g., Jan 2024"
              value={formData.period}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Basic Salary *</label>
            <input
              type="number"
              name="basicSalary"
              value={formData.basicSalary}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Allowances</label>
            <input
              type="number"
              name="allowances"
              value={formData.allowances}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Deductions</label>
            <input
              type="number"
              name="deductions"
              value={formData.deductions}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Net Pay</label>
            <input
              type="number"
              name="netPay"
              value={formData.netPay}
              readOnly
              style={{ backgroundColor: '#f5f7fb' }}
            />
          </div>
          <div className="form-group">
            <label>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingPayroll ? 'Update' : 'Add'} Payroll
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Payroll;
