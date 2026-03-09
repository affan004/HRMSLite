import React, { useState, useEffect } from 'react';
import { employeeService, attendanceService } from '../services/api';
import { CalendarCheck2, CheckCircle, XCircle, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ALL_DEPARTMENTS, DEPARTMENTS } from '../constants/departments';

const STATUS_FILTERS = ['All Statuses', 'Present', 'Absent', 'Unmarked'];

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState(ALL_DEPARTMENTS);
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(null);
  const [error, setError] = useState(null);

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const isToday = dateStr === format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [empRes, attRes] = await Promise.all([
          employeeService.getAll(),
          attendanceService.get(),
        ]);
        setEmployees(empRes.data);

        const map = {};
        attRes.data.forEach((record) => {
          if (record.date.split('T')[0] === dateStr) map[record.employee_id] = record.status;
        });
        setAttendance(map);
        setError(null);
      } catch (err) {
        console.error('Attendance fetch error:', err);
        setError('Failed to load attendance data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateStr]);

  const markStatus = async (employeeId, status) => {
    if (marking) return;
    setMarking(`${employeeId}-${status}`);
    try {
      await attendanceService.mark({ employee_id: employeeId, date: dateStr, status });
      setAttendance((prev) => ({ ...prev, [employeeId]: status }));
      setError(null);
    } catch {
      setError('Failed to mark attendance. Please try again.');
    } finally {
      setMarking(null);
    }
  };

  const handleCalendarChange = (event) => {
    if (!event.target.value) return;
    setSelectedDate(new Date(`${event.target.value}T00:00:00`));
  };

  const filteredEmployees = employees.filter((employee) => {
    const employeeStatus = attendance[employee.employee_id] || 'Unmarked';
    const matchesDepartment = selectedDepartment === ALL_DEPARTMENTS || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'All Statuses' || employeeStatus === selectedStatus;

    return matchesDepartment && matchesStatus;
  });

  const presentCount = filteredEmployees.filter((employee) => attendance[employee.employee_id] === 'Present').length;
  const absentCount = filteredEmployees.filter((employee) => attendance[employee.employee_id] === 'Absent').length;
  const markedCount = presentCount + absentCount;
  const pendingCount = Math.max(filteredEmployees.length - markedCount, 0);
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
      {error && <div className="alert alert-error">{error}</div>}

      <section className="summary-strip">
        <div className="mini-stat">
          <span className="mini-stat-label">Present</span>
          <strong>{presentCount}</strong>
          <p>Employees currently marked present.</p>
        </div>

        <div className="mini-stat">
          <span className="mini-stat-label">Absent</span>
          <strong>{absentCount}</strong>
          <p>Employees currently marked absent.</p>
        </div>

        <div className="mini-stat">
          <span className="mini-stat-label">Pending</span>
          <strong>{pendingCount}</strong>
          <p>Employees still waiting for a status.</p>
        </div>
      </section>

      <section className="attendance-toolbar">
        <div>
          <p className="section-kicker">Selected day</p>
          <h3 className="attendance-heading">{format(selectedDate, 'EEEE, MMMM d')}</h3>
        </div>

        <div className="date-nav-wrap">
          <span className="inline-label">Monthly calendar</span>
          <div className="date-picker-shell">
            <Calendar size={15} color="var(--primary)" />
            <input
              type="date"
              className="date-picker-input"
              value={dateStr}
              onChange={handleCalendarChange}
            />
          </div>

          <span className="inline-label">{isToday ? 'Today' : 'Browsing records'}</span>
          <div className="date-nav">
            <button type="button" className="date-nav-btn" onClick={() => setSelectedDate((date) => addDays(date, -1))}>
              <ChevronLeft size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={15} color="var(--primary)" />
              <span className="date-label">{isToday ? 'Today' : format(selectedDate, 'MMM d, yyyy')}</span>
            </div>
            <button type="button" className="date-nav-btn" onClick={() => setSelectedDate((date) => addDays(date, 1))}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="table-container">
        <div className="table-header table-header-split">
          <div>
            <h3>Attendance Register</h3>
            <p className="table-subtitle">
              {isToday
                ? 'Mark and review live attendance for the current workday.'
                : `Viewing saved records for ${format(selectedDate, 'MMMM d, yyyy')}.`}
            </p>
          </div>

          <div className="table-toolbar-meta">{markedCount}/{filteredEmployees.length} marked</div>
        </div>

        {employees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <CalendarCheck2 size={28} />
            </div>
            <h3>No employees found</h3>
            <p>Add employees first to mark attendance.</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <CalendarCheck2 size={28} />
            </div>
            <h3>No employees match the selected filters</h3>
            <p>Try a different department, status, or date combination.</p>
          </div>
        ) : (
          <>
            <div className="filter-toolbar">
              <div className="filter-field">
                <label className="filter-label" htmlFor="attendance-department-filter">Department</label>
                <select
                  id="attendance-department-filter"
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

              <div className="filter-field">
                <label className="filter-label" htmlFor="attendance-status-filter">Employee status</label>
                <select
                  id="attendance-status-filter"
                  className="filter-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {STATUS_FILTERS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Employee ID</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Mark</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => {
                    const status = attendance[emp.employee_id];
                    const isMarking = marking !== null;

                    return (
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
                        <td>
                          {status === 'Present' && (
                            <span className="badge badge-present">
                              <CheckCircle size={11} /> Present
                            </span>
                          )}
                          {status === 'Absent' && (
                            <span className="badge badge-absent">
                              <XCircle size={11} /> Absent
                            </span>
                          )}
                          {!status && <span className="badge badge-not-marked">Not marked</span>}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="mark-actions">
                            <button
                              type="button"
                              className={`att-btn ${status === 'Present' ? 'present-filled' : 'present-outline'}`}
                              onClick={() => markStatus(emp.employee_id, 'Present')}
                              disabled={isMarking}
                            >
                              <CheckCircle size={13} /> Present
                            </button>
                            <button
                              type="button"
                              className={`att-btn ${status === 'Absent' ? 'absent-filled' : 'absent-outline'}`}
                              onClick={() => markStatus(emp.employee_id, 'Absent')}
                              disabled={isMarking}
                            >
                              <XCircle size={13} /> Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Attendance;
