import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { employeeService } from '../services/api';
import { ArrowLeft, Loader2, UserPlus, AlertCircle } from 'lucide-react';
import { DEPARTMENTS } from '../constants/departments';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ employee_id: '', full_name: '', email: '', department: 'Engineering' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address (e.g. name@company.com).';
    }
    if (!formData.employee_id.trim()) {
      return 'Employee ID is required.';
    }
    if (!formData.full_name.trim()) {
      return 'Full name is required.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await employeeService.add(formData);
      navigate('/employees');
    } catch (err) {
      const data = err.response?.data;
      let msg = 'Failed to add employee. Please try again.';

      if (data) {
        const fieldLabels = { employee_id: 'Employee ID', email: 'Email', full_name: 'Full Name' };
        for (const [field, messages] of Object.entries(data)) {
          const raw = Array.isArray(messages) ? messages[0] : messages;
          const label = fieldLabels[field] || field;

          if (typeof raw === 'string' && raw.toLowerCase().includes('unique')) {
            msg = `${label} already exists. Please use a different ${label.toLowerCase()}.`;
          } else {
            msg = typeof raw === 'string' ? raw : msg;
          }

          break;
        }
      }

      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-stack">
      <Link to="/employees" className="back-link">
        <ArrowLeft size={16} /> Back to employees
      </Link>

      <div className="form-layout">
        <section className="surface-card highlight-card">
          <span className="eyebrow-chip">New entry</span>
          <h2>Create a clean employee record.</h2>
          <p>
            Use a unique employee ID and company email. Once saved, the employee will be available in the directory and
            attendance register immediately.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-title">Stable identifier</span>
              <p>Keep the employee ID unique so attendance history stays attached to the right record.</p>
            </div>

            <div className="feature-item">
              <span className="feature-title">Company contact</span>
              <p>Use a valid work email so the roster remains reliable and easy to audit.</p>
            </div>

            <div className="feature-item">
              <span className="feature-title">Department mapping</span>
              <p>Assign the employee to the correct team so reporting stays organized from day one.</p>
            </div>
          </div>
        </section>

        <section className="form-card">
          <div className="section-heading form-section-heading">
            <div>
              <p className="section-kicker">Employee details</p>
              <h3>Primary information</h3>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-error">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <div className="field-grid">
              <div className="form-group">
                <label className="form-label">
                  Employee ID <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <input
                  name="employee_id"
                  className="form-input"
                  placeholder="e.g. EMP001"
                  required
                  value={formData.employee_id}
                  onChange={handleChange}
                />
                <p className="form-helper">Use the internal code that will identify this employee everywhere.</p>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Department <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <select
                  name="department"
                  className="form-input"
                  required
                  value={formData.department}
                  onChange={handleChange}
                >
                  {DEPARTMENTS.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
                <p className="form-helper">Choose the team the employee belongs to today.</p>
              </div>

              <div className="form-group field-span-2">
                <label className="form-label">
                  Full Name <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <input
                  name="full_name"
                  className="form-input"
                  placeholder="Enter full name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group field-span-2">
                <label className="form-label">
                  Email Address <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="name@company.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? <Loader2 size={16} style={{ animation: 'spin 0.75s linear infinite' }} /> : <UserPlus size={16} />}
                {submitting ? 'Saving...' : 'Save Employee'}
              </button>
              <Link to="/employees" className="btn btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AddEmployee;
