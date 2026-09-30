import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API_URL from "../services/api";

function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/dashboard/summary`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          console.log(data);
          return;
        }

        setSummary(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="dashboard-layout">

      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">✚</div>

          <div>
            <h2>PharmaTrack</h2>
            <span>Pharmacy System</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <Link to="/dashboard" className="nav-item active">
            <span>⌂</span>
            Dashboard
          </Link>

          <Link to="/medicines" className="nav-item">
            <span>▣</span>
            Medicines
          </Link>

          <Link to="/sales" className="nav-item">
            <span>◈</span>
            Sales
          </Link>

        </nav>

        <div className="sidebar-bottom">

          <Link to="/" className="nav-item logout">
            <span>↪</span>
            Logout
          </Link>

        </div>

      </aside>

      <main className="main-content">

        <header className="topbar">

          <div>
            <h1>Dashboard</h1>
            <p>Welcome back to PharmaTrack</p>
          </div>

          <div className="profile">

            <div className="profile-icon">P</div>

            <div>
              <strong>Pharmacist</strong>
              <span>Pharmacy Staff</span>
            </div>

          </div>

        </header>

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon medicine-icon">
              ▣
            </div>

            <div>
              <span>Total Medicines</span>
              <h2>
                {summary?.totalMedicines || 0}
              </h2>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon stock-icon">
              ◉
            </div>

            <div>
              <span>Total Stock</span>
              <h2>
                {summary?.totalStock || 0}
              </h2>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon warning-icon">
              !
            </div>

            <div>
              <span>Low Stock</span>
              <h2>
                {summary?.lowStock?.length || 0}
              </h2>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon sales-icon">
              ₹
            </div>

            <div>
              <span>Total Revenue</span>
              <h2>
                ₹{summary?.totalRevenue || 0}
              </h2>
            </div>

          </div>

        </section>

        <section className="main-sections">

          <Link
            to="/medicines"
            className="main-section-card medicines-card"
          >

            <div className="section-card-icon">
              💊
            </div>

            <div className="section-card-content">

              <span className="section-label">
                INVENTORY
              </span>

              <h2>Medicines</h2>

              <p>
                Manage medicines, stock levels, expiry dates and batches.
              </p>

              <span className="open-section">
                Manage Medicines →
              </span>

            </div>

          </Link>

          <Link
            to="/sales"
            className="main-section-card sales-card"
          >

            <div className="section-card-icon">
              📊
            </div>

            <div className="section-card-content">

              <span className="section-label">
                TRANSACTIONS
              </span>

              <h2>Sales</h2>

              <p>
                Track sales, quantities, revenue and transaction history.
              </p>

              <span className="open-section">
                Manage Sales →
              </span>

            </div>

          </Link>

        </section>

        <section className="recent-section">

          <div className="section-heading">

            <div>
              <h2>Recent Activity</h2>

              <p>
                Your latest pharmacy activity will appear here.
              </p>
            </div>

          </div>

          <div className="empty-activity">

            <div>◌</div>

            <h3>No recent activity</h3>

            <p>
              Once you add medicines or record sales, your activity
              will appear here.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;

