
import { useState } from "react";
import { Link } from "react-router-dom";

const NAV_LINKS = ["Home", "Browse Cooks", "About", "Contact"];

const FEATURES = [
  {
    icon: "🥗",
    title: "Healthy Meals",
    desc: "Every dish is freshly prepared with wholesome, natural ingredients - no preservatives, no shortcuts.",
  },
  {
    icon: "✅",
    title: "Verified Home Cooks",
    desc: "All cooks are background-checked, certified, and rated by real customers in your neighborhood.",
  },
  {
    icon: "💰",
    title: "Affordable Prices",
    desc: "Restaurant-quality homemade food at prices that actually make sense for everyday eating.",
  },
  {
    icon: "📦",
    title: "Flexible Plans",
    desc: "Order daily, weekly, or monthly. Pause or cancel anytime - no hidden commitments.",
  },
];

const COOKS = [
  {
    img: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400&q=80",
    name: "Maria Santos",
    cuisine: "Mediterranean",
    rating: 4.9,
    price: "$8",
  },
  {
    img: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&q=80",
    name: "Aisha Patel",
    cuisine: "Indian Fusion",
    rating: 4.8,
    price: "$7",
  },
  {
    img: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80",
    name: "James Okafor",
    cuisine: "West African",
    rating: 4.9,
    price: "$9",
  },
  {
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
    name: "Lin Chen",
    cuisine: "Asian Home-Style",
    rating: 5.0,
    price: "$8",
  },
];

const PLANS = [
  {
    label: "Daily",
    price: "$12",
    per: "/ meal",
    color: "border-orange-200",
    features: ["1 meal per day", "Choose your cook", "Free delivery", "Cancel anytime"],
    cta: "Start Daily",
    highlight: false,
  },
  {
    label: "Weekly",
    price: "$69",
    per: "/ week",
    color: "border-orange-400",
    features: ["7 meals per week", "Mix & match cooks", "Free delivery", "Pause anytime", "5% savings"],
    cta: "Start Weekly",
    highlight: true,
  },
  {
    label: "Monthly",
    price: "$249",
    per: "/ month",
    color: "border-orange-200",
    features: ["30 meals per month", "Priority cook access", "Free delivery", "10% savings", "Dedicated support"],
    cta: "Start Monthly",
    highlight: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Rachel T.",
    avatar: "RT",
    text: "HomeFeast completely changed how my family eats. Maria's Mediterranean bowls are better than any restaurant I've been to - and it costs half the price!",
    stars: 5,
  },
  {
    name: "David K.",
    avatar: "DK",
    text: "I work long hours and cooking isn't an option. HomeFeast gives me real, home-cooked food every day. The weekly plan is an absolute steal.",
    stars: 5,
  },
  {
    name: "Priya M.",
    avatar: "PM",
    text: "As someone with dietary restrictions, it's hard to trust restaurant food. With HomeFeast I can talk directly to the cook. Total game changer.",
    stars: 5,
  },
];

const Stars = ({ count }) => (
  <span className="text-orange-400 text-sm">
    {"★".repeat(count)}{"☆".repeat(5 - count)}
  </span>
);

export default function HomeFeast() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="font-sans text-gray-800 bg-white">
      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-orange-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-extrabold text-2xl text-orange-500 tracking-tight">🍱 HomeFeast</Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">Home</Link>
            <Link to="/browse-cooks" className="text-sm font-medium text-orange-600 transition">Browse Cooks</Link> 
            <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">About</Link>
            <Link to="/contact" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">Contact</Link>
          </ul>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-orange-500 transition-colors px-4 py-2">Login</Link>
            <Link to="/register" className="text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full transition-colors shadow">Register</Link>
          </div>

          {/* Mobile burger */}
          <button className="md:hidden text-gray-700 text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-orange-100 px-6 pb-4 flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <a key={l} href="#" className="text-gray-700 font-medium hover:text-orange-500">{l}</a>
            ))}
            <hr className="border-orange-100" />
            <Link to="/login" className="text-orange-500 hover:text-orange-600 font-semibold">Login</Link>
            <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg">Register</Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative bg-linear-to-br from-orange-50 via-white to-orange-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-widest uppercase">
              🍽 Homemade · Delivered
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Fresh Homemade Meals<br />
              <span className="text-orange-500">Delivered Daily</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-xl">
              Discover verified home cooks offering healthy, affordable homemade food - right to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/browse-cooks" className="bg-orange-500 text-white hover:bg-white hover:text-orange-500 font-bold px-10 py-4 rounded-full shadow-lg transition-all">
                Browse Cooks Now
              </Link>
              <Link to="/register" className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold px-8 py-4 rounded-full transition-all text-center">
                Become a Home Cook
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-6 justify-center md:justify-start">
              <div className="flex -space-x-2">
                {["🧑","👩","👨","🧕"].map((e, i) => (
                  <span key={i} className="w-9 h-9 rounded-full bg-orange-200 border-2 border-white flex items-center justify-center text-base shadow">{e}</span>
                ))}
              </div>
              <p className="text-sm text-gray-500"><span className="font-bold text-gray-800">2,400+</span> happy customers this week</p>
            </div>
          </div>

          {/* Hero image */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-orange-300 rounded-3xl rotate-3 opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1543353071-873f17a7a088?w=700&q=80"
                alt="Happy family enjoying homemade food"
                className="relative rounded-3xl shadow-2xl w-full object-cover h-80 md:h-96"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-orange-100">
                <span className="text-2xl">⭐</span>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Average Rating</p>
                  <p className="text-lg font-extrabold text-gray-900">4.9 / 5.0</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-orange-500 text-white rounded-2xl shadow-xl px-4 py-3 text-center">
                <p className="text-xs font-medium opacity-80">Meals Today</p>
                <p className="text-xl font-extrabold">1,240+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY HOMEFEAST ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-orange-500 font-bold text-sm uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">Why HomeFeast?</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">We connect food lovers with talented home cooks - making every meal feel personal.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="group bg-orange-50 hover:bg-orange-500 rounded-2xl p-8 text-center transition-all duration-300 cursor-default shadow-sm hover:shadow-xl">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-white mb-2 transition-colors">{f.title}</h3>
                <p className="text-gray-500 group-hover:text-orange-100 text-sm leading-relaxed transition-colors">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED COOKS ── */}
      <section id="cooks" className="py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-orange-500 font-bold text-sm uppercase tracking-widest">Top Rated</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">Featured Home Cooks</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Real people, real kitchens, real love poured into every plate.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {COOKS.map((c) => (
              <div key={c.name} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                <div className="relative overflow-hidden h-52">
                  <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-white/90 text-orange-500 font-bold text-xs px-2 py-1 rounded-full shadow">
                    ⭐ {c.rating}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg">{c.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">🍴 {c.cuisine}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-orange-500 font-extrabold text-lg">From {c.price}</span>
                    <button className="bg-orange-100 hover:bg-orange-500 text-orange-600 hover:text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
                      View Menu
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <a href="#" className="inline-block border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold px-10 py-3 rounded-full transition-all">
              See All Cooks →
            </a>
          </div>
        </div>
      </section>

      {/* ── SUBSCRIPTION PLANS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-orange-500 font-bold text-sm uppercase tracking-widest">Pricing</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">Subscription Plans</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Pick the plan that fits your lifestyle. Upgrade, pause, or cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLANS.map((p) => (
              <div
                key={p.label}
                className={`relative rounded-2xl border-2 ${p.highlight ? "border-orange-500 shadow-2xl scale-105 bg-orange-500" : "border-orange-200 shadow-md bg-white"} p-8 flex flex-col transition-all`}
              >
                {p.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-orange-500 text-xs font-extrabold px-4 py-1 rounded-full border border-orange-300 shadow">
                    MOST POPULAR
                  </div>
                )}
                <h3 className={`font-extrabold text-xl mb-2 ${p.highlight ? "text-white" : "text-gray-900"}`}>{p.label}</h3>
                <div className="mb-6">
                  <span className={`text-5xl font-extrabold ${p.highlight ? "text-white" : "text-orange-500"}`}>{p.price}</span>
                  <span className={`text-sm ml-1 ${p.highlight ? "text-orange-100" : "text-gray-400"}`}>{p.per}</span>
                </div>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${p.highlight ? "text-orange-50" : "text-gray-600"}`}>
                      <span className={`font-bold ${p.highlight ? "text-white" : "text-orange-500"}`}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-full font-bold text-sm transition-all ${p.highlight ? "bg-white text-orange-500 hover:bg-orange-50" : "bg-orange-500 hover:bg-orange-600 text-white"} shadow`}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-orange-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-orange-500 font-bold text-sm uppercase tracking-widest">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">What Customers Say</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Don't just take our word for it - hear from real HomeFeast families.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow flex flex-col gap-4">
                <Stars count={t.stars} />
                <p className="text-gray-600 leading-relaxed text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-orange-50">
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-sm shrink-0">
                    {t.avatar}
                  </div>
                  <span className="font-bold text-gray-900 text-sm">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-orange-500 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to eat better, every day?</h2>
          <p className="text-orange-100 mb-8 text-lg">Join thousands of families who swapped takeout for real homemade food.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/browse-cooks" className="bg-white text-orange-500 hover:bg-orange-50 font-bold px-10 py-4 rounded-full shadow-lg transition-all">
              Browse Cooks Now
            </Link>
            <Link to="/register" className="border-2 border-white text-white hover:bg-orange-500 hover:text-white font-bold px-8 py-4 rounded-full transition-all text-center">
                Become a Home Cook
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-gray-400 py-14">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <p className="text-white font-extrabold text-xl mb-3">🍱 HomeFeast</p>
            <p className="text-sm leading-relaxed">Connecting food lovers with talented home cooks across the city. Real food. Real people.</p>
          </div>

          {/* Company */}
          <div>
            <p className="text-white font-bold mb-4">Company</p>
            <ul className="flex flex-col gap-2 text-sm">
              {["About Us", "How It Works", "Careers", "Press"].map((l) => (
                <li key={l}><a href="#" className="hover:text-orange-400 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-white font-bold mb-4">Legal</p>
            <ul className="flex flex-col gap-2 text-sm">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Contact"].map((l) => (
                <li key={l}><a href="#" className="hover:text-orange-400 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-white font-bold mb-4">Follow Us</p>
            <div className="flex gap-4 text-xl">
              {[
                { icon: "𝕏", label: "Twitter" },
                { icon: "f", label: "Facebook" },
                { icon: "▶", label: "YouTube" },
                { icon: "📸", label: "Instagram" },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className="w-10 h-10 rounded-full bg-gray-800 hover:bg-orange-500 flex items-center justify-center text-sm transition-colors">
                  {s.icon}
                </a>
              ))}
            </div>
            <p className="text-sm mt-6">📧 komalmathamsetti@gmail.com</p>
            <p className="text-sm mt-1">📞 +91 8885489886</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
          <p>© 2026 HomeFeast. All rights reserved.</p>
          <p>Made with ❤️ for home-cooked goodness</p>
        </div>
      </footer>
    </div>
  );
}
