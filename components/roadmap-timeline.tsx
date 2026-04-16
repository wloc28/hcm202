"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

import type { RoadmapData, RoadmapEntry } from "@/data/hcm-roadmap";

type RoadmapTimelineProps = {
  entries: RoadmapData;
};

export function RoadmapTimeline({ entries }: RoadmapTimelineProps) {
  const { currentLanguage, getLocalizedContent, t } = useLanguage();
  const [activeId, setActiveId] = useState(entries[0]?.id ?? "");

  const activeEntry = entries.find((entry) => entry.id === activeId);

  if (!entries.length) {
    return null;
  }

  const renderLabel = (entry: RoadmapEntry) => {
    return {
      period: getLocalizedContent(entry.period),
      stage: getLocalizedContent(entry.stage),
    };
  };

  return (
    <section className="mt-20">
      {/* Header */}
      <div className="mx-auto mb-12 max-w-3xl text-center animate-fade-in-up">
        <h2 className="mb-4 text-4xl font-bold bg-gradient-to-r from-red-700 via-amber-500 to-yellow-400 bg-clip-text text-transparent dark:from-yellow-200 dark:via-orange-300 dark:to-red-200">
          {t("home.roadmapTitle")}
        </h2>
        <p className="text-lg text-muted-foreground">
          {t("home.roadmapDescription")}
        </p>
        <p className="text-sm text-muted-foreground/70 mt-3">
          {t("home.roadmapHint")}
        </p>
      </div>

      {/* Timeline */}
      <div className="relative rounded-3xl border border-red-200/70 bg-gradient-to-br from-red-50 via-amber-50 to-white shadow-xl dark:border-red-900/50 dark:from-red-950/50 dark:via-red-900/40 dark:to-amber-950/30">
        <div className="overflow-x-auto pb-8">
          <div className="relative flex min-w-max gap-12 px-8 py-12">
            <div className="pointer-events-none absolute left-8 right-8 top-1/2 h-px bg-gradient-to-r from-red-500 via-amber-400 to-yellow-400 dark:from-red-500/60 dark:via-amber-400/60 dark:to-yellow-400/60"></div>
            {entries.map((entry) => {
              const { period, stage } = renderLabel(entry);
              const isActive = entry.id === activeId;

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setActiveId(entry.id)}
                  onMouseEnter={() => setActiveId(entry.id)}
                  className="relative z-10 flex flex-col items-center gap-3 outline-none group"
                  aria-pressed={isActive}
                >
                  <span
                    className={cn(
                      "text-sm font-medium text-red-900/70 transition-colors duration-300 dark:text-yellow-200/70",
                      isActive &&
                        "text-red-700 dark:text-yellow-200 drop-shadow-sm"
                    )}
                  >
                    {period}
                  </span>
                  <span
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full border-2 border-red-300/70 bg-white/80 backdrop-blur transition-all duration-300 group-focus-visible:ring-4 group-focus-visible:ring-red-400/50 dark:bg-red-950/70",
                      isActive
                        ? "scale-110 border-red-500/90 shadow-lg shadow-red-500/30"
                        : "hover:scale-105"
                    )}
                  >
                    <span
                      className={cn(
                        "h-3 w-3 rounded-full bg-red-400 transition-all duration-300",
                        isActive
                          ? "h-4 w-4 bg-red-500 shadow shadow-red-400/60"
                          : "group-hover:bg-red-500"
                      )}
                    ></span>
                  </span>
                  <span
                    className={cn(
                      "w-40 text-center text-xs font-semibold uppercase tracking-wide text-red-900/70 transition-colors duration-300 dark:text-yellow-200/70",
                      isActive && "text-red-700 dark:text-yellow-200"
                    )}
                  >
                    {stage}
                  </span>
                  {/* Overlay QR/Image khi hover */}
                  {entry.id === "1945-independence" && (
                    <div className="absolute top-full  left-1/2 -translate-x-1/2 hidden group-hover:block z-[9999]">
                      <div className="rounded-lg shadow-lg bg-white dark:bg-gray-900 border">
                        <img
                          src="/assets/roadmap-images/2-9-1945(2).jpg"
                          alt="QR Code"
                        />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Entry Content */}
        {activeEntry && (
          <div className="border-t border-red-200/60 bg-white/85 px-8 py-10 backdrop-blur dark:border-red-900/50 dark:bg-red-950/30">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl bg-gradient-to-br from-red-100/80 via-amber-50 to-white p-6 shadow-md dark:from-red-900/40 dark:via-red-900/30 dark:to-amber-950/40">
                <h3 className="mb-2 text-base font-semibold uppercase tracking-wide text-red-700 dark:text-yellow-200">
                  {t("home.roadmapEventLabel")}
                </h3>
                <ReactMarkdown
                  components={{
                    img: ({ node, ...props }) => (
                      <img
                        className="mx-auto my-4 rounded-lg shadow-lg h-[400px] object-contain"
                        {...props}
                      />
                    ),
                  }}
                >
                  {activeEntry.event[currentLanguage]}
                </ReactMarkdown>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-amber-100/80 via-yellow-50 to-white p-6 shadow-md dark:from-amber-900/40 dark:via-red-900/30 dark:to-red-950/40">
                <h3 className="mb-2 text-base font-semibold uppercase tracking-wide text-red-700 dark:text-yellow-200">
                  {t("home.roadmapImpactLabel")}
                </h3>
                <ReactMarkdown
                  components={{
                    img: ({ node, ...props }) => (
                      <img
                        className="mx-auto my-4 rounded-lg shadow-lg max-w-full h-auto bg-transparent"
                        {...props}
                      />
                    ),
                  }}
                >
                  {activeEntry.significance[currentLanguage]}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
