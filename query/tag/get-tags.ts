import axiosClient from "@/query/config/axios-config";
import { AllTagGroup } from "@/types/TagGroup";

export default async function getTags(): Promise<AllTagGroup> {
  const { data } = await axiosClient.get("/tags");
  return data;
}
