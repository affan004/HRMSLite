import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeService, attendanceService } from '../services/api';
import { Users, UserCheck, UserX, TrendingUp, ArrowRight, CalendarCheck2 } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, notMarked: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashData = async () => {
      try {
        const [empRes, attRes] = await Promise.all([
          employeeService.getAll(),
          attendanceService.get(),
        ]);

        const today = new Date().toISOString().split('T')[0];
        const todayAtt = attRes.data.filter((entry) => entry.date.split('T')[0] === today);
        const present = todayAtt.filter((entry) => entry.status === 'Present').length;
        const absent = todayAtt.filter((entry) => entry.status === 'Absent').length;
        const total = empRes.data.length;

        setStats({ total, present, absent, notMarked: total - present - absent });
        setError(null);
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('Failed to load dashboard data. Please refresh and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashData();
  }, []);

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="loading-spinner" />
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const attendanceRate = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;
  const recordedCount = stats.present + stats.absent;

  const summaryCards = [
    {
      icon: Users,
      label: 'Total Employees',
      value: stats.total,
      detail: 'Active records in the directory',
      tone: 'tone-blue',
    },
    {
      icon: UserCheck,
      label: 'Present Today',
      value: stats.present,
      detail: 'Employees marked present',
      tone: 'tone-green',
    },
    {
      icon: UserX,
      label: 'Absent Today',
      value: stats.absent,
      detail: 'Employees marked absent',
      tone: 'tone-red',
    },
    {
      icon: TrendingUp,
      label: 'Attendance Rate',
      value: `${attendanceRate}%`,
      detail: 'Share of roster marked present',
      tone: 'tone-amber',
    },
  ];

  return (
    <div className="page-stack">
      {error && <div className="alert alert-error">{error}</div>}

      <section className="hero-panel">
        <div className="hero-panel-copy">
          <span className="hero-kicker">Operations snapshot</span>
          <h2>Keep today&apos;s workforce pulse visible at a glance.</h2>
          <p>{today}. Use the dashboard to close attendance gaps and move directly into the next admin task.</p>

          <div className="hero-actions">
            <Link to="/employees" className="hero-link">
              Open Directory <ArrowRight size={16} />
            </Link>
            <Link to="/attendance" className="hero-link">
              Mark Attendance <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="hero-panel-card">
          <span className="hero-panel-label">Coverage today</span>
          <strong>{attendanceRate}%</strong>
          <div className="hero-progress">
            <span style={{ width: `${attendanceRate}%` }} />
          </div>
          <div className="hero-panel-meta">
            <div>
              <span>Recorded</span>
              <strong>{recordedCount}</strong>
            </div>
            <div>
              <span>Pending</span>
              <strong>{stats.notMarked}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        {summaryCards.map((card) => {
          const CardIcon = card.icon;

          return (
            <article key={card.label} className="stat-card">
              <div className={`stat-card-icon ${card.tone}`}>
                <CardIcon size={22} />
              </div>
              <div className="stat-card-copy">
                <div className="stat-value">{card.value}</div>
                <div className="stat-label">{card.label}</div>
                <p className="stat-detail">{card.detail}</p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="content-grid">
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Next actions</p>
              <h3>Move through the daily workflow.</h3>
            </div>
          </div>

          <div className="action-grid">
            <Link to="/employees" className="action-link-card">
              <div className="action-link-copy">
                <h4>Review employee directory</h4>
                <p>Search the roster, confirm department coverage, and remove outdated records.</p>
              </div>
              <ArrowRight size={18} />
            </Link>

            <Link to="/attendance" className="action-link-card">
              <div className="action-link-copy">
                <h4>Complete attendance register</h4>
                <p>
                  {stats.notMarked > 0
                    ? `${stats.notMarked} employee${stats.notMarked === 1 ? '' : 's'} still need a status for today.`
                    : 'Every employee already has a status recorded for today.'}
                </p>
              </div>
              <ArrowRight size={18} />
            </Link>
          </div>
        </article>

        <article className="surface-card">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Today&apos;s focus</p>
              <h3>Read the register quickly.</h3>
            </div>
          </div>

          <div className="insight-list">
            <div className="insight-item">
              <span className="insight-label">Pending attendance</span>
              <strong>{stats.notMarked}</strong>
              <p>Unmarked employees who still need a status for the selected workday.</p>
            </div>

            <div className="insight-item">
              <span className="insight-label">Present coverage</span>
              <strong>{stats.present}</strong>
              <p>Employees already checked in as present across today&apos;s register.</p>
            </div>

            <div className="insight-item">
              <span className="insight-label">Attendance view</span>
              <strong>
                <CalendarCheck2 size={18} />
              </strong>
              <p>Jump into the attendance screen to update remaining records without leaving the flow.</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};

export default Dashboard;
