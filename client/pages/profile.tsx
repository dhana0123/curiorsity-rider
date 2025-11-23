import {useEffect, useState, useMemo} from "react";
import {Button} from "@/components/ui/button";

type UserStats = {
  name: string;
  streak: number;
  longestStreak: number;
  xp: number;
};

function StreakWidget() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/user/stats");
        if (!res.ok) throw new Error("Failed to load stats");
        const data = (await res.json()) as UserStats;
        setStats(data);
      } catch {
        // Fallback placeholder if backend is not ready yet
        setStats({
          name: "Santhosh Naik",
          streak: 1,
          longestStreak: 2,
          xp: 10,
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="rounded-xl border border-border/70 bg-white/95 px-4 py-3 text-xs shadow-[0_4px_0_0_var(--tw-shadow-color)] shadow-primary/30 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">
            Streaks & XP
          </span>
          <span className="text-sm font-semibold text-foreground">
            {stats?.name ?? "Santhosh Naik"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[0.7rem] text-muted-foreground">Streak</span>
            <span className="text-base font-bold text-primary">
              {loading ? "-" : stats?.streak ?? 0} 🔥
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[0.7rem] text-muted-foreground">XP</span>
            <span className="text-base font-bold text-accent">
              {loading ? "-" : stats?.xp ?? 0}
            </span>
          </div>
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-[0.7rem] text-muted-foreground">Longest</span>
            <span className="text-base font-semibold text-foreground">
              {loading ? "-" : stats?.longestStreak ?? 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

type TimelineItem = {
  title: string;
  subtitle?: string;
  period: string;
  description: string;
  link?: string;
};

function TimelineSection({
  title,
  items,
}: {
  title: string;
  items: TimelineItem[];
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="space-y-6 border-l border-border pl-6">
        {items.map((item) => (
          <div key={item.title} className="relative space-y-1 pt-1">
            <span className="absolute -left-[8px] top-2 block size-3 rounded-full bg-primary shadow-[0_0_12px_rgba(255,0,255,0.8)]" />
            <div className="text-xs ml-5 font-medium uppercase tracking-wide text-muted-foreground">
              {item.period}
            </div>
            <div className="text-sm font-semibold text-foreground">
              {item.title}
            </div>
            {item.subtitle ? (
              <div className="text-xs text-muted-foreground">
                {item.subtitle}
              </div>
            ) : null}
            <p className="text-xs leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PapersTable({items}: {items: TimelineItem[]}) {
  return (
    <section className="mt-8 space-y-3">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        Research Papers
      </h2>
      <div className="overflow-hidden rounded-xl border border-border/70 bg-card/70 backdrop-blur">
        <div className="grid grid-cols-[2fr,1fr,2fr] gap-3 border-b border-border/60 bg-background/60 px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <span>Research on Embodied ai data standardization</span>
          <span>2025 / published</span>
        </div>
        <div className="divide-y divide-border/60 text-xs">
          {items.map((item) => (
            <div
              key={item.title}
              className="grid grid-cols-[2fr,1fr,2fr] gap-3 px-4 py-3 hover:bg-background/60"
            >
              <div
                className="font-semibold text-foreground"
                onClick={() => window.open(item.link, "_blank")}
              >
                {item.title}
              </div>
              <Button
                variant="outline"
                className="mr-auto hover:underline"
                onClick={() => window.open(item.link, "_blank")}
              >
                view
              </Button>
              {/* <div className="text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground">
                {item.period}
              </div> */}
              <div className="text-[0.75rem] text-muted-foreground">
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Import the automobile courses directly for now
// const automobile_courses = {
//   "intro-to-cars": {
//     id: "intro-to-cars",
//     title: "Introduction to Automobiles",
//     description: "Learn the basics of how cars work",
//     modules: [
//       {
//         id: "module-1",
//         title: "Car Basics",
//         lessons: [
//           {id: "lesson-1", title: "How Engines Work", duration: "10 min"},
//           {id: "lesson-2", title: "Transmission Systems", duration: "12 min"},
//         ],
//       },
//       {
//         id: "module-2",
//         title: "Car Maintenance",
//         lessons: [
//           {id: "lesson-3", title: "Oil Change Basics", duration: "8 min"},
//           {id: "lesson-4", title: "Tire Care", duration: "10 min"},
//         ],
//       },
//     ],
//   },
//   "car-electronics": {
//     id: "car-electronics",
//     title: "Car Electronics",
//     description: "Understanding modern car electronics",
//     modules: [
//       {
//         id: "module-1",
//         title: "Electrical Systems",
//         lessons: [
//           {id: "lesson-1", title: "Battery Fundamentals", duration: "15 min"},
//           {id: "lesson-2", title: "Wiring Basics", duration: "12 min"},
//         ],
//       },
//     ],
//   },
// };

function Profile() {
  const career: TimelineItem[] = [
    {
      title: "Bellu.ai",
      // subtitle: "Independent / Bellu.ai",
      period: "2025 - Present",
      description:
        "Exploring embodied intelligence, robotics, and real-world learning systems that blend physical environments with AI agents.",
    },
  ];

  const projects: TimelineItem[] = [
    {
      title: "Research on Embodied ai data standardization",
      period: "2025",
      description: `Embodied AI (EAI) is key to achieving AGI, enabling agents to learn through real-world physical interaction.
        This study highlights the need for standardized multimodal data, robust database design, and ethical frameworks to bridge the Sim2Real gap safely.`,
    },
  ];

  const papers: TimelineItem[] = [
    {
      title:
        "Multimodal Data Standardization and Management for Generalizable Embodied AI",
      period: "2025 / published",
      description: `Embodied AI (EAI) is key to achieving AGI, enabling agents to learn through real-world physical interaction.
        This study highlights the need for standardized multimodal data, robust database design, and ethical frameworks to bridge the Sim2Real gap safely.`,
      link: "https://www.techrxiv.org/users/998761/articles/1360379-the-architecture-of-embodiment-multimodal-data-standardization-and-management-for-generalizable-embodied-ai",
    },
  ];

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex h-full max-w-5xl flex-col px-4 py-6 sm:px-8">
        {/* Top bar with streaks */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Profile
            </span>
            <span className="text-sm font-semibold text-foreground">
              Santhosh Naik
            </span>
          </div>
          <StreakWidget />
        </header>

        {/* Main content */}
        <main className="flex flex-1 flex-col gap-10 pb-10">
          {/* Centered profile hero */}
          <section className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="space-y-4">
              <div className="mx-auto flex size-24 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-background shadow-[0_6px_0_0_var(--tw-shadow-color)] shadow-primary/40">
                <img
                  src="/profile.jpg"
                  alt="Santhosh Naik"
                  className="size-full object-cover"
                />
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-foreground">
                Santhosh Naik
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                Building the future of learning through AI and interactive
                experiences
              </p>
              <div className="flex justify-center space-x-4">
                <a
                  href="https://github.com/dhana0123"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://x.com/santhoshdhana7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Twitter"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/santosh-bellu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
              <p className="mx-auto max-w-xl text-sm text-muted-foreground">
                Building gamified, embodied learning systems where AI agents and
                humans co-explore knowledge through streaks, XP, and real-world
                experiments.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                <Button>Download CV</Button>
                {/* <Button variant="outline">Download CV</Button> */}
              </div>
            </div>
          </section>

          {/* Timeline sections */}
          <section className="grid gap-10 md:grid-cols-3">
            <div className="md:col-span-1">
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                Journey
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                A high-level view of your career, projects, and research as a
                progression of experiments and quests.
              </p>
            </div>
            <div className="md:col-span-2 space-y-8">
              <TimelineSection
                title="Physical AI Researcher & Founder of bellu.ai"
                items={career}
              />
              <TimelineSection title="Research" items={projects} />
              <TimelineSection title="Research Engineer" items={papers} />
              <PapersTable items={papers} />
            </div>
          </section>

          {/* Polymath Map with React Flow */}
        </main>
      </div>
    </div>
  );
}

export default Profile;

// <section className="mt-4 space-y-4">
//   <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
//     <div>
//       <h2 className="text-base font-semibold tracking-tight text-foreground">
//         Polymath Map
//       </h2>
//       <p className="mt-1 text-xs text-muted-foreground">
//         Interactive map of your 999-course journey. Central hub connects to
//         major domains, with Automotive as the first unlocked branch. Drag to
//         pan, scroll to zoom.
//       </p>
//     </div>
//     <div className="flex flex-wrap items-center gap-2 text-[0.7rem] text-muted-foreground">
//       <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
//         Target: 999 courses
//       </span>
//       <span className="rounded-full bg-accent/10 px-3 py-1 font-medium text-accent">
//         Current: Automotive cluster
//       </span>
//     </div>
//   </div>

//   {/* React Flow Map */}
//   <div className="rounded-xl border border-border/50 bg-background/50 p-1">
//     <PolymathMap
//       courses={{
//         engineering: {
//           title: "Engineering & Mechanics",
//           description: "Mechanical and automotive engineering principles",
//           courses: {
//             automotive: {
//               title: "Automotive Systems",
//               description: "Fundamentals of automobile engineering and design",
//               courses: automobile_courses,
//             },
//             mechanical: {
//               title: "Mechanical Engineering",
//               description: "Core mechanical engineering concepts",
//               locked: true,
//             },
//           },
//         },
//         ai: {
//           title: "AI & Machine Learning",
//           description: "Artificial intelligence and data science",
//           locked: true,
//         },
//         design: {
//           title: "Design & Visualization",
//           description: "Creative design and 3D visualization",
//           locked: true,
//         },
//         business: {
//           title: "Business & Entrepreneurship",
//           description: "Startup and business management",
//           locked: true,
//         },
//         science: {
//           title: "Science & Research",
//           description: "Scientific research methodologies",
//           locked: true,
//         },
//       }}
//     />
//   </div>
// </section>;
