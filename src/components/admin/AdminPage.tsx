import React, { useEffect, useState } from "react";
import axios from "axios";
import { User } from "../../types/User";
import "./AdminPage.css";

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.get<User[]>("https://localhost:7069/api/User", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Kullanıcılar getirilemedi.");
      } else {
        setError("Bilinmeyen bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: number) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.patch(
        `https://localhost:7069/api/User/${userId}/toggle-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data;
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === userId ? { ...user, isActive: updatedUser.isActive } : user
        )
      );
    } catch (err) {
      alert("Durum güncellenemedi.");
      console.error(err);
    }
  };

  const handleDelete = async (userId: number) => {
    const confirmDelete = window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.delete(`https://localhost:7069/api/User/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 204) {
        await fetchUsers(); // Backend'e senkron kal
      } else {
        alert("Sunucudan başarılı yanıt alınamadı. Kullanıcı silinemedi.");
      }
    } catch (err) {
      alert("Kullanıcı silinemedi.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Paneli - Kullanıcılar</h1>

      <input
        type="text"
        placeholder="İsme göre ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {loading && <p className="status">Yükleniyor...</p>}
      {error && <p className="status" style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div className="user-grid">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.userId} className="user-card">
                <div className="user-name">{user.fullName}</div>
                <div className="user-email">{user.email}</div>
                <div className="user-role">
                  {user.roleName || `Rol ID: ${user.roleId}`}
                </div>

                {/* 👇 Kullanıcı Aktif/Pasif Durumu */}
                <div className="user-status">
                  <span className={`status-label ${user.isActive ? "active" : "inactive"}`}>
                    {user.isActive ? "Aktif" : "Pasif"}
                  </span>
                  <button
                    className="status-toggle-button"
                    onClick={() => toggleUserStatus(user.userId)}
                  >
                    Durumu Değiştir
                  </button>
                </div>

                {/* Sil butonu opsiyonel */}
                <button
                  className="delete-button"
                  onClick={() => handleDelete(user.userId)}
                >
                  Sil
                </button>
              </div>
            ))
          ) : (
            <p className="status">Sonuç bulunamadı.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
