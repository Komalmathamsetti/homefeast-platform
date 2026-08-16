import {
  Search,
  Pencil,
  Utensils,
  Tag,
  X
} from "lucide-react";

import { useState, useEffect } from "react";

import {
  getAllCategories,
  getAllCuisines,
  updateCategory,
  updateCuisine
} from "../../services/adminServices";


export default function CuisinesAndCategories() {

  const [cuisines, setCuisines] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);


  /* ==========================================
     LOAD CUISINES + CATEGORIES
  ========================================== */

  const loadData = async () => {
    try {

      setLoading(true);
      setError("");

      const [
        cuisineResponse,
        categoryResponse
      ] = await Promise.all([
        getAllCuisines(),
        getAllCategories()
      ]);

      setCuisines(
        cuisineResponse?.cuisines || []
      );

      setCategories(
        categoryResponse?.categories || []
      );

    } catch (error) {

      console.error(
        "Failed to load cuisines/categories:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Failed to load cuisines and categories"
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    const fetchData = async()=>{
        await loadData();
    }
    fetchData();
  }, []);


  /* ==========================================
     SEARCH
  ========================================== */

  const filteredCuisines = cuisines.filter((item) =>
    item.cuisine
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredCategories = categories.filter((item) =>
    item.category
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );


  /* ==========================================
     OPEN EDIT MODAL
  ========================================== */

  const openEditModal = (type, item) => {

    setModalType(type);
    setEditingItem(item);

    if (type === "cuisine") {
      setName(item.cuisine);
    } else {
      setName(item.category);
    }

    setError("");
    setModalOpen(true);
  };


  /* ==========================================
     CLOSE MODAL
  ========================================== */

  const closeModal = () => {

    setModalOpen(false);
    setModalType("");
    setEditingItem(null);
    setName("");
    setError("");
  };


  /* ==========================================
     UPDATE CUISINE / CATEGORY
  ========================================== */

  const handleUpdate = async () => {

    if (!name.trim()) {

      setError("Name cannot be empty");

      return;
    }

    if (!editingItem) {
      return;
    }

    try {

      setSaving(true);
      setError("");

      if (modalType === "cuisine") {

        await updateCuisine(
          editingItem.cuisine,
          name.trim()
        );

      } else {

        await updateCategory(
          editingItem.category,
          name.trim()
        );
      }

      closeModal();

      // Reload latest data
      await loadData();

    } catch (error) {

      console.error(
        "Update failed:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Failed to update"
      );

    } finally {

      setSaving(false);

    }
  };


  return (
    <div className="min-h-screen bg-[#fffaf5] px-4 py-6 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* ==========================================
            PAGE HEADER
        ========================================== */}

        <div className="mb-8">

          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-600">
            Admin Management
          </p>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Cuisines & Categories
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Manage the cuisines and meal categories available on HomeFeast.
          </p>

        </div>


        {/* ==========================================
            SEARCH
        ========================================== */}

        <div className="mb-6">

          <div className="relative max-w-md">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search cuisines or categories..."
              className="w-full rounded-xl border border-orange-100 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />

          </div>

        </div>


        {/* ==========================================
            ERROR
        ========================================== */}

        {error && !modalOpen && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}


        {/* ==========================================
            LOADING
        ========================================== */}

        {loading ? (

          <div className="rounded-2xl border border-orange-100 bg-white p-10 text-center">

            <p className="text-sm font-medium text-gray-500">
              Loading cuisines and categories...
            </p>

          </div>

        ) : (

          /* ==========================================
             MANAGEMENT CARDS
          ========================================== */

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

            <ManagementCard
              title="Cuisines"
              subtitle="Organize meals by cuisine type."
              icon={<Utensils size={20} />}
              items={filteredCuisines}
              type="cuisine"
              onEdit={openEditModal}
            />


            <ManagementCard
              title="Categories"
              subtitle="Group meals by serving type."
              icon={<Tag size={20} />}
              items={filteredCategories}
              type="category"
              onEdit={openEditModal}
            />

          </div>

        )}

      </div>


      {/* ==========================================
          EDIT MODAL
      ========================================== */}

      {modalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">


            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-gray-900">

                  Edit{" "}

                  {modalType === "cuisine"
                    ? "Cuisine"
                    : "Category"}

                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Rename this {modalType}.
                </p>

              </div>


              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >

                <X size={20} />

              </button>

            </div>


            {/* MODAL BODY */}

            <div className="px-6 py-6">

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />


              {/* MODAL ERROR */}

              {error && (
                <p className="mt-2 text-sm text-red-500">
                  {error}
                </p>
              )}

            </div>


            {/* MODAL FOOTER */}

            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">

              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>


              <button
                onClick={handleUpdate}
                disabled={saving}
                className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
              >

                {saving
                  ? "Saving..."
                  : "Save Changes"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}


/* =================================================
   MANAGEMENT CARD
================================================= */

function ManagementCard({
  title,
  subtitle,
  icon,
  items,
  type,
  onEdit
}) {

  return (

    <section className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">


      {/* CARD HEADER */}

      <div className="flex items-center border-b border-orange-50 px-5 py-5 sm:px-6">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">

            {icon}

          </div>


          <div>

            <h2 className="text-lg font-bold text-gray-900">
              {title}
            </h2>

            <p className="text-xs text-gray-500">
              {subtitle}
            </p>

          </div>

        </div>

      </div>


      {/* TABLE HEADER */}

      <div className="hidden grid-cols-[1fr_120px_80px] border-b border-gray-100 bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 sm:grid sm:px-6">

        <span>Name</span>

        <span>Meals</span>

        <span className="text-right">
          Actions
        </span>

      </div>


      {/* ROWS */}

      <div className="divide-y divide-gray-100">

        {items.length === 0 ? (

          <div className="px-6 py-10 text-center">

            <p className="text-sm text-gray-400">
              No {type === "cuisine"
                ? "cuisines"
                : "categories"} found.
            </p>

          </div>

        ) : (

          items.map((item) => {

            const itemName =
              type === "cuisine"
                ? item.cuisine
                : item.category;


            return (

              <div
                key={itemName}
                className="grid grid-cols-1 gap-3 px-5 py-4 transition hover:bg-orange-50/50 sm:grid-cols-[1fr_120px_80px] sm:items-center sm:gap-0 sm:px-6"
              >

                {/* NAME */}

                <div>

                  <p className="font-semibold text-gray-800">
                    {itemName}
                  </p>

                  <p className="mt-1 text-xs text-gray-500 sm:hidden">

                    {item.meals}

                    {" "}

                    {Number(item.meals) === 1
                      ? "meal"
                      : "meals"}

                  </p>

                </div>


                {/* MEALS */}

                <p className="hidden text-sm text-gray-500 sm:block">

                  {item.meals}

                  {" "}

                  {Number(item.meals) === 1
                    ? "meal"
                    : "meals"}

                </p>


                {/* ACTION */}

                <div className="flex items-center justify-start gap-2 sm:justify-end">

                  <button
                    onClick={() =>
                      onEdit(type, item)
                    }
                    aria-label={`Edit ${itemName}`}
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
                  >

                    <Pencil size={17} />

                  </button>

                </div>

              </div>

            );

          })

        )}

      </div>

    </section>

  );
}