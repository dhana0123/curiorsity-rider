import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import api from "./axiosConfig";

const coursesUrls = {
  courses: "/courses",
};

const keys = () => {
  return {
    get: ["courses"],
    update: ["courses", "update"],
  };
};

export const useCourses = () => {
  const {data, isLoading, error} = useQuery({
    queryKey: keys().get,
    queryFn: () => api.get(coursesUrls.courses),
  });
  return {data, isLoading, error};
};

export const useUpdateCourses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post(coursesUrls.courses),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: keys().get,
      });
    },
  });
};
