import { useMemo, useState, useEffect } from "react";
import { useParams,useSearchParams,useNavigate } from "react-router-dom";
import API from "../services/api";

function HomeFeastNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-orange-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-lg font-bold text-white shadow-lg shadow-orange-200">
            HF
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">HomeFeast</p>
            <p className="text-xs text-slate-500">Fresh meals, delivered with care</p>
          </div>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-orange-500">
            Home
          </a>
          <a href="#" className="text-sm font-medium text-orange-500">
            Order Meals
          </a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-orange-500">
            How it works
          </a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-orange-500">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}

function MealBadge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 ring-1 ring-inset ring-orange-100">
      {children}
    </span>
  );
}

function QuantitySelector({ quantity, setQuantity }) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        className="flex h-11 w-11 items-center justify-center text-xl font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        −
      </button>
      <div className="min-w-12 px-4 text-center text-sm font-semibold text-slate-900">
        {quantity}
      </div>
      <button
        type="button"
        onClick={() => setQuantity(quantity + 1)}
        className="flex h-11 w-11 items-center justify-center text-xl font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        +
      </button>
    </div>
  );
}

function SummaryRow({ label, value, emphasized = false }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className={`text-sm ${emphasized ? "font-semibold text-slate-900" : "text-slate-600"}`}>
        {label}
      </span>
      <span className={`text-sm ${emphasized ? "font-semibold text-slate-900" : "text-slate-800"}`}>
        {value}
      </span>
    </div>
  );
}

function TextField({ label, placeholder, rows = 3, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
      />
    </label>
  );
}

function MealPreviewCard({ dish, quantity, setQuantity }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-0 md:grid-cols-[220px_1fr]">
        <div className="relative">
          <img src={dish?.image || "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80"} alt={dish.dish_name} className="h-56 w-full object-cover md:h-full" />
          <div className="absolute left-4 top-4">
            <MealBadge>{dish.meal_type}</MealBadge>
          </div>
        </div>
        <div className="p-6 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">{dish.dish_name}</h3>
              <p className="mt-1 text-sm text-slate-500">{dish.cuisine}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Price</p>
              <p className="text-2xl font-bold text-orange-600">₹{dish.price}</p>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">{dish.description}</p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Quantity</p>
              <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
            </div>
            <div className="rounded-2xl bg-orange-50 px-4 py-3 text-sm text-orange-700 ring-1 ring-inset ring-orange-100">
              Freshly prepared for your chosen delivery slot
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderSummaryCard({ dish, quantity, deliveryFee, total, grandTotal, loading, success, handlePlaceOrder }) {
  return (
    <aside className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Order Summary</h3>
      <p className="mt-1 text-sm text-slate-500">Review your meal before placing the order.</p>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <SummaryRow label="Selected Meal" value={dish?.dish_name || "-"}emphasized/>
        <SummaryRow label="Quantity" value={quantity}/>
        <SummaryRow label="Price per Meal" value={`₹${Number(dish?.price || 0).toFixed(2)}`}/>
        <SummaryRow label="Total Price" value={`₹${Number(total || 0).toFixed(2)}`}/>
        <SummaryRow label="Delivery Charges" value={deliveryFee > 0 ? `₹${deliveryFee}` : "Free"}/>
        <div className="my-3 border-t border-slate-200" />
          <SummaryRow label="Grand Total" value={`₹${Number(grandTotal || 0).toFixed(2)}`} emphasized/>
        </div>
      <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 p-4">
        <p className="text-sm font-semibold text-orange-700">Delivery Information</p>
        <p className="mt-1 text-sm leading-6 text-orange-700/90">
          Your meal will be prepared fresh and delivered to your selected address.
        </p>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={handlePlaceOrder}
        className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-orange-500 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-80"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>

      {success && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          Your order has been placed successfully.
        </div>
      )}
    </aside>
  );
}

export default function OrderMealsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get("menu");
  const navigate = useNavigate();
  const [cook, setCook] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [selectedDishId, setSelectedDishId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchCook = async () => {
        try{
            const response =
                await API.get(`/search/cook/${id}`);
            setCook(response.data.cook);
            setDishes(response.data.menus);
            if(menuId){
                setSelectedDishId(Number(menuId));
            }
            else if(response.data.menus.length>0){
                setSelectedDishId(response.data.menus[0].id);
            }
        }
        catch(error){
            console.log(error);
            setError("Unable to load meals");
        }
    };
    fetchCook();
  },[id,menuId]);
  const selectedDish = useMemo(() => {
    return dishes.find(
        dish=>dish.id===Number(selectedDishId)
    );
   },[dishes,selectedDishId]);
  const deliveryFee = 0;
  const total = (Number(selectedDish?.price) || 0) *quantity;
  const grandTotal = Number(total) + Number(deliveryFee);
  const handlePlaceOrder = async () => {
    // Check if a meal is selected
    if (!selectedDish) {
        alert("Please select a meal.");
        return;
    }
    // Quantity validation
    if (quantity < 1) {
        alert("Quantity must be at least 1.");
        return;
    }
    // Delivery Address validation
    if (address.trim() === "") {
        alert("Please enter your delivery address.");
        return;
    }
    try {
        setLoading(true);
        setSuccess(false);
        const response = await API.post(
            "/orders",
            {
                menu_id: selectedDish?.id,
                quantity: quantity,
                delivery_address:address,
                special_instructions:instructions
            }
        );
        console.log(response.data);
        setSuccess(true);
        setTimeout(()=>{
            navigate("/orders");
        },2000);
    }
    catch (error) {
        console.log(error);
        alert(
            error.response?.data?.message ||
            "Unable to place order."
        );
    }
    finally {
        setLoading(false);
    }
  };
  if(error){
    return(
    <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl text-red-500">{error}</h1>
    </div>
    );
  }
  if(!selectedDish){
    return(
    <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl">Loading Meals...</h1>
    </div>
    );
  }
  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-white to-white text-slate-900">
      <HomeFeastNavbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8">
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">
                  HomeFeast Order Meals
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Order fresh meals from trusted home chefs
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                  Choose your meal, customize the quantity, and place your order in a clean premium
                  experience built for speed and convenience.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-500">Cook Name</p>
                  <p className="mt-1 font-semibold text-slate-900">{cook?.name}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-500">Service Area</p>
                  <p className="mt-1 font-semibold text-slate-900">{cook?.service_area}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-500">Rating</p>
                  <p className="mt-1 font-semibold text-slate-900">{cook?.rating}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-500">Delivery Timing</p>
                  <p className="mt-1 font-semibold text-slate-900">{cook?.delivery_timings}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Select Meal</span>
                <select value={selectedDishId} onChange={(e)=>setSelectedDishId(Number(e.target.value))} className="w-full rounded-xl border border-gray-300 p-3">
                    {dishes.map((dish)=>(
                        <option key={dish.id} value={dish.id}>{dish.dish_name}—₹{dish.price}</option>
                    ))}
               </select>
              </label>
            </div>

            <MealPreviewCard
              dish={selectedDish}
              quantity={quantity}
              setQuantity={(val) => {
                setQuantity(val);
                setSuccess(false);
              }}
            />

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <h2 className="text-lg font-semibold text-slate-900">Delivery Details</h2>
              <p className="mt-1 text-sm text-slate-500">
                Tell us where to deliver and share any special instructions.
              </p>

              <div className="mt-6 space-y-5">
                <TextField
                  label="Delivery Address"
                  placeholder="Enter your full delivery address"
                  rows={4}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <TextField
                  label="Special Instructions"
                  placeholder="Gate code, floor, landmark, or dietary notes"
                  rows={4}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={loading}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-orange-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-80 lg:hidden"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>

              {success && (
                <div className="mt-6 rounded-3xl border border-green-200 bg-green-50 p-6">
                    <h2 className="text-2xl font-bold text-green-700">🎉 Order Placed Successfully</h2>
                    <p className="mt-2 text-green-600">Your meal has been sent to the cook.You can track it from My Orders.</p>
                </div>)}
            </div>
          </section>

          <div className="hidden lg:block">
            <OrderSummaryCard
              dish={selectedDish}
              quantity={quantity}
              deliveryFee={deliveryFee}
              total={total}
              grandTotal={grandTotal}
              loading={loading}
              success={success}
              handlePlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>

        <div className="mt-8 lg:hidden">
          <OrderSummaryCard
            dish={selectedDish}
            quantity={quantity}
            deliveryFee={deliveryFee}
            total={total}
            grandTotal={grandTotal}
            loading={loading}
            success={success}
            handlePlaceOrder={handlePlaceOrder}
          />
        </div>

        <div className="mt-6 flex items-center justify-center">
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={loading}
            className="inline-flex w-full max-w-md items-center justify-center rounded-full bg-orange-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </main>
    </div>
  );
}