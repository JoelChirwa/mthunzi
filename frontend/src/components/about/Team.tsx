"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { buildApiUrl } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  position: number;
  imageUrl: string;
};

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTeam() {
      try {
        const response = await fetch(buildApiUrl("/api/team"));
        if (!response.ok) {
          throw new Error(`Backend fetch failed with status ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setTeamMembers(data);
          setError("");
        }
      } catch (backendError) {
        console.warn("Backend team fetch failed, falling back to local route.", backendError);

        try {
          const fallbackResponse = await fetch("/api/team");
          if (!fallbackResponse.ok) {
            throw new Error(`Local fetch failed with status ${fallbackResponse.status}`);
          }

          const fallbackData = await fallbackResponse.json();
          setTeamMembers(Array.isArray(fallbackData) ? fallbackData : []);
          setError("The backend is unavailable. Showing local team data if available.");
        } catch (fallbackError) {
          console.error("Failed to load team members from both backend and local fallback.", fallbackError);
          setTeamMembers([]);
          setError("Unable to load team members at this time.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadTeam();
  }, []);

  return (
    <section className="w-full bg-white py-16 sm:py-24" id="team">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            MEET OUR TEAM
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-8 text-slate-600">
            The people behind Mthunzi Trust are committed to community-led climate justice, local empowerment, and long-term impact.
          </p>
        </div>

        {error && (
          <div className="col-span-full rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {loading ? (
            <div className="col-span-full rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
              Loading team members...
            </div>
          ) : teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <div key={member.id} className="flex flex-col items-center text-center rounded-[28px] px-6 py-8 transition hover:-translate-y-1">
                <div className="mb-6 h-64 w-64 overflow-hidden rounded-[28px]">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    width={320}
                    height={320}
                    quality={90}
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2 truncate">{member.name}</h3>
                <p className="text-slate-500 text-sm mb-1 truncate">{member.role}</p>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
              No team profiles are available yet. Check back soon.
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Button asChild variant="default" className="bg-green-600 hover:bg-green-700 text-white">
            <Link href="/volunteer">Work with Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
