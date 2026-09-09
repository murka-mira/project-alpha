import { put, get } from "@vercel/blob";

const PATHNAME = "reviews.json";

export type Review = {
  id: string;
  name: string;
  business?: string;
  rating: number;
  review: string;
  createdAt: string;
};

export async function getReviews(): Promise<Review[]> {
  const blob = await get(PATHNAME, { access: "private", useCache: false });
  if (!blob) return [];

  const text = await new Response(blob.stream).text();
  return JSON.parse(text) as Review[];
}

export async function addReview(
  entry: Omit<Review, "id" | "createdAt">
): Promise<Review> {
  const reviews = await getReviews();
  const newReview: Review = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  reviews.unshift(newReview);

  await put(PATHNAME, JSON.stringify(reviews), {
    access: "private",
    addRandomSuffix: false,
    contentType: "application/json",
  });

  return newReview;
}
