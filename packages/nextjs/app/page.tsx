"use client";

import { CheckCircle2, LockIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IExercise } from "~~/types/IExercise";

const currentDay = new Date().getTime();

export default function Page() {
  const [exercises, setExercises] = useState<IExercise[]>([]);

  const completedDays: Date[] = [];

  useEffect(() => {
    (async () => {
      const result = await fetch("/api/exercises/", {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      });

      const { exercises } = await result.json();
      setExercises(exercises);
    })();
  }, []);

  if (exercises.length == 0) {
    return <span className="loading loading-bars loading-lg"></span>;
  } else {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Advent Calendar</h1>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-6">
          {exercises.map((exercise, index) => {
            const exerciseTimestamp = Date.parse(exercise.date.toString());
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
