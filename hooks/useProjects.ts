import { useQuery } from "@tanstack/react-query";

export  const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error("Gagal mengambil data proyek");
      }
      return response.json();
    },
  });
};
