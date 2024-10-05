"use server";

import { createSupabaseClient } from "../supabase/server";
import { CheckCircle2, LockIcon } from "lucide-react";
import Link from "next/link";

const currentDay = new Date().getTime();

export default async function Page() {
  const supabase = createSupabaseClient();

  const { data: exercises, error } = await supabase.from("exercises").select("*");

  const completedDays: Date[] = [];

  if (error) {
    console.error("Error fetching exercises", error);
    return <div>Error</div>;
  } else {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Advent Calendar</h1>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-6">
          {exercises.map((exercise, index) => {
            const exerciseTimestamp = Date.parse(exercise.date);
            return (
              <Link
                key={index}
                className={`card bg-blue-800 shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                  completedDays.includes(exercise.date) ? "border-2 border-green-500" : ""
                }`}
                href={`/exercises/${exercise.id}`}
                style={{
                  pointerEvents: exerciseTimestamp > currentDay ? "none" : "auto"
                }}
              >
                <div className="card-body items-center text-center gap-6 py-8 px-4">
                  {exerciseTimestamp <= currentDay ? (
                    completedDays.includes(exercise.date) && <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <LockIcon className="w-8 h-8 text-gray-500" />
                  )}
                  {exerciseTimestamp <= currentDay && (
                    <span className="text-xl font-bold text-blue-300">{exercise.total_rewards} ETH Pool</span>
                  )}
                  <span className="text-xl font-bold text-blue-300">
                    {new Date(exerciseTimestamp).toLocaleDateString("en-us", { day: "numeric", month: "long" })}
                  </span>
                  {completedDays.includes(exercise.date) && <p className="text-xs text-green-300 mt-1">Completed!</p>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
}
