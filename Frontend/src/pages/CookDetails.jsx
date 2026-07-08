import { useEffect,useState } from "react";
import { Link,useParams,useNavigate } from "react-router-dom";
import API from "../services/api";
const StarRating = ({ value }) => (
  <div className="flex items-center gap-1 text-orange-500">
    {"★".repeat(5).split("").map((star, i) => (
      <span key={i} className={i < Math.round(value) ? "opacity-100" : "opacity-30"}>
        ★
      </span>
    ))}
  </div>
);

const Navbar = () => (
  <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/95 backdrop-blur">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-lg font-bold text-white">
          HF
        </div>
        <span className="text-xl font-bold text-gray-900">HomeFeast</span>
      </div>
      <nav className="hidden items-center gap-8 md:flex">
        <Link to="/" className="text-sm font-medium text-gray-700 hover:text-orange-500">Home</Link>
        <Link to="/browse-cooks" className="text-sm font-medium text-gray-700 hover:text-orange-500">Browse Cooks</Link>
        <Link to="/orders" className="text-sm font-medium text-gray-700 hover:text-orange-500">Orders</Link>
        <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-orange-500">Login</Link>
      </nav>
      <button className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white md:hidden">
        Menu
      </button>
    </div>
  </header>
);

const StatCard = ({ label, value }) => (
  <div className="rounded-2xl border border-orange-100 bg-white p-5 text-center shadow-sm">
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="mt-1 text-sm text-gray-500">{label}</div>
  </div>
);
const MealCard = ({ meal,navigate }) => (
  <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
    <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80" alt={meal.dish_name} className="h-52 w-full object-cover" />
    <div className="space-y-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{meal.dish_name}</h3>
          <p className="text-sm text-gray-500">{meal.cuisine}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            meal.meal_type === "Veg"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {meal.meal_type}
        </span>
      </div>
      <p className="text-sm leading-6 text-gray-600">{meal.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-orange-500">₹ {meal.price}</span>
        <button onClick={()=>navigate(`/order/${meal.cook_id}?menu=${meal.id}`)} className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
          Order Now
        </button>
      </div>
    </div>
  </div>
);

const ReviewCard = ({ review }) => (
  <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-xl font-bold text-white">
        {review.name.charAt(0)}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">{review.name}</h4>
        <StarRating value={review.rating} />
      </div>
    </div>
    <p className="mt-4 text-sm leading-6 text-gray-600">"{review.comment}"</p>
  </div>
);

export default function CookDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cook, setCook] = useState(null);
    const [menus, setMenus] = useState([]);
    const [reviews,setReviews]=useState([]);
    const [planType, setPlanType] = useState("Monthly");
    const [isSubscribed,setIsSubscribed] = useState(false);
    const [subscriptionLoading,setSubscriptionLoading] = useState(false);
    const [averageRating,setAverageRating]=useState({
       average_rating:0,
       total_reviews:0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
    const loadCook = async () => {
        try {
            const response = await API.get(`/search/cook/${id}`);
            setCook(response.data.cook);
            setMenus(response.data.menus);
            const token = localStorage.getItem("token");
            if (token) {
              const subscriptionResponse =await API.get("/subscriptions/my");
              const alreadySubscribed =subscriptionResponse.data.some((subscription) =>
                subscription.cook_id === Number(id) &&
                subscription.status === "active"
              );
              setIsSubscribed(alreadySubscribed);
            }
            const reviewResponse = await API.get(`/reviews/${id}`);
            setReviews(reviewResponse.data);
            const ratingResponse = await API.get(`/reviews/average/${id}`);
            setAverageRating(ratingResponse.data);
        } catch (error) {
            console.log(error);
            setError("Unable to load cook");
        } finally {
            setLoading(false);
        }
    };
    loadCook();
  }, [id]);
  const subscribeCook = async () => {
    try {
        setSubscriptionLoading(true);
        await API.post("/subscriptions", {
            cook_id: Number(id),
            plan_type: planType
        });
        setIsSubscribed(true);
        alert("Subscription Successful");
    }
    catch (error) {
        alert(
            error.response?.data?.message ||
            "Subscription Failed"
        );
    }
    finally {
        setSubscriptionLoading(false);
    }
  };
  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold text-orange-500">Loading Cook...</h1>
        </div>
    );
    } 
    if (error) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <h1 className="text-red-500 text-2xl">{error}</h1>
        </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#fffaf5] text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        {/* Hero */}
        <section className="grid items-center gap-10 rounded-4xl bg-white p-6 shadow-sm lg:grid-cols-2 lg:p-10">
          <div className="order-2 lg:order-1">
            <div className="mb-3 inline-flex rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-orange-600">
              Premium Home Cook
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              {cook?.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <StarRating value={Number(averageRating.average_rating)} />
                <span className="font-semibold text-gray-900">{averageRating.average_rating}</span>
              </div>
              <span>• {cook?.service_area}</span>
              <span>• {cook?.delivery_timings}</span>
            </div>
            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600">{cook?.bio}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <select value={planType} onChange={(e)=>setPlanType(e.target.value)} className="rounded-xl border border-orange-300 px-4 py-3 bg-white">
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
              <button onClick={subscribeCook} disabled={subscriptionLoading || isSubscribed} className={`rounded-full px-6 py-3 font-semibold text-white shadow-md transition
              ${isSubscribed? "bg-green-500": "bg-orange-500 hover:bg-orange-600"}
              ${subscriptionLoading? "opacity-70 cursor-not-allowed": ""}`}>
                {subscriptionLoading? "Subscribing...": isSubscribed? "Subscribed ✓": "Subscribe"}
              </button>
              <button onClick={() => navigate(`/order/${id}`)} className="rounded-full border-2 border-orange-500 bg-white px-6 py-3 font-semibold text-orange-500 hover:bg-orange-50">
                Order Meals
              </button>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
              alt="Cook"
              className="h-105 w-full rounded-4xl object-cover shadow-lg"
            />
          </div>
        </section>

        {/* Stats */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard label="Average Rating" value={`${averageRating.average_rating} ⭐`}/>
          <StatCard label="Delivery Timings" value={cook?.delivery_timings}/>
          <StatCard label="Service Area" value={cook?.service_area}/>
        </section>

        {/* Meals */}
        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">Available Meals({menus.length})</h2>
              <p className="mt-1 text-sm text-gray-500">Freshly prepared dishes ready to order.</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {menus.length > 0 ? (
                menus.map((meal) => (
                <MealCard
                key={meal.id}
                meal={meal}
               />
            ))
        ) : (
        <div className="col-span-full text-center py-10">
            <h2 className="text-2xl font-semibold text-gray-500">
                No meals available.
            </h2>
        </div>
            )}
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-14">
          <div className="mb-6">
            <h2 className="text-2xl font-bold md:text-3xl">Customer Reviews</h2>
            <p className="mt-1 text-sm text-gray-500">What customers say about this cook.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {reviews.length>0 ?(reviews.map((review)=>(
                <ReviewCard key={review.id} review={review}/>
            ))
            ):(
            <div className="col-span-full text-center py-8">
                <h2 className="text-gray-500 text-xl">No Reviews Yet</h2>
            </div>
            )
           }
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-orange-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6">
          <p className="text-sm text-gray-600">© 2026 HomeFeast. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-orange-500">Privacy</a>
            <a href="#" className="hover:text-orange-500">Terms</a>
            <a href="#" className="hover:text-orange-500">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}