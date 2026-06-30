import { useMemo, useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1 text-amber-400">
      {[...Array(5)].map((_, i) => (
        <span key={i}>
          {i < fullStars ? "★" : i === fullStars && hasHalf ? "★" : "☆"}
        </span>
      ))}
      <span className="ml-1 text-sm font-medium text-slate-600">{rating}</span>
    </div>
  );
}

function CookCard({ cook }) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-[0_8px_30px_rgba(251,146,60,0.08)] transition hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(251,146,60,0.14)]">
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80"
          alt={cook.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-orange-600 backdrop-blur">
          Verified Cook
        </span>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{cook.name}</h3>
            <p className="text-sm text-slate-500">{cook.service_area}</p>
          </div>
          <div className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
            Serving Homemade Meals
          </div>
        </div>

        <p className="mb-3 text-sm font-medium text-slate-600">{cook.bio}</p>
        <p className="text-sm text-gray-500 mb-4">🕒 {cook.delivery_timings}</p>
        <div className="mb-5">
          <StarRating rating={Number(cook.rating)} />
        </div>

        <Link to={`/cook/${cook.id}`} className="block w-full rounded-2xl bg-orange-500 px-4 py-3 text-center font-semibold text-white transition hover:bg-orange-600">
          View Profile
        </Link>
      </div>
    </div>
  );
}

export default function BrowseHomeCooksPage() {
  const [cooks,setCooks] = useState([]);
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("All Cuisines");
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");
  const fetchCooks = async () => {
  try {
    const response = await API.get("/search/cooks");
    setCooks(response.data);
  } catch (err) {
    console.error(err);
    setError("Unable to load cooks");
  } finally {
    setLoading(false);
  }
  };
  useEffect(() => {
    const loadCooks = async () => {
      await fetchCooks();
    };
    loadCooks();
   }, []);
   const searchCooks = async (keyword) => {
    try {
        const response = await API.get(
          `/search?search=${keyword}`
        );
        setCooks(response.data);
    }
    catch (err) {
      console.log(err);
    }
  };
  const filteredCooks = useMemo(() => {
  return cooks.filter((cook) => {
    const matchesSearch =
      cook.name.toLowerCase().includes(search.toLowerCase()) ||
      cook.bio.toLowerCase().includes(search.toLowerCase()) ||
      cook.service_area.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });
  }, [cooks, search]);
  if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-orange-500">
        Loading Home Cooks...
      </h1>
    </div>
  );
  }
  if (error) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-red-500 text-2xl">
        {error}
      </h1>
    </div>
  );
  }
  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-white to-white text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-lg font-bold text-white">
              H
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              HomeFeast
            </span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">Home</Link>
            <Link to="/browse-cooks" className="text-sm font-medium text-orange-600 transition">Browse Cooks</Link> 
            <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">About</Link>
            <Link to="/contact" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">Contact</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-orange-500 hover:text-orange-600 font-semibold">Login</Link>
            <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg">Register</Link>
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="mb-10 text-center">
          <div className="mx-auto mb-4 inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
            Fresh, homemade, and verified
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Browse Home Cooks
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Discover verified home cooks serving delicious homemade meals.
          </p>
        </section>

        {/* Filters */}
        <section className="mb-10 rounded-3xl border border-orange-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <input
                type="text"
                value={search}
                onChange={(e)=>{const value = e.target.value;
                  setSearch(value);
                  if(value===""){
                    fetchCooks();
                  }else{
                    searchCooks(value);
                  }
                }}
                placeholder="Search by cook name, cuisine, or location"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              >
                <option>All Cuisines</option>
                <option>South Indian</option>
                <option>North Indian</option>
                <option>Chinese</option>
                <option>Italian</option>
                <option>Continental</option>
              </select>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">
              Showing {filteredCooks.length} cooks
            </p>
          </div>

          {
            filteredCooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
            <div className="text-7xl mb-5">🍱</div>
            <h2 className="text-3xl font-bold text-gray-700">No Home Cooks Found</h2>
            <p className="text-gray-500 mt-3">Try searching with another keyword.</p>
            </div>
            ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {filteredCooks.map((cook) => (
                <CookCard
                  key={cook.id}
                  cook={cook}
                />
                ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
