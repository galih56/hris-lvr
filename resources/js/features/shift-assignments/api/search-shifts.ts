import { api } from "@/lib/api-client";
import { Shift } from "@/types/api";

export async function searchShifts(query: string): Promise<Shift[]> {
  if (!query) return [];
  const response = await api.get(`/shifts/search?keyword=${query}`);
  return response.data;
}
