import Image from "next/image";
import { Inter } from "next/font/google";
import Results from "./components/Results";

const inter = Inter({ subsets: ["latin"] });

const API_KEY = process.env.API_KEY;

export default async function Home({ searchParams }: any) {
  if (!API_KEY) {
    throw new Error(
      "Missing API_KEY. Copy .env.example to .env.local and add your TMDB API key (https://www.themoviedb.org/settings/api), then restart the dev server."
    );
  }

  const genre = searchParams.genre || "fetchTrending";

  const res = await fetch(
    `https://api.themoviedb.org/3/${
      genre === "fetchTopRated" ? "movie/top_rated" : "trending/all/week"
    }?api_key=${API_KEY}`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch data from TMDB (${res.status}). Check that API_KEY in .env.local is valid.`
    );
  }

  const data = await res.json();

  const results = data.results;

  return (
    <div>
      <Results results={results} />
    </div>
  );
}
