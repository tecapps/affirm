<script setup lang="ts">
const route = useRoute();
const placeId = route.params.id;

const PLACES = useFakePlaceDataDeletMe();
const place = PLACES.find((p) => p.id === Number(placeId));

// Throw 404 if place is not found
if (!place) {
  throw createError({
    statusCode: 404,
    statusMessage: "Place not found",
  });
}

// Mock reviews data
const REVIEWS = [
  {
    id: 1,
    author: "John Doe",
    rating: 5,
    comment: "Great place! The atmosphere is really cozy and the staff is friendly.",
    date: "2023-05-15",
  },
  {
    id: 2,
    author: "Jane Smith",
    rating: 4,
    comment: "Good selection of beers. Will definitely come back.",
    date: "2023-06-20",
  },
  {
    id: 3,
    author: "Bob Johnson",
    rating: 3,
    comment: "Average place. Nothing too special but decent.",
    date: "2023-07-10",
  },
];
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2 flex align-center flex-col items-center mt-8">
      <h1 class="text-3xl font-bold">{{ place.name }}</h1>
      <p>{{ place.description }}</p>
      <PlacesRatingDisplay :rating="place.rating" />
    </div>
    <div class="space-y-2">
      <h2 class="text-xl font-bold">Reviews</h2>
      <div class="space-y-4">
        <PlacesReviewCard v-for="review in REVIEWS" :key="review.id" :review="review" />
      </div>
    </div>
  </div>
</template>
