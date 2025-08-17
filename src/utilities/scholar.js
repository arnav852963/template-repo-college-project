import axios from "axios";
import { ApiError } from "./ApiError.js";
import dotenv from "dotenv"
dotenv.config({
  path:"./.env"
})

export const searchScholarAPI = async (query) => {
  if (!query) throw new ApiError(400, "Search query required");

  try {
    const response = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google_scholar",
        q: query,
        api_key: process.env.SERP_API_KEY
      }

    });

    return response.data.organic_results || [];
  } catch (error) {
    console.error("SerpAPI error:", error.message);
    throw new ApiError(500, "Failed to fetch from SerpAPI");
  }
}

