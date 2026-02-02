import api from "@/lib/axios";
import type { Idea } from "@/types";

export const fetchIdeas = async (limit?: number): Promise<Idea[]> => {
  const res = await api.get("/ideas", {
    params: limit ? { _limit: limit } : {},
  });
  return res.data;
};

export const fetchIdea = async (id: string): Promise<Idea> => {
  const res = await api.get(`/ideas/${id}`);
  return res.data;
};

export const createIdea = async (newIdea: {
  title: string;
  summary: string;
  description: string;
  tags: string[];
}): Promise<Idea> => {
  const res = await api.post("/ideas", {
    ...newIdea,
    createdAt: new Date().toISOString(),
  });
  return res.data;
};

export const deleteIdea = async (id: string): Promise<void> => {
  await api.delete(`/ideas/${id}`);
};

export const updateIdea = async (
  id: string,
  updatedIdea: {
    title?: string;
    summary?: string;
    description?: string;
    tags?: string[];
  },
): Promise<Idea> => {
  const res = await api.put(`/ideas/${id}`, updatedIdea);
  return res.data;
};
