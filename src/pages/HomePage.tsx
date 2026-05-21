import { useEffect, useState } from "react"
import RestaurantCard from "../components/RestaurantCard"
import { api } from "../services/api"
import type { Category, Restaurant } from "../type/restaurant";

const INITIAL_VISIBLE_COUNT = 8; // 2 baris x 4 kolom

function HomePage() {
   const [restaurants, setRestaurants] = useState<Restaurant[]>([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState('')
   const [priceFilter, setPriceFilter] = useState("All");
   const [openOnly, setOpenOnly] = useState(false)
   const [selectedCategory, setSelectedCategory] = useState('All')
   const [categories, setCategories] = useState<Category[]>([])
   const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

   useEffect(() => {
      fetchRestaurants(selectedCategory)
      fetchCategories()
   }, [selectedCategory])

   useEffect(() => {
      setVisibleCount(INITIAL_VISIBLE_COUNT);
   }, [priceFilter, openOnly, selectedCategory]);

   const fetchCategories = async () => {
      try {
         setLoading(true)
         const response = await api.get('/categories')
         setCategories(response.data)
      } catch (error) {
         console.log(error)
      } finally {
         setLoading(false)
      }
   }

   const fetchRestaurants = async (category = 'All') => {
      try {
         setLoading(true)
         const response = await api.get('/restaurants', {
            params: category === "All" ? {} : { categoryId: category }
         })
         setRestaurants(response.data)
      } catch (err: any) {
         if (err.response?.status === 404) {
            setRestaurants([])
            return
         }
         setError('Failed to fetch restaurants')
      } finally {
         setLoading(false)
      }
   }

   const filteredRestaurants = restaurants.filter((restaurant) => {
      const matchOpen = openOnly ? restaurant.isOpen : true;
      const matchPrice = priceFilter === "All" ? true : restaurant.priceRange === priceFilter;
      return matchOpen && matchPrice;
   });

   const visibleRestaurants = filteredRestaurants.slice(0, visibleCount);
   const hasMore = filteredRestaurants.length > visibleCount;

   const loadMore = () => {
      setVisibleCount(filteredRestaurants.length);
   };

   const isAnyFilterActive = priceFilter !== "All" || openOnly || selectedCategory !== "All";

   const clearAllFilters = () => {
      setPriceFilter("All");
      setOpenOnly(false);
      setSelectedCategory("All");
   };

   const getCategoryName = (categoryId: string) => {
      return categories.find((category) => category.id === categoryId)?.name || "Unknown";
   };

   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            Loading...
         </div>
      )
   }

   if (error) {
      return (
         <div className="min-h-screen flex items-center justify-center text-red-500">
            {error}
         </div>
      )
   }

   return (
      <main className="min-h-screen px-8 py-7">
         <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="mb-5">
               <h1 className="text-3xl font-bold text-gray-900">
                  Restaurants
               </h1>
               <p className="text-gray-500 mt-1 text-sm max-w-sm leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua.
               </p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 mb-6">
               <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                  Filter By:
               </span>

               {/* Open Now */}
               <label className="flex items-center gap-1.5 border border-gray-200 rounded px-2.5 py-1 cursor-pointer">
                  <input
                     type="checkbox"
                     checked={openOnly}
                     onChange={() => setOpenOnly(!openOnly)}
                     className="w-3 h-3 accent-gray-900"
                  />
                  <span className="text-xs text-gray-700">Open Now</span>
               </label>

               {/* Price */}
               <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="text-xs text-gray-700 border border-gray-200 rounded px-2 py-1 bg-white outline-none cursor-pointer"
               >
                  <option value="All">Price</option>
                  <option value="$">$ (Budget)</option>
                  <option value="$$">$$ (Moderate)</option>
                  <option value="$$$">$$$ (Expensive)</option>
                  <option value="$$$$">$$$$ (Luxury)</option>
               </select>

               {/* Categories */}
               <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-xs text-gray-700 border border-gray-200 rounded px-2 py-1 bg-white outline-none cursor-pointer"
               >
                  <option value="All">Categories</option>
                  {categories.map((category) => (
                     <option key={category.id} value={category.id}>
                        {category.name}
                     </option>
                  ))}
               </select>

               {/* Clear All */}
               <button
                  onClick={clearAllFilters}
                  disabled={!isAnyFilterActive}
                  className="ml-auto text-xs border border-gray-200 rounded px-3 py-1 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
               >
                  CLEAR ALL
               </button>
            </div>

            {/* Section Title */}
            <h2 className="text-lg font-bold text-gray-900 mb-4">
               All Restaurants
            </h2>

            {/* Restaurant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {visibleRestaurants.length === 0 ? (
                  <div className="col-span-full text-center text-gray-500 py-12">
                     No restaurants match your search 😢
                  </div>
               ) : (
                  visibleRestaurants.map((restaurant) => (
                     <RestaurantCard
                        key={restaurant.id}
                        id={restaurant.id}
                        name={restaurant.name}
                        image={restaurant.image}
                        category={getCategoryName(restaurant.categoryId)}
                        rating={restaurant.rating}
                        price={restaurant.priceRange}
                        isOpen={restaurant.isOpen}
                     />
                  ))
               )}
            </div>

            {/* Load More */}
            {hasMore && (
               <div className="flex justify-center mt-8">
                  <button
                     onClick={loadMore}
                     className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-sm font-medium px-12 py-2.5 rounded transition-colors cursor-pointer"
                  >
                     LOAD MORE
                  </button>
               </div>
            )}

         </div>
      </main>
   )
}

export default HomePage