import {useEffect, useState} from "react";
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
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
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
          <span>Title</span>
          <span>Year / Status</span>
          <span>Summary</span>
        </div>
        <div className="divide-y divide-border/60 text-xs">
          {items.map((item) => (
            <div
              key={item.title}
              className="grid grid-cols-[2fr,1fr,2fr] gap-3 px-4 py-3 hover:bg-background/60"
            >
              <div className="font-semibold text-foreground">{item.title}</div>
              <div className="text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground">
                {item.period}
              </div>
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

function App() {
  const career: TimelineItem[] = [
    {
      title: "Physical AI Researcher",
      subtitle: "Independent / Curiosity Rider",
      period: "2024 - Present",
      description:
        "Exploring embodied intelligence, robotics, and real-world learning systems that blend physical environments with AI agents.",
    },
  ];

  const projects: TimelineItem[] = [
    {
      title: "Curiosity Rider",
      period: "2024",
      description:
        "Gamified learning environment that treats knowledge as an open-world map, with streaks, XP, and quests for continuous curiosity.",
    },
  ];

  const papers: TimelineItem[] = [
    {
      title: "Physical AI for Experiential Learning (working title)",
      period: "In progress",
      description:
        "Drafting research around how physical environments and agentic AI can co-design learning trajectories and assessments.",
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
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Physical AI Researcher
              </p>
              <p className="mx-auto max-w-xl text-sm text-muted-foreground">
                Building gamified, embodied learning systems where AI agents and
                humans co-explore knowledge through streaks, XP, and real-world
                experiments.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                <Button>View Projects</Button>
                <Button variant="outline">Download CV</Button>
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
              <TimelineSection title="Career" items={career} />
              <TimelineSection title="Projects" items={projects} />
              <TimelineSection title="Research Papers" items={papers} />
              <PapersTable items={papers} />
            </div>
          </section>

          {/* Polymath Map (node / edge style) */}
          <section className="mt-4 space-y-4 rounded-2xl border border-border/80 bg-background/60 p-5 shadow-[0_8px_0_0_var(--tw-shadow-color)] shadow-primary/30">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-foreground">
                  Polymath Map
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Node-style view of your 999-course journey. Central hub
                  connects to major domains, with Automotive as the first
                  unlocked branch.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[0.7rem] text-muted-foreground">
                <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                  Target: 999 courses
                </span>
                <span className="rounded-full bg-accent/10 px-3 py-1 font-medium text-accent">
                  Current: Automotive cluster
                </span>
              </div>
            </div>

            {/* Simple React-Flow-like layout */}
            <div className="relative mt-4 overflow-x-auto pb-4">
              <div className="min-w-[640px]">
                {/* Central root node */}
                <div className="flex flex-col items-center">
                  <div className="rounded-full border border-primary/70 bg-primary/10 px-6 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary shadow-[0_4px_0_0_var(--tw-shadow-color)] shadow-primary/40">
                    Santhosh · Polymath Map
                  </div>

                  {/* Vertical connector */}
                  <div className="h-6 w-px bg-border" />

                  {/* First level domains */}
                  <div className="flex flex-wrap items-start justify-center gap-6">
                    {/* Engineering & Mechanics node */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="rounded-xl border border-border/70 bg-card/80 px-4 py-2 text-xs text-foreground shadow-sm">
                        <div className="font-semibold">
                          Engineering & Mechanics
                        </div>
                        <div className="mt-1 text-[0.7rem] text-muted-foreground">
                          Physical systems · Automobiles · Robotics
                        </div>
                      </div>
                      {/* Connector to child cluster */}
                      <div className="h-5 w-px bg-border" />
                      <div className="flex items-center gap-3">
                        <div className="h-px w-4 bg-border" />
                        <div className="rounded-lg border border-border/70 bg-background/80 px-3 py-2 text-[0.75rem] text-foreground shadow-xs">
                          <div className="font-semibold text-primary">
                            Automotive Systems
                          </div>
                          <div className="mt-1 text-[0.7rem] text-muted-foreground">
                            Intro to Automobiles · Car Electronics
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Physical AI node */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="rounded-xl border border-border/50 bg-card/60 px-4 py-2 text-xs text-foreground/90">
                        <div className="font-semibold">
                          Physical AI & Embodied Intelligence
                        </div>
                        <div className="mt-1 text-[0.7rem] text-muted-foreground">
                          Agents in real environments
                        </div>
                      </div>
                      <div className="h-5 w-px bg-border/70" />
                      <div className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[0.7rem] text-primary">
                        Planned domain
                      </div>
                    </div>

                    {/* Art & Design node */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="rounded-xl border border-border/50 bg-card/60 px-4 py-2 text-xs text-foreground/90">
                        <div className="font-semibold">
                          Art, Design & Visualization
                        </div>
                        <div className="mt-1 text-[0.7rem] text-muted-foreground">
                          Drawing · UI · Visual thinking
                        </div>
                      </div>
                      <div className="h-5 w-px bg-border/70" />
                      <div className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[0.7rem] text-primary">
                        Planned domain
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
