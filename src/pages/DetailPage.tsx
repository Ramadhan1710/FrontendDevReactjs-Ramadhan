import { Link, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { api } from "../services/api"
import type { Category, Restaurant } from "../type/restaurant"

function DetailPage() {
   const { id } = useParams()
   const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
   const [categories, setCategories] = useState<Category[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      fetchData()
   }, [])

   const fetchData = async () => {
      try {
         setLoading(true)

         const [restaurantRes, categoriesRes] =
            await Promise.all([
               api.get(`/restaurants/${id}`),
               api.get("/categories"),
            ])

         setRestaurant(restaurantRes.data)
         setCategories(categoriesRes.data)

      } catch (error) {
         console.log(error)
      } finally {
         setLoading(false)
      }
   }

   const getInitials = (name: string) =>
      name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()

   const renderStars = (rating: number) =>
      Array.from({ length: 5 }, (_, i) => (
         <span key={i} className={i < Math.round(rating) ? "text-amber-400" : "text-gray-300"}>
            ★
         </span>
      ))

   const getCategoryName = (categoryId: string) => {
      return categories.find((category) => category.id === categoryId)?.name || "Unknown";
   };

   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center text-gray-400">
            Memuat...
         </div>
      )
   }

   if (!restaurant) {
      return (
         <div className="min-h-screen flex items-center justify-center text-gray-400">
            Restoran tidak ditemukan
         </div>
      )
   }

   return (
      <main className="min-h-screen p-4">
         <div className="max-w-2xl mx-auto">

            {/* Back */}
            <Link
               to="/"
               className="inline-flex items-center gap-1.5 mb-5 text-sm text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
            >
               ← Kembali
            </Link>

            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden h-60 mb-4">
               <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
               />
               <span
                  className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-lg ${restaurant.isOpen
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                     }`}
               >
                  {restaurant.isOpen ? "✓ Buka" : "✕ Tutup"}
               </span>
               <span className="absolute top-3 right-3 bg-black/55 text-white text-sm font-medium px-2.5 py-1 rounded-lg">
                  ★ {restaurant.rating}
               </span>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
               <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                  {restaurant.name}
               </h1>
               <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-4">
                  {getCategoryName(restaurant.categoryId)}
               </span>
               <p className="text-sm text-gray-500 leading-relaxed">
                  {restaurant.description}
               </p>

               <hr className="my-4 border-gray-100" />

               <div className="grid grid-cols-2 gap-2.5">
                  {[
                     { label: "Kisaran Harga", value: restaurant.priceRange },
                     { label: "Rating", value: `${restaurant.rating} / 5` },
                     { label: "Kategori", value: getCategoryName(restaurant.categoryId) },
                     {
                        label: "Status",
                        value: restaurant.isOpen ? "Sedang Buka" : "Sedang Tutup",
                        green: restaurant.isOpen,
                     },
                  ].map(({ label, value, green }) => (
                     <div key={label} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">
                           {label}
                        </p>
                        <p
                           className={`text-sm font-medium ${green !== undefined
                                 ? green
                                    ? "text-green-600"
                                    : "text-red-500"
                                 : "text-gray-800"
                              }`}
                        >
                           {value}
                        </p>
                     </div>
                  ))}
               </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
               <h2 className="text-base font-medium text-gray-800 mb-4">
                  Ulasan Pelanggan
               </h2>

               <div>
                  {restaurant.reviews.map((review, idx) => (
                     <div
                        key={review.id}
                        className={`py-4 ${idx < restaurant.reviews.length - 1 ? "border-b border-gray-100" : ""}`}
                     >
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
                                 {getInitials(review.userName)}
                              </div>
                              <span className="text-sm font-medium text-gray-800">
                                 {review.userName}
                              </span>
                           </div>
                           <div className="flex items-center gap-0.5 text-sm">
                              {renderStars(review.rating)}
                              <span className="text-xs text-gray-400 ml-1">
                                 {review.rating}
                              </span>
                           </div>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed pl-10">
                           {review.text}
                        </p>
                     </div>
                  ))}
               </div>
            </div>

         </div>
      </main>
   )
}

export default DetailPage