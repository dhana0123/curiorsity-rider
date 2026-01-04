import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import Editor from "@monaco-editor/react";
import {
  useAdminCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
  useReplaceTopics,
  useBulkImportCourses,
  useAdminCoursesJson,
  type Course,
} from "@/api/admin";
import { X, Plus, Edit2, Trash2, Save, FileJson, FileText } from "lucide-react";

const DOMAINS = {
  Mechanical: "Mechanical Engineering",
  Electrical: "Electrical Engineering",
  Civil: "Civil & Architectural Engineering",
  Chemical: "Chemical, Bio & Materials Engineering",
  Computer: "Computer, IT & Emerging Tech Engineering",
  Health: "Health, Agriculture & Environmental Engineering",
  Nuclear: "Nuclear, Defense & Advanced Sciences",
};

const BRANCHES: Record<string, Record<string, string>> = {
  Mechanical: {
    Mechanical: "Mechanical Engineering",
    Automobile: "Automobile Engineering",
    Mechatronics: "Mechatronics Engineering",
    Robotics: "Robotics Engineering",
    Aeronautical: "Aeronautical Engineering",
    Aerospace: "Aerospace Engineering",
    Marine: "Marine Engineering",
    Industrial: "Industrial Engineering",
    Production: "Production Engineering",
    Thermal: "Thermal Engineering",
    Manufacturing: "Manufacturing Engineering",
    Tool: "Tool Engineering",
    Energy: "Energy Engineering",
    Mining: "Mining Engineering",
    Petroleum: "Petroleum Engineering",
    Fire_Safety: "Fire & Safety Engineering",
  },
  Electrical: {
    Electrical: "Electrical Engineering",
    Electronics_Communication: "Electronics & Communication Engineering (ECE)",
    Electronics_Telecommunication: "Electronics & Telecommunication Engineering",
    Electronics_Instrumentation: "Electronics & Instrumentation Engineering",
    Instrumentation: "Instrumentation Engineering",
    Electrical_Electronics: "Electrical & Electronics Engineering (EEE)",
    Biomedical_Instrumentation: "Biomedical Instrumentation",
    Avionics: "Avionics Engineering",
    Control_Systems: "Control Systems Engineering",
    Power_Systems: "Power Systems Engineering",
    Telecommunications: "Telecommunications Engineering",
    Microelectronics: "Microelectronics Engineering",
    VLSI_Design: "VLSI Design Engineering",
    Nanotechnology: "Nanotechnology Engineering",
  },
  Computer: {
    Computer_Science: "Computer Science Engineering (CSE)",
    Information_Technology: "Information Technology (IT)",
    Software_Engineering: "Software Engineering",
    Artificial_Intelligence: "Artificial Intelligence Engineering",
    Machine_Learning: "Machine Learning Engineering",
    Data_Science: "Data Science Engineering",
    Cybersecurity: "Cybersecurity Engineering",
    Cloud_Computing: "Cloud Computing Engineering",
    Blockchain: "Blockchain Engineering",
    Internet_of_Things: "Internet of Things (IoT) Engineering",
    Computer_Network: "Computer Network Engineering",
    Mobile_Computing: "Mobile Computing Engineering",
    Game_Development: "Game Development Engineering",
    AR_VR: "AR/VR Engineering",
    Computer_Systems: "Computer Systems Engineering",
  },
  Civil: {},
  Chemical: {},
  Health: {},
  Nuclear: {},
};

const Admin = () => {
  const [viewMode, setViewMode] = useState<"form" | "json">("form");
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseKey, setCourseKey] = useState("");
  const [courseName, setCourseName] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState("");
  const [jsonValue, setJsonValue] = useState("");

  const { data: coursesData, isLoading } = useAdminCourses(
    selectedDomain || undefined,
    selectedBranch || undefined
  );
  const { data: jsonData, isLoading: isLoadingJson } = useAdminCoursesJson();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();
  const replaceTopics = useReplaceTopics();
  const bulkImport = useBulkImportCourses();

  const courses = coursesData?.raw || [];

  useEffect(() => {
    if (jsonData && viewMode === "json") {
      setJsonValue(JSON.stringify(jsonData, null, 2));
    }
  }, [jsonData, viewMode]);

  const resetForm = () => {
    setEditingCourse(null);
    setCourseKey("");
    setCourseName("");
    setTopics([]);
    setNewTopic("");
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setCourseKey(course.courseKey);
    setCourseName(course.name);
    setTopics([...course.topics]);
  };

  const handleSave = async () => {
    if (!selectedDomain || !selectedBranch || !courseKey || !courseName) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      if (editingCourse) {
        await updateCourse.mutateAsync({
          id: editingCourse._id!,
          name: courseName,
          topics,
        });
      } else {
        await createCourse.mutateAsync({
          domain: selectedDomain,
          branch: selectedBranch,
          courseKey,
          name: courseName,
          topics,
        });
      }
      resetForm();
      alert("Course saved successfully!");
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleDelete = async (course: Course) => {
    if (!confirm(`Are you sure you want to delete "${course.name}"?`)) {
      return;
    }

    try {
      await deleteCourse.mutateAsync(course._id!);
      alert("Course deleted successfully!");
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleAddTopic = () => {
    if (newTopic.trim()) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const handleRemoveTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const handleUpdateTopic = (index: number, value: string) => {
    const updated = [...topics];
    updated[index] = value;
    setTopics(updated);
  };

  const handleJsonSave = async () => {
    try {
      const parsed = JSON.parse(jsonValue);
      await bulkImport.mutateAsync(parsed);
      alert("Courses imported successfully!");
      setViewMode("form");
    } catch (error: any) {
      alert(`Error: ${error.message || "Invalid JSON"}`);
    }
  };

  const filteredCourses = courses.filter(
    (c) =>
      (!selectedDomain || c.domain === selectedDomain) &&
      (!selectedBranch || c.branch === selectedBranch)
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Panel - Course Management</h1>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "form" ? "default" : "outline"}
              onClick={() => setViewMode("form")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Form View
            </Button>
            <Button
              variant={viewMode === "json" ? "default" : "outline"}
              onClick={() => setViewMode("json")}
            >
              <FileJson className="mr-2 h-4 w-4" />
              JSON Editor
            </Button>
          </div>
        </div>

        {viewMode === "form" ? (
          <div className="space-y-6">
            {/* Domain and Branch Selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Domain</label>
                <Select
                  value={selectedDomain}
                  onChange={(e) => {
                    setSelectedDomain(e.target.value);
                    setSelectedBranch("");
                  }}
                >
                  <option value="">Select Domain</option>
                  {Object.entries(DOMAINS).map(([key, name]) => (
                    <option key={key} value={key}>
                      {name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Branch</label>
                <Select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  disabled={!selectedDomain}
                >
                  <option value="">Select Branch</option>
                  {selectedDomain &&
                    Object.entries(BRANCHES[selectedDomain] || {}).map(
                      ([key, name]) => (
                        <option key={key} value={key}>
                          {name}
                        </option>
                      )
                    )}
                </Select>
              </div>
            </div>

            {/* Course Form */}
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold">
                {editingCourse ? "Edit Course" : "Add New Course"}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Course Key (URL-safe, use underscores)
                  </label>
                  <Input
                    value={courseKey}
                    onChange={(e) => setCourseKey(e.target.value)}
                    placeholder="e.g., Automotive_Engines"
                    disabled={!!editingCourse}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Course Name
                  </label>
                  <Input
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="e.g., Automotive Engines & Components"
                  />
                </div>
              </div>

              {/* Topics Management */}
              <div>
                <label className="block text-sm font-medium mb-2">Topics</label>
                <div className="space-y-2">
                  {topics.map((topic, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={topic}
                        onChange={(e) => handleUpdateTopic(index, e.target.value)}
                        placeholder="Topic name"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveTopic(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleAddTopic();
                      }}
                      placeholder="Add new topic"
                    />
                    <Button onClick={handleAddTopic}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Topic
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={createCourse.isPending || updateCourse.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {editingCourse ? "Update" : "Create"} Course
                </Button>
                {editingCourse && (
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            {/* Courses List */}
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Existing Courses</h2>
              {isLoading ? (
                <div>Loading...</div>
              ) : filteredCourses.length === 0 ? (
                <div className="text-muted-foreground">No courses found</div>
              ) : (
                <div className="space-y-2">
                  {filteredCourses.map((course) => (
                    <div
                      key={course._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{course.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {course.domain} / {course.branch} / {course.courseKey}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {course.topics.length} topic(s)
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(course)}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(course)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">JSON Editor</h2>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Edit courses in JSON format. Structure: {"{"} domain: {"{"} branch: {"{"} courseKey: {"{"} name, topics: [] {"}"} {"}"} {"}"} {"}"}
                </p>
              </div>
              <div className="border rounded-lg overflow-hidden" style={{ height: "600px" }}>
                {isLoadingJson ? (
                  <div className="flex items-center justify-center h-full">
                    <div>Loading JSON data...</div>
                  </div>
                ) : (
                  <Editor
                    height="100%"
                    defaultLanguage="json"
                    value={jsonValue}
                    onChange={(value) => setJsonValue(value || "")}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      wordWrap: "on",
                    }}
                  />
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={handleJsonSave} disabled={bulkImport.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  Save JSON
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (jsonData) {
                      setJsonValue(JSON.stringify(jsonData, null, 2));
                    }
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

