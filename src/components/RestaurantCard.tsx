import { Link } from "react-router-dom"

type RestaurantCardProps = {
   id: string
   name: string
   image: string
   category: string
   rating: number
   price: string
   isOpen: boolean
}

function RestaurantCard({
   id,
   name,
   image,
   category,
   rating,
   price,
   isOpen,
}: RestaurantCardProps) {
   const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating));

   return (
      <div className="bg-white border border-gray-200 rounded overflow-hidden flex flex-col">
         {/* Image */}
         <img
            src={image}
            alt={name}
            className="w-full h-36 object-cover bg-gray-300"
         />

         {/* Body */}
         <div className="px-3 pt-2.5 pb-0 flex-1 flex flex-col">
            {/* Name */}
            <h2 className="text-sm font-bold text-gray-900 leading-snug min-h-[2.5rem]">
               {name}
            </h2>

            {/* Stars */}
            <div className="flex items-center gap-0.5 mt-1.5 mb-1">
               {stars.map((filled, i) => (
                  <span
                     key={i}
                     className={`text-sm ${filled ? "text-gray-900" : "text-gray-300"}`}
                  >
                     ★
                  </span>
               ))}
            </div>

            {/* Category · Price & Status */}
            <div className="flex items-center justify-between mb-2.5">
               <span className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
                  {category} · {price}
               </span>

               <span className={`flex items-center gap-1 text-[10px] font-bold ${isOpen ? "text-green-700" : "text-red-700"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${isOpen ? "bg-green-600" : "bg-red-600"}`} />
                  {isOpen ? "OPEN NOW" : "CLOSED"}
               </span>
            </div>
         </div>

         {/* Learn More Button */}
         <Link
            to={`/detail/${id}`}
            className="block bg-[#1a1a2e] text-white text-center text-xs font-semibold tracking-widest py-2.5 hover:bg-[#2d2d4e] transition-colors"
         >
            LEARN MORE
         </Link>
      </div>
   )
}

export default RestaurantCard