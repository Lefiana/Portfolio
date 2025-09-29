import React from "react";
import { FaReact, FaPython, FaNodeJs, FaDatabase } from "react-icons/fa";
import { SiNextdotjs, SiFirebase, SiJavascript } from "react-icons/si";
import { JSX } from "react/jsx-runtime";

interface SkillItem {
  id: number;
  skill_name: string;
  category: string;
  priority: number;
}

interface SkillsSectionProps {
  skills: SkillItem[];
}

interface GroupedSkills {
  [categoryName: string]: SkillItem[];
}

// Icon mapping for popular skills
const skillIcons: Record<string, JSX.Element> = {
  React: <FaReact className="text-blue-500" />,
  "Next.js": <SiNextdotjs className="text-gray-900 dark:text-white" />,
  Python: <FaPython className="text-yellow-500" />,
  Firebase: <SiFirebase className="text-orange-500" />,
  "Express.js": <FaNodeJs className="text-green-600" />,
  SQL: <FaDatabase className="text-indigo-600" />,
  JavaScript: <SiJavascript className="text-yellow-400" />,
};

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const groupedSkills: GroupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as GroupedSkills);

  return (
    <div className="space-y-6">
      {Object.entries(groupedSkills).map(([category, skillsList]) => (
        <div key={category}>
          {/* Category Header */}
          <h3 className="text-lg font-bold mb-3 text-gray-700 dark:text-indigo-400 border-b pb-1 border-gray-300 dark:border-gray-700">
            {category}
          </h3>

          {/* Flex-wrap chip layout */}
          <ul className="flex flex-wrap gap-2">
            {skillsList.map((skill) => (
              <li key={skill.id} className="list-none">
                <div
                  className="flex items-center gap-2 rounded-lg bg-white/60 
                             border border-gray-200 shadow-sm px-4 py-2 
                             text-sm font-medium text-gray-900 dark:text-gray-900
                             hover:border-indigo-400 hover:bg-white/80 
                             transition cursor-pointer"
                >
                  {/* Icon (if available) */}
                  <div className="text-lg">
                    {skillIcons[skill.skill_name] || "< >"}
                  </div>
                  <span>{skill.skill_name}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SkillsSection;
