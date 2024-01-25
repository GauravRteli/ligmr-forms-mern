import client from "./client";

export const admission = async (obj) => {
    try {
      const { data } = await client.post("/forms/applyForm", obj);
      return data;
    } catch (error) {
      const { response } = error;
      if (response?.data) {
        return response.data;
      }
      return { error: error.message || error };
    }
};