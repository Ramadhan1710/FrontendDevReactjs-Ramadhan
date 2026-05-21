type Restaurant = {
   id: string
   name: string
   image: string
   categoryId: string
   rating: number
   priceRange: string
   isOpen: boolean
   openHour: string
   closeHour: string
   description: string
   city: string
   location: {
      lat: number
      lng: number
   }
   reviews: Review[]
}

type Review = {
   id: string
   userName: string
   userImage: string
   rating: number
   text: string
   createdAt: string
}

type Category = {
   id: string
   name: string
}

export type { Restaurant, Review, Category }