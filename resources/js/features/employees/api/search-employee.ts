import { api } from "@/lib/api-client";
import { Employee } from "@/types/api";

export async function searchEmployees(query: string): Promise<Employee[]> {
  if (!query) return [];
  const response = await api.get(`/employees/search?keyword=${query}`);
  return response.data;
}
