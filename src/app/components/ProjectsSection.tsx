// app/components/ProjectsSection.tsx

"use client";

import React from "react";

interface ProjectItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  technologies: string[];
  github_url: string;
  live_url: string;
}

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
    {projects.map((project) => (
      <div
        key={project.id}
        className="relative group rounded-2xl overflow-hidden shadow-xl border border-gray-300"
      >
        {/* Background Image */}
        <img
          src={project.image_url}
          alt={project.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Front content (Title + Techs) */}
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 transition-opacity duration-300 group-hover:opacity-0">
          <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, i) => (
              <span
                key={i}
                className="text-xs font-medium bg-white/70 text-gray-900 px-2 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col p-6 justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {project.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {project.description}
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-4">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                GitHub →
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                Live Demo →
              </a>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ProjectsSection;
