import { Link } from "react-router-dom";
export default function CookCard({cook}){
    return(
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
            src={
                cook.profile_image ||
                "https://via.placeholder.com/300"
            }
            alt={cook.name}
            className="h-52 w-full object-cover"
            />
            <div className="p-5">
                <h2 className="text-xl font-bold">
                    {cook.name}
                </h2>
                <p className="text-gray-500">
                    {cook.cuisine}
                </p>
                <p className="text-yellow-500 mt-2">
                    ⭐ {cook.rating}
                </p>
                <p className="font-bold mt-2">
                    ₹ {cook.price}
                </p>
                <Link
                to={`/cook/${cook.id}`}
                className="block text-center mt-5 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg"
                >
                    View Profile
                </Link>
            </div>
        </div>
    );
}