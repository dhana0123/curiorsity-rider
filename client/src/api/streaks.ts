import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import api from "./axiosConfig";

const streakUrls = {
  streaks: "/streaks",
  streaksByUser: "/streaks/user",
};

const keys = () => {
  return {
    get: ["streaks"],
    update: ["streaks", "update"],
  };
};

export const useStreaks = () => {
  const {data, isLoading, error} = useQuery({
    queryKey: keys().get,
    queryFn: () => api.get(streakUrls.streaks),
  });
  return {data, isLoading, error};
};

export const useUpdateSreaks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post(streakUrls.streaksByUser),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: keys().get,
      });
    },
  });
};
