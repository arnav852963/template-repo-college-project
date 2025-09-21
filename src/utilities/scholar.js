import axios from "axios";
import { ApiError } from "./ApiError.js";
import dotenv from "dotenv"
dotenv.config({
  path:"./.env"
})

export const searchScholarAPI = async (query,fromYear=-1,tillYear=-1) => {


  try {
    const obj ={
      engine: "google_scholar",
      api_key: process.env.SERP_API_KEY
    }
    if(query) obj.q = query
    if(fromYear !== -1) obj.as_ylo = fromYear
    if(tillYear !== -1) obj.as_yhi = tillYear
    const response = await axios.get("https://serpapi.com/search", {
      params: obj

    });

    return response.data.organic_results || [];
  } catch (error) {
    console.error("SerpAPI error:", error.message);
    throw new ApiError(500, "Failed to fetch from SerpAPI");
  }
}

