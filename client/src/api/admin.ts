import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./axiosConfig";

export interface Course {
  _id?: string;
  domain: string;
  branch: string;
  courseKey: string;
  name: string;
  topics: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseGrouped {
  [domain: string]: {
    [branch: string]: Course[];
  };
}

const adminUrls = {
  courses: "/admin/courses",
  courseById: (id: string) => `/admin/courses/${id}`,
  coursesJson: "/admin/courses/json",
  coursesBulk: "/admin/courses/bulk",
  courseTopics: (id: string) => `/admin/courses/${id}/topics`,
  courseTopicDelete: (id: string, index: number) => `/admin/courses/${id}/topics/${index}`,
};

const keys = () => {
  return {
    getAll: ["admin", "courses"],
    getByDomain: (domain?: string, branch?: string) => ["admin", "courses", domain, branch],
    getById: (id: string) => ["admin", "courses", id],
    getJson: ["admin", "courses", "json"],
  };
};

// Get all courses
export const useAdminCourses = (domain?: string, branch?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: keys().getByDomain(domain, branch),
    queryFn: () => {
      const params = new URLSearchParams();
      if (domain) params.append("domain", domain);
      if (branch) params.append("branch", branch);
      return api.get<{ courses: CourseGrouped; raw: Course[] }>(
        `${adminUrls.courses}?${params.toString()}`
      );
    },
  });
  return { data: data?.data, isLoading, error };
};

// Get single course
export const useAdminCourse = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: keys().getById(id),
    queryFn: () => api.get<Course>(adminUrls.courseById(id)),
    enabled: !!id,
  });
  return { data: data?.data, isLoading, error };
};

// Get courses as JSON
export const useAdminCoursesJson = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: keys().getJson,
    queryFn: () => api.get(adminUrls.coursesJson),
  });
  return { data: data?.data, isLoading, error };
};

// Create course mutation
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (course: Omit<Course, "_id" | "createdAt" | "updatedAt">) =>
      api.post<Course>(adminUrls.courses, course),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys().getAll });
    },
  });
};

// Update course mutation
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...course }: Partial<Course> & { id: string }) =>
      api.put<Course>(adminUrls.courseById(id), course),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys().getAll });
    },
  });
};

// Delete course mutation
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(adminUrls.courseById(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys().getAll });
    },
  });
};

// Replace topics mutation
export const useReplaceTopics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, topics }: { id: string; topics: string[] }) =>
      api.put<Course>(adminUrls.courseTopics(id), { topics }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys().getAll });
    },
  });
};

// Bulk import mutation
export const useBulkImportCourses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courses: any) =>
      api.post(adminUrls.coursesBulk, { courses }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys().getAll });
    },
  });
};

