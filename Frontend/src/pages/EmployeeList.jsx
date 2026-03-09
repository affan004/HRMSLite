import React, { useState, useEffect } from 'react';
import { employeeService } from '../services/api';
import { Trash2, Search, AlertCircle, Users } from 'lucide-react';
import { ALL_DEPARTMENTS, DEPARTMENTS } from '../constants/departments';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(ALL_DEPARTMENTS);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await employeeService.getAll();
      setEmployees(res.data);
      setError(null);
    } catch {
      setError('Failed to load employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee? Their attendance records will also be removed.')) return;
    setDeleting(id);
    try {
      await employeeService.delete(id);
      setEmployees((prev) => prev.filter((emp) => emp.employee_id !== id));
    } catch {
      alert('Error deleting employee, please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = employees.filter((emp) =>
    (selectedDepartment === ALL_DEPARTMENTS || emp.department === selectedDepartment) &&
    (
      emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const hasActiveFilters = searchTerm.trim() !== '' || selectedDepartment !== ALL_DEPARTMENTS;

  const departmentCount = new Set(employees.map((emp) => emp.department)).size;
  const getInitials = (name) =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="page-stack">
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <section className="summary-strip">
        <div className="mini-stat">
          <span className="mini-stat-label">Employees</span>
          <strong>{employees.length}</strong>
          <p>Active records in the directory.</p>
        </div>

        <div className="mini-stat">
          <span className="mini-stat-label">Departments</span>
          <strong>{departmentCount}</strong>
          <p>Distinct teams represented in the roster.</p>
        </div>

        <div className="mini-stat">
          <span className="mini-stat-label">Showing</span>
          <strong>{filtered.length}</strong>
          <p>{searchTerm ? 'Results matching the active search.' : 'Records currently visible in the table.'}</p>
        </div>
      </section>

      <section className="table-container">
        <div className="table-toolbar">
          <div className="search-wrapper">
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-toolbar-actions">
            <div className="filter-field compact-filter">
              <label className="filter-label" htmlFor="employee-department-filter">Department</label>
              <select
                id="employee-department-filter"
                className="filter-select"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value={ALL_DEPARTMENTS}>{ALL_DEPARTMENTS}</option>
                {DEPARTMENTS.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>

            <div className="table-toolbar-meta">{filtered.length} shown</div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Users size={28} />
            </div>
            <h3>{hasActiveFilters ? 'No employees match the current filters' : 'No employees yet'}</h3>
            <p>{hasActiveFilters ? 'Try a different search term or department.' : 'Use the new employee action to create the first record.'}</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="name-cell">
                        <div className="avatar-pill">{getInitials(emp.full_name)}</div>
                        <div>
                          <div className="name-primary">{emp.full_name}</div>
                          <div className="name-secondary">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="mono-chip">{emp.employee_id}</span>
                    </td>
                    <td>
                      <span className="dept-chip">{emp.department}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-icon"
                        onClick={() => handleDelete(emp.employee_id)}
                        disabled={deleting === emp.employee_id}
                        title="Delete employee"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default EmployeeList;
