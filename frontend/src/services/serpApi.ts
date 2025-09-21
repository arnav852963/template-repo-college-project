import api from './api';

export interface SerpSearchParams {
  query: string;
  fromYear?: number;
  tillYear?: number;
  sortByDate?: boolean;
}

export interface SerpSearchResult {
  title: string;
  authors: string;
  publishedBy: string;
  link: string;
  year: number;
  inline_links: {
    cited_by: {
      total: number;
    };
  };
}

export interface SerpApiResponse {
  success: boolean;
  data: SerpSearchResult[];
  message: string;
}

export const searchScholarAPI = async (params: SerpSearchParams): Promise<SerpApiResponse> => {
  try {
    const response = await api.post('/papers/getResearchPaper', params);
    return response.data;
  } catch (error) {
    console.error('SERP API Error:', error);
    throw error;
  }
};

export const savePapersAPI = async (papers: SerpSearchResult[]): Promise<any> => {
  try {
    const response = await api.post('/papers/saveThesePapers', { arr: papers });
    return response.data;
  } catch (error) {
    console.error('Save Papers Error:', error);
    throw error;
  }
};
