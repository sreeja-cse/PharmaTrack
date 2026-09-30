import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API_URL from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import "./Sales.css";

function Sales() {

  const [sales, setSales] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  const [topMedicines, setTopMedicines] = useState([]);

  const [formData, setFormData] = useState({
    medicine: "",
    quantity: "",
    price: ""
  });

  const [summary, setSummary] = useState({
    totalSales: 0,
    totalQuantity: 0,
    totalRevenue: 0
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchSales = async () => {

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/sales`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.message || "Failed to get sales");
        setSales([]);

        return;

      }

      setSales(data);

    } catch (error) {

      console.log(error);
      alert("Something went wrong");

    } finally {

      setLoading(false);

    }

  };

  const fetchMedicines = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/medicine`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.message || "Failed to get medicines");

        return;

      }

      setMedicines(data);

    } catch (error) {

      console.log(error);

    }

  };

  const fetchSummary = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/sales/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      console.log("SUMMARY RESPONSE:", data);

      if (!response.ok) {

        alert(data.message || "Failed to get sales summary");

        return;

      }

      setSummary(
        data.summary || {
          totalSales: 0,
          totalQuantity: 0,
          totalRevenue: 0
        }
      );

    } catch (error) {

      console.log(error);

    }

  };

  const fetchTopMedicines = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/sales/top`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {

        return;

      }

      setTopMedicines(data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchSales();
    fetchMedicines();
    fetchSummary();
    fetchTopMedicines();

  }, []);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      let url;
      let method;

      if (editId) {

        url = `${API_URL}/sales/${editId}`;
        method = "PUT";

      } else {

        url = `${API_URL}/sales/sales`;
        method = "POST";

      }

      const body = {
        quantity: Number(formData.quantity),
        price: Number(formData.price)
      };

      if (!editId) {

        body.medicine = formData.medicine;

      }

      const response = await fetch(
        url,
        {
          method: method,

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify(body)

        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.message || "Operation failed");

        return;

      }

      if (editId) {

        alert("Sale updated successfully");

      } else {

        alert("Sale added successfully");

      }

      setFormData({
        medicine: "",
        quantity: "",
        price: ""
      });

      setEditId(null);
      setShowForm(false);

      fetchSales();
      fetchSummary();
      fetchMedicines();
      fetchTopMedicines();

    } catch (error) {

      console.log(error);
      alert("Something went wrong");

    }

  };

  const handleEdit = async (id) => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/sales/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.message || "Failed to get sale");

        return;

      }

      setFormData({
        medicine: data.medicine?._id || "",
        quantity: data.quantity || "",
        price: data.price || ""
      });

      setEditId(id);
      setShowForm(true);

    } catch (error) {

      console.log(error);

    }

  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this sale?"
    );

    if (!confirmDelete) {

      return;

    }

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/sales/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.message || "Failed to delete sale");

        return;

      }

      alert("Sale deleted successfully");

      fetchSales();
      fetchSummary();
      fetchMedicines();
      fetchTopMedicines();

    } catch (error) {

      console.log(error);

    }

  };

  const filterByDate = async () => {

    if (!startDate || !endDate) {

      alert("Please select start date and end date");

      return;

    }

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/sales/date`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            startdate: startDate,
            enddate: endDate
          })

        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.message || "No sales found");

        return;

      }

      setSales(data);

    } catch (error) {

      console.log(error);

    }

  };

  const handleCancel = () => {

    setShowForm(false);
    setEditId(null);

    setFormData({
      medicine: "",
      quantity: "",
      price: ""
    });

  };

  const filteredSales = sales.filter((sale) =>
    sale.medicine?.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const chartData = topMedicines
    .filter((item) => item.medicine)
    .slice(0, 5)
    .map((item) => ({
      name: item.medicine.name,
      quantity: Number(item.totalSold) || 0
    }));

  const pieColors = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
    "#9333ea"
  ];

  return (

    <div className="dashboard-layout">

      <aside className="sidebar">

        <div className="logo">

          <div className="logo-icon">
            ✚
          </div>

          <div>

            <h2>PharmaTrack</h2>

            <span>
              Pharmacy System
            </span>

          </div>

        </div>

        <nav className="sidebar-nav">

          <Link
            to="/dashboard"
            className="nav-item"
          >
            <span>⌂</span>
            Dashboard
          </Link>

          <Link
            to="/medicines"
            className="nav-item"
          >
            <span>▣</span>
            Medicines
          </Link>

          <Link
            to="/sales"
            className="nav-item active"
          >
            <span>◈</span>
            Sales
          </Link>

        </nav>

        <div className="sidebar-bottom">

          <Link
            to="/"
            className="nav-item logout"
          >
            <span>↪</span>
            Logout
          </Link>

        </div>

      </aside>

      <main className="main-content">

        <header className="topbar">

          <div>

            <h1>Sales</h1>

            <p>
              Manage pharmacy sales and transactions
            </p>

          </div>

          <button
            className="primary-button"
            onClick={() => {

              setEditId(null);

              setFormData({
                medicine: "",
                quantity: "",
                price: ""
              });

              setShowForm(true);

            }}
          >
            + Add Sale
          </button>

        </header>

        <div className="sales-summary-section">

          <h2>Sales Summary</h2>

          <div className="stats-grid">

            <div className="stat-card">

              <span>
                Total Sales
              </span>

              <h2>
                {summary.totalSales}
              </h2>

            </div>

            <div className="stat-card">

              <span>
                Quantity Sold
              </span>

              <h2>
                {summary.totalQuantity}
              </h2>

            </div>

            <div className="stat-card">

              <span>
                Total Revenue
              </span>

              <h2>
                ₹{summary.totalRevenue}
              </h2>

            </div>

          </div>

        </div>

        <div className="top-selling-section">

          <h2>Top Selling Medicines</h2>

          <div className="small-top-chart">

            {chartData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height={220}
              >

                <PieChart>

                  <Pie
                    data={chartData}
                    dataKey="quantity"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    outerRadius={70}
                    innerRadius={35}
                  >

                    {chartData.map((entry, index) => (

                      <Cell
                        key={index}
                        fill={
                          pieColors[
                            index % pieColors.length
                          ]
                        }
                      />

                    ))}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            ) : (

              <div className="small-empty-chart">
                No sales available
              </div>

            )}

          </div>

        </div>

        {showForm && (

          <div className="data-card sale-form-card">

            <h2>
              {editId
                ? "Update Sale"
                : "Add Sale"}
            </h2>

            <form onSubmit={handleSubmit}>

              {!editId && (

                <>
                  <label>
                    Medicine
                  </label>

                  <select
                    name="medicine"
                    value={formData.medicine}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select Medicine
                    </option>

                    {medicines.map((medicine) => (

                      <option
                        key={medicine._id}
                        value={medicine._id}
                      >
                        {medicine.name} - Stock: {medicine.quantity}
                      </option>

                    ))}

                  </select>

                </>

              )}

              {editId && (

                <div>

                  <label>
                    Medicine
                  </label>

                  <input
                    type="text"
                    value={
                      medicines.find(
                        (medicine) =>
                          medicine._id === formData.medicine
                      )?.name || "Medicine"
                    }
                    disabled
                  />

                </div>

              )}

              <label>
                Quantity
              </label>

              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required
              />

              <label>
                Price
              </label>

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                min="1"
                required
              />

              <button
                type="submit"
                className="primary-button"
              >
                {editId
                  ? "Update Sale"
                  : "Add Sale"}
              </button>

              <button
                type="button"
                className="filter-button"
                onClick={handleCancel}
              >
                Cancel
              </button>

            </form>

          </div>

        )}

        <div className="sales-search-section">

          <h2>Search Sales</h2>

          <input
            type="text"
            placeholder="Search by medicine name..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="medicine-toolbar">

          <label>
            From
          </label>

          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              setStartDate(e.target.value)
            }
          />

          <label>
            To
          </label>

          <input
            type="date"
            value={endDate}
            onChange={(e) =>
              setEndDate(e.target.value)
            }
          />

          <button
            className="filter-button"
            onClick={filterByDate}
          >
            Filter
          </button>

          <button
            className="filter-button"
            onClick={() => {

              setStartDate("");
              setEndDate("");

              fetchSales();

            }}
          >
            All Sales
          </button>

        </div>

        <div className="data-card sales-table-card">

          <table>

            <thead>

              <tr>

                <th>
                  Medicine
                </th>

                <th>
                  Quantity
                </th>

                <th>
                  Price
                </th>

                <th>
                  Total Amount
                </th>

                <th>
                  Sold By
                </th>

                <th>
                  Sale Date
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="7"
                    className="empty-table"
                  >
                    Loading sales...
                  </td>

                </tr>

              ) : filteredSales.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="empty-table"
                  >

                    <div>
                      💰
                    </div>

                    <h3>
                      No sales available
                    </h3>

                    <p>
                      Add your first sale to start
                      tracking transactions.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredSales.map((sale) => (

                  <tr key={sale._id}>

                    <td>
                      {sale.medicine?.name || "-"}
                    </td>

                    <td>
                      {sale.quantity}
                    </td>

                    <td>
                      ₹{sale.price}
                    </td>

                    <td>
                      ₹{sale.totalamount}
                    </td>

                    <td>
                      {sale.soldBy?.name || "-"}
                    </td>

                    <td>
                      {sale.saleDate
                        ? new Date(
                            sale.saleDate
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>

                      <button
                        className="filter-button"
                        onClick={() =>
                          handleEdit(sale._id)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="filter-button"
                        onClick={() =>
                          handleDelete(sale._id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </main>

    </div>

  );

}

export default Sales;
