import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getAllUsers } from "../../services/adminServices";

export default function UsersCooks() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await getAllUsers();

      console.log("ADMIN USERS:", response);

      setUsers(response.users || []);
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async()=>{
       await loadUsers();
    };
    fetchUsers();
  }, []);

  // ==========================================
  // FILTER USERS
  // ==========================================

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        user.email
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        user.phone
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "all" ||
        user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // ==========================================
  // COUNTS
  // ==========================================

  const customerCount = users.filter(
    (user) => user.role === "customer"
  ).length;

  const cookCount = users.filter(
    (user) => user.role === "cook"
  ).length;

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-125 items-center justify-center">
        <h2 className="text-2xl font-bold text-orange-500">
          Loading Users & Cooks...
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <div>
        <h1 className="text-3xl font-bold text-orange-600">
          Users & Cooks
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          View and manage all HomeFeast users and cooks.
        </p>
      </div>


      {/* ====================================== */}
      {/* STATISTICS */}
      {/* ====================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* Total */}
        <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Users
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {users.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
              👥
            </div>

          </div>
        </div>


        {/* Customers */}
        <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Customers
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {customerCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
              🧑
            </div>

          </div>
        </div>


        {/* Cooks */}
        <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Cooks
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {cookCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-2xl">
              👨‍🍳
            </div>

          </div>
        </div>

      </div>


      {/* ====================================== */}
      {/* SEARCH + FILTER */}
      {/* ====================================== */}

      <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-4 md:flex-row">

          {/* Search */}
          <div className="relative flex-1">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />

          </div>


          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
          >
            <option value="all">
              All Users
            </option>

            <option value="customer">
              Customers
            </option>

            <option value="cook">
              Cooks
            </option>

            <option value="admin">
              Admins
            </option>
          </select>

        </div>

      </div>


      {/* ====================================== */}
      {/* USERS TABLE */}
      {/* ====================================== */}

      <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              All Users
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {filteredUsers.length} user
              {filteredUsers.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <button
            onClick={loadUsers}
            className="rounded-xl border border-orange-200 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
          >
            ↻ Refresh
          </button>

        </div>


        {/* Empty */}
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center">

            <div className="text-5xl">
              🔍
            </div>

            <h3 className="mt-4 text-lg font-bold text-gray-900">
              No users found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try changing your search or filter.
            </p>

          </div>
        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Joined
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-100">

                {filteredUsers.map((user) => (

                  <tr
                    key={user.id}
                    className="transition hover:bg-orange-50/40"
                  >

                    {/* User */}
                    <td className="whitespace-nowrap px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">
                          {user.name
                            ? user.name
                                .charAt(0)
                                .toUpperCase()
                            : "U"}
                        </div>

                        <div>

                          <p className="text-sm font-semibold text-gray-900">
                            {user.name || "Unknown"}
                          </p>

                          <p className="text-xs text-gray-400">
                            ID #{user.id}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* Email */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {user.email || "-"}
                    </td>


                    {/* Phone */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {user.phone || "-"}
                    </td>


                    {/* Role */}
                    <td className="whitespace-nowrap px-6 py-4">

                      {user.role === "cook" && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          👨‍🍳 Cook
                        </span>
                      )}

                      {user.role === "customer" && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          🧑 Customer
                        </span>
                      )}

                      {user.role === "admin" && (
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                          🛡 Admin
                        </span>
                      )}

                    </td>


                    {/* Date */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}