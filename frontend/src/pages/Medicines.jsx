import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API_URL from "../services/api";

function Medicines() {

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const [medicineId, setMedicineId] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    batchNumber: "",
    manufacturer: "",
    quantity: "",
    manufacturingDate: "",
    expiryDate: ""
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");

  // GET ALL MEDICINES
  const fetchMedicines = async () => {

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/medicine`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to get medicines");
        return;
      }

      setMedicines(data);

    } catch (error) {

      console.log(error);
      alert("Something went wrong");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchMedicines();

  }, []);

  // GET MEDICINE BY ID
  const getMedicineById = async () => {

    if (!medicineId.trim()) {

      alert("Enter medicine ID");
      return;

    }

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/medicine/${medicineId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.message || "Medicine not found");
        return;

      }

      // SHOW ONLY THE MEDICINE FOUND BY ID
      setMedicines([data]);

    } catch (error) {

      console.log(error);
      alert("Something went wrong");

    }

  };

  // CLEAR ID SEARCH
  const clearIdSearch = () => {

    setMedicineId("");
    fetchMedicines();

  };

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };

  // ADD / UPDATE MEDICINE
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      let url;
      let method;

      if (editId) {

        url = `${API_URL}/medicine/${editId}`;
        method = "PUT";

      } else {

        url = `${API_URL}/medicine/medicine`;
        method = "POST";

      }

      const response = await fetch(url, {

        method: method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity)
        })

      });

      const data = await response.json();

      if (!response.ok) {

        alert(data.message || "Operation failed");
        return;

      }

      if (editId) {

        alert("Medicine updated successfully");

      } else {

        alert("Medicine added successfully");

      }

      setFormData({
        name: "",
        batchNumber: "",
        manufacturer: "",
        quantity: "",
        manufacturingDate: "",
        expiryDate: ""
      });

      setEditId(null);
      setShowForm(false);

      fetchMedicines();

    } catch (error) {

      console.log(error);
      alert("Something went wrong");

    }

  };

  // GET MEDICINE BY ID FOR EDIT
  const handleEdit = async (id) => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/medicine/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.message || "Failed to get medicine");

        return;

      }

      setFormData({
        name: data.name || "",
        batchNumber: data.batchNumber || "",
        manufacturer: data.manufacturer || "",
        quantity: data.quantity || "",
        manufacturingDate: data.manufacturingDate
          ? data.manufacturingDate.substring(0, 10)
          : "",
        expiryDate: data.expiryDate
          ? data.expiryDate.substring(0, 10)
          : ""
      });

      setEditId(id);
      setShowForm(true);

    } catch (error) {

      console.log(error);

    }

  };

  // DELETE MEDICINE
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this medicine?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/medicine/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.message || "Failed to delete medicine");

        return;

      }

      alert("Medicine deleted successfully");

      fetchMedicines();

    } catch (error) {

      console.log(error);

    }

  };

  // EXPIRED MEDICINES
  const getExpiredMedicines = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/medicine/expired`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.message || "Failed to get expired medicines");

        return;

      }

      setMedicines(data);

    } catch (error) {

      console.log(error);

    }

  };

  // LOW STOCK MEDICINES
  const getLowStockMedicines = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/medicine/quantity`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.message || "Failed to get low stock medicines");

        return;

      }

      setMedicines(data);

    } catch (error) {

      console.log(error);

    }

  };

  // SEARCH BY NAME
  const searchMedicines = async () => {

    if (!search.trim()) {

      fetchMedicines();

      return;

    }

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/medicine/search/${encodeURIComponent(search)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.message || "Medicine not found");

        return;

      }

      setMedicines(data);

    } catch (error) {

      console.log(error);

    }

  };

  // GET MEDICINES BY STATUS
  const getStatus = async (selectedStatus) => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/medicine/status/${selectedStatus}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.message || "Failed to get medicine status");

        return;

      }

      setMedicines(data);

    } catch (error) {

      console.log(error);

    }

  };

  // CANCEL FORM
  const handleCancel = () => {

    setShowForm(false);
    setEditId(null);

    setFormData({
      name: "",
      batchNumber: "",
      manufacturer: "",
      quantity: "",
      manufacturingDate: "",
      expiryDate: ""
    });

  };

  return (

    <div className="dashboard-layout">

      <aside className="sidebar">

        <div className="logo">

          <div className="logo-icon">
            ✚
          </div>

          <div>
            <h2>PharmaTrack</h2>
            <span>Pharmacy System</span>
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
            className="nav-item active"
          >
            <span>▣</span>
            Medicines
          </Link>

          <Link
            to="/sales"
            className="nav-item"
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

            <h1>Medicines</h1>

            <p>
              Manage your pharmacy inventory
            </p>

          </div>

          <button
            className="primary-button"
            onClick={() => {

              setEditId(null);

              setFormData({
                name: "",
                batchNumber: "",
                manufacturer: "",
                quantity: "",
                manufacturingDate: "",
                expiryDate: ""
              });

              setShowForm(true);

            }}
          >
            + Add Medicine
          </button>

        </header>

        {showForm && (

          <div className="data-card">

            <h2>
              {editId
                ? "Update Medicine"
                : "Add Medicine"}
            </h2>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                name="name"
                placeholder="Medicine Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="batchNumber"
                placeholder="Batch Number"
                value={formData.batchNumber}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="manufacturer"
                placeholder="Manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                required
              />

              <label>
                Manufacturing Date
              </label>

              <input
                type="date"
                name="manufacturingDate"
                value={formData.manufacturingDate}
                onChange={handleChange}
                required
              />

              <label>
                Expiry Date
              </label>

              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="primary-button"
              >
                {editId
                  ? "Update Medicine"
                  : "Add Medicine"}
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

        {/* SEARCH AND FILTERS */}

        <div className="medicine-toolbar">

          <input
            type="text"
            placeholder="Search medicines..."
            className="search-input"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onKeyDown={(e) => {

              if (e.key === "Enter") {
                searchMedicines();
              }

            }}
          />

          <button
            className="filter-button"
            onClick={fetchMedicines}
          >
            All Medicines
          </button>

          <button
            className="filter-button"
            onClick={getLowStockMedicines}
          >
            Low Stock
          </button>

          <button
            className="filter-button"
            onClick={getExpiredMedicines}
          >
            Expired
          </button>

          <button
            className="filter-button"
            onClick={() => getStatus("active")}
          >
            Active
          </button>

          <button
            className="filter-button"
            onClick={() => getStatus("expired")}
          >
            Status: Expired
          </button>

          <button
            className="filter-button"
            onClick={searchMedicines}
          >
            Search
          </button>

        </div>

        {/* SEARCH MEDICINE BY ID */}

        <div className="data-card">

          <h3>Search Medicine by ID</h3>

          <input
            type="text"
            placeholder="Enter Medicine ID"
            className="search-input"
            value={medicineId}
            onChange={(e) =>
              setMedicineId(e.target.value)
            }
          />

          <button
            className="primary-button"
            onClick={getMedicineById}
          >
            Search by ID
          </button>

          <button
            className="filter-button"
            onClick={clearIdSearch}
          >
            Clear
          </button>

        </div>

        {/* MEDICINE TABLE */}

        <div className="data-card">

          <table>

            <thead>

              <tr>

                <th>Medicine</th>

                <th>Batch Number</th>

                <th>Manufacturer</th>

                <th>Quantity</th>

                <th>Expiry Date</th>

                <th>Status</th>

                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="7"
                    className="empty-table"
                  >
                    Loading medicines...
                  </td>

                </tr>

              ) : medicines.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="empty-table"
                  >

                    <div>💊</div>

                    <h3>
                      No medicines available
                    </h3>

                    <p>
                      Add your first medicine to
                      start managing inventory.
                    </p>

                  </td>

                </tr>

              ) : (

                medicines.map((medicine) => (

                  <tr key={medicine._id}>

                    <td>
                      {medicine.name}
                    </td>

                    <td>
                      {medicine.batchNumber}
                    </td>

                    <td>
                      {medicine.manufacturer}
                    </td>

                    <td>
                      {medicine.quantity}
                    </td>

                    <td>
                      {medicine.expiryDate
                        ? new Date(
                            medicine.expiryDate
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      {medicine.status}
                    </td>

                    <td>

                      <button
                        className="filter-button"
                        onClick={() =>
                          handleEdit(medicine._id)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="filter-button"
                        onClick={() =>
                          handleDelete(medicine._id)
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

export default Medicines;