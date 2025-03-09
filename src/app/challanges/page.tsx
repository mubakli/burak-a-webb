"use client";
import { useState } from "react";
import { CheckCircle, Circle } from "lucide-react";

const challenges = [
  {
    id: 1,
    title: "Develop Virtual Trade System",
    difficulty: "Hard",
    completed: false,
  },
  {
    id: 2,
    title: "Set Up My Own Cloud Server",
    difficulty: "Very Hard",
    completed: false,
  },
  {
    id: 3,
    title: "Improve Website UI",
    difficulty: "Medium",
    completed: false,
  },
  {
    id: 4,
    title: "Optimize Backend Performance",
    difficulty: "Hard",
    completed: false,
  },
  {
    id: 5,
    title: "Integrate Real-time Stock Prices",
    difficulty: "Very Hard",
    completed: false,
  },
];

export default function ChallengeList() {
  const [challengeList, setChallengeList] = useState(challenges);

  const toggleCompletion = (id: number) => {
    setChallengeList((prev) =>
      prev.map((challenge) =>
        challenge.id === id
          ? { ...challenge, completed: !challenge.completed }
          : challenge
      )
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Challenges</h1>
      <div className="space-y-4">
        {challengeList.map((challenge) => (
          <div
            key={challenge.id}
            className="flex justify-between items-center p-4 border rounded-lg shadow bg-black"
          >
            <button
              onClick={() => toggleCompletion(challenge.id)}
              className="p-2"
            >
              {challenge.completed ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : (
                <Circle className="text-gray-400" size={24} />
              )}
            </button>
            <div>
              <h2 className="text-lg font-semibold">{challenge.title}</h2>
              <span className="bg-gray-800 text-white-800 text-sm px-2 py-1 rounded mt-1 inline-block">
                {challenge.difficulty}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
