"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

// --- 1. Define Interfaces for Type Safety ---
interface PersonalInfo {
  name: string;
  tagline: string;
  long_bio: string;
  photo_url: string;
  contact_email: string;
  linkedin_url: string;
  github_url: string;
  resume_url: string;
}

interface Item {
  id: number;
  title: string;
}

// Minimal structure for our generic lists
interface CertItem extends Item { issuer: string; date: string; credential_url: string, image_url: string; }
interface ProjectItem extends Item { description: string; github_url: string; live_url: string; technologies: string[]; is_featured: boolean; priority: number, image_url: string; }
interface SkillItem extends Item { skill_name: string; category: string; priority: number; }

// Initial State Objects
const initialPersonalInfoState: PersonalInfo = { name: '', tagline: '', long_bio: '', photo_url: '', contact_email: '', linkedin_url: '', github_url: '', resume_url: '' };
const initialNewCertState: CertItem = { id: 0, title: "", issuer: "", date: "", credential_url: "", image_url: ""};
const initialNewProjectState: ProjectItem = { id: 0, title: "", description: "", technologies: [], github_url: "", live_url: "", is_featured: false, priority: 0, image_url: "" };
const initialNewSkillState: SkillItem = { id: 0, title: "", skill_name: "", category: "", priority: 0 };

// =============================================================================================

export default function AdminDashboard() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(initialPersonalInfoState);
  const [certs, setCerts] = useState<CertItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);

  const [newCert, setNewCert] = useState(initialNewCertState);
  const [newProject, setNewProject] = useState(initialNewProjectState);
  const [newSkill, setNewSkill] = useState(initialNewSkillState);

  const [rawTechnologiesInput, setRawTechnologiesInput] = useState<string>('');

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // --- Utility to get token and set auth headers ---
  const getAuthHeaders = useCallback(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/admin/login"); 
      return null;
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, [router]);

// --- Initial Data Fetch (Runs once on component mount) ---
useEffect(() => {
    const authHeaders = getAuthHeaders();
    if (!authHeaders) return;

    async function fetchData() {
      try {
        const infoPromise = fetch("/api/v1/info");
        const certsPromise = fetch("/api/v1/achievements");
        const projectsPromise = fetch("/api/v1/projects");
        const skillsPromise = fetch("/api/v1/skills");

        const [infoRes, certsRes, projectsRes, skillsRes] = await Promise.all([
          infoPromise, certsPromise, projectsPromise, skillsPromise
        ]);

        const info = await infoRes.json();
        const certsData = await certsRes.json();
        const projectsData = await projectsRes.json();
        const skillsData = await skillsRes.json();

        // Handle single row returns: info
        const infoData = Array.isArray(info) && info.length > 0 ? info[0] : info; 
        
        // ✨ THE FIX: Normalize the fetched data before setting the state
        const normalizedInfo: PersonalInfo = {
            ...initialPersonalInfoState,
            ...infoData, 
           
            name: infoData.name || '',
            tagline: infoData.tagline || '',
            long_bio: infoData.long_bio || '',
            photo_url: infoData.photo_url || '',
            contact_email: infoData.contact_email || '',
            linkedin_url: infoData.linkedin_url || '',
            github_url: infoData.github_url || '',
            resume_url: infoData.resume_url || '',
        };

        const normalizedCerts = certsData.map((cert: CertItem) => ({
            ...cert,
            image_url: cert.image_url || '',  
        }));

        const normalizedProjects = projectsData.map((project: ProjectItem) => ({
          ...project,
          image_url: project.image_url || '',  
        }));
                                  
        setPersonalInfo(normalizedInfo); 
        setCerts(normalizedCerts);
        setProjects(normalizedProjects);
        setSkills(skillsData);
        
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [getAuthHeaders]);

  // =============================================================================================
  // === CRUD Handlers ===
  // =============================================================================================

  const handleUpdatePersonal = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    const res = await fetch("/api/admin/v1/info", { 
      method: "PUT",
      headers,
      body: JSON.stringify(personalInfo),
    });

    res.ok ? alert("Personal info updated successfully!") : alert("Failed to update personal info");
  };

  const handleAddCert = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;
    
    const res = await fetch("/api/admin/v1/achievements", { 
      method: "POST",
      headers,
      body: JSON.stringify(newCert),
    });

    const data = await res.json();
    if (res.ok) {
      setCerts(prev => [...prev, { 
  ...newCert, 
      id: data.achievementId || Date.now(), 
      image_url: newCert.image_url  
    } as CertItem]);
      setNewCert(initialNewCertState);
    } else {
        alert("Failed to add certificate: " + (data.error || res.statusText));
    }
  };

  const handleDeleteCert = async (id: number) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    const res = await fetch(`/api/admin/v1/achievements/${id}`, { method: "DELETE", headers });

    res.ok ? setCerts(prev => prev.filter(c => c.id !== id)) : alert("Failed to delete certificate.");
  };
  
  const handleAddProject = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    const splitTechnologies = rawTechnologiesInput.split(',').map(tech => tech.trim()).filter(tech => tech);

    const projectData = { 
        ...newProject, 
        technologies: splitTechnologies,
    };

    const res = await fetch("/api/admin/v1/projects", { 
      method: "POST", headers, body: JSON.stringify(projectData),
    });

    const data = await res.json();
    if (res.ok) {
        setProjects(prev => [...prev, { 
          ...projectData, 
          id: data.projectId || Date.now(), 
          image_url: newProject.image_url  
        } as ProjectItem]);
        setNewProject(initialNewProjectState);
        setRawTechnologiesInput('');
    } else {
        alert("Failed to add project: " + (data.error || res.statusText));
    }
  };
  
  const handleDeleteProject = async (id: number) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    const res = await fetch(`/api/admin/v1/projects/${id}`, { method: "DELETE", headers });

    res.ok ? setProjects(prev => prev.filter(p => p.id !== id)) : alert("Failed to delete project.");
  };

  const handleAddSkill = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    const res = await fetch("/api/admin/v1/skills", { 
      method: "POST", headers, body: JSON.stringify(newSkill),
    });

    const data = await res.json();
    if (res.ok) {
        setSkills(prev => [...prev, { ...newSkill, id: data.skillId || Date.now() } as SkillItem]);
        setNewSkill(initialNewSkillState);
    } else {
        alert("Failed to add skill: " + (data.error || res.statusText));
    }
  };

  const handleDeleteSkill = async (id: number) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    const res = await fetch(`/api/admin/v1/skills/${id}`, { method: "DELETE", headers });

    res.ok ? setSkills(prev => prev.filter(s => s.id !== id)) : alert("Failed to delete skill.");
  };

  if (loading) return <div className="p-10 text-center text-xl">Loading Admin Data...</div>;

  // =============================================================================================
  // === UI & Rendering ===
  // =============================================================================================

  const inputClass = "border border-gray-300 p-2 w-full mb-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md";
  const buttonClass = "bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition duration-150";
  const sectionClass = "mb-8 p-6 border border-gray-200 rounded-xl shadow-lg bg-white";

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 border-b pb-4">Portfolio Admin Dashboard</h1>

      {/* 1. PERSONAL INFO SECTION (PUT) */}
      <section className={sectionClass}>
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">1. Personal Info (Update)</h2>
        <div className="grid md:grid-cols-2 gap-4 text-gray-900 font-bold">
          <div>
            <label htmlFor="name" className="sr-only">Name</label>
            <input id="name" type="text" placeholder="Name" value={personalInfo.name} onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label htmlFor="tagline" className="sr-only">Tagline</label>
            <input id="tagline" type="text" placeholder="Tagline" value={personalInfo.tagline} onChange={(e) => setPersonalInfo({ ...personalInfo, tagline: e.target.value })} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="long_bio" className="sr-only">Long Bio</label>
            <textarea id="long_bio" placeholder="Long Bio" value={personalInfo.long_bio} onChange={(e) => setPersonalInfo({ ...personalInfo, long_bio: e.target.value })} className={`${inputClass} h-24`} />
          </div>
          <div>
            <label htmlFor="photo_url" className="sr-only">Photo URL</label>
            <input id="photo_url" type="text" placeholder="Photo URL" value={personalInfo.photo_url} onChange={(e) => setPersonalInfo({ ...personalInfo, photo_url: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label htmlFor="contact_email" className="sr-only">Contact Email</label>
            <input id="contact_email" type="email" placeholder="Contact Email" value={personalInfo.contact_email} onChange={(e) => setPersonalInfo({ ...personalInfo, contact_email: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label htmlFor="linkedin_url" className="sr-only">LinkedIn URL</label>
            <input id="linkedin_url" type="text" placeholder="LinkedIn URL" value={personalInfo.linkedin_url} onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin_url: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label htmlFor="github_url" className="sr-only">GitHub URL</label>
            <input id="github_url" type="text" placeholder="GitHub URL" value={personalInfo.github_url} onChange={(e) => setPersonalInfo({ ...personalInfo, github_url: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label htmlFor="resume_url" className="sr-only">Resume URL</label>
            <input id="resume_url" type="text" placeholder="Resume URL" value={personalInfo.resume_url} onChange={(e) => setPersonalInfo({ ...personalInfo, resume_url: e.target.value })} className={inputClass} />
          </div>
        </div>
        <button onClick={handleUpdatePersonal} className={buttonClass + " mt-4"}>Save Personal Info</button>
      </section>

      <hr />

      {/* 2. ACHIEVEMENTS SECTION (POST & DELETE) */}
      <section className={sectionClass}>
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">2. Achievements/Certificates</h2>
        
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Add New Achievement</h3>
        <div className="text-gray-900 font-bold grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          <div>
            <label htmlFor="cert-title" className="sr-only">Title</label>
            <input id="cert-title" type="text" placeholder="Title" value={newCert.title} onChange={(e) => setNewCert({ ...newCert, title: e.target.value })} className={inputClass + " md:col-span-2"} />
          </div>
          <div>
            <label htmlFor="cert-issuer" className="sr-only">Issuer</label>
            <input id="cert-issuer" type="text" placeholder="Issuer" value={newCert.issuer} onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label htmlFor="cert-date" className="sr-only">Date (YYYY-MM-DD)</label>
            <input id="cert-date" type="date" placeholder="Date (YYYY-MM-DD)" value={newCert.date} onChange={(e) => setNewCert({ ...newCert, date: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label htmlFor="cert-url" className="sr-only">Credential URL</label>
            <input id="cert-url" type="text" placeholder="Credential URL" value={newCert.credential_url} onChange={(e) => setNewCert({ ...newCert, credential_url: e.target.value })} className={inputClass} />
          </div>

          <button onClick={handleAddCert} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-150 md:col-span-5">Add Certificate</button>
        </div>
        <div>
        <label htmlFor="cert-image-url" className="sr-only">Image URL (e.g., Cloudinary)</label>
            <input 
              id="cert-image-url" 
              type="url" 
              placeholder="Image URL (e.g., Cloudinary)" 
              value={newCert.image_url} 
              onChange={(e) => setNewCert({ ...newCert, image_url: e.target.value })} 
              className={inputClass} 
            />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 border-t pt-4">Current Achievements ({certs.length})</h3>
        <ul className="space-y-2">
          {certs.map((cert) => (
            <li key={cert.id} className="border p-3 flex justify-between items-center bg-gray-50 rounded">
              <div className="flex items-center">
                {/* Added: Image Preview (small, optional) */}
                {cert.image_url && (
                  <Image 
                    src={cert.image_url} 
                    alt={`${cert.title} image`} 
                    className="w-8 h-8 rounded mr-2 object-cover" 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}  
                  />
                )}
                <span className="text-gray-700 truncate mr-4 text-sm font-medium">  {/* Fixed className: was text-shadow-gray-700 */}
                  {cert.title} ({new Date(cert.date).getFullYear()})
                </span>
              </div>
              <button onClick={() => handleDeleteCert(cert.id)} className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition duration-150 flex-shrink-0">Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <hr />
      
      {/* 3. PROJECTS SECTION (POST & DELETE) */}
      <section className={sectionClass}>
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">3. Projects</h2>
        
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Add New Project</h3>
        <div className="text-gray-900 font-bold grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div>
            <label htmlFor="project-title" className="sr-only">Title</label>
            <input id="project-title" type="text" placeholder="Title" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} className={inputClass + " md:col-span-2"} />
          </div>
          <div>
            <label htmlFor="project-github" className="sr-only">GitHub URL</label>
            <input id="project-github" type="text" placeholder="GitHub URL" value={newProject.github_url} onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label htmlFor="project-live" className="sr-only">Live URL</label>
            <input id="project-live" type="text" placeholder="Live URL" value={newProject.live_url} onChange={(e) => setNewProject({ ...newProject, live_url: e.target.value })} className={inputClass} />
          </div>
          <div className="md:col-span-4">
            <label htmlFor="project-description" className="sr-only">Description</label>
            <textarea id="project-description" placeholder="Description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} className={inputClass + " h-20"} />
          </div>
          <div className="md:col-span-4">
            <label htmlFor="project-tech" className="sr-only">Technologies (comma separated)</label>
            <input id="project-tech" type="text" placeholder="Technologies (comma separated)" value={rawTechnologiesInput} onChange={(e) => setRawTechnologiesInput(e.target.value)} className={inputClass} />
          </div>
          <div className="md:col-span-3">  
            <label htmlFor="project-image-url" className="sr-only">Image URL (e.g., Cloudinary)</label>
            <input 
              id="project-image-url" 
              type="url" 
              placeholder="Image URL (e.g., Cloudinary - optional for project screenshot)" 
              value={newProject.image_url} 
              onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })} 
              className={inputClass} 
            />
          </div>
          <div className="flex items-center space-x-2">
              <input type="checkbox" id="new-project-featured" checked={newProject.is_featured} onChange={(e) => setNewProject({ ...newProject, is_featured: e.target.checked })} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
              <label htmlFor="new-project-featured"className="text-sm text-gray-700">Featured</label>
          </div>
          <div>
            <label htmlFor="project-priority" className="sr-only">Priority (0-10)</label>
            <input id="project-priority" type="number" placeholder="Priority (0-10)" value={newProject.priority} onChange={(e) => setNewProject({ ...newProject, priority: parseInt(e.target.value) || 0 })} className={inputClass} />
          </div>
          <button onClick={handleAddProject} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-150 md:col-span-4">Add Project</button>
        </div>

        <h3 className="text-lg font-semibold mb-2 text-gray-700 border-t pt-4">Current Projects ({projects.length})</h3>
        <ul className="space-y-2">
          {projects.map((project) => (
            <li key={project.id} className="border p-3 flex justify-between items-center bg-gray-50 rounded">
              <div className="flex items-center">  {/* Wrap for alignment */}
                {/* Added: Image Preview (small, optional) */}
                {project.image_url && (
                  <Image 
                    src={project.image_url} 
                    alt={`${project.title} image`} 
                    className="w-8 h-8 rounded mr-2 object-cover" 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}  
                  />
                )}
                <span className="text-gray-700 truncate mr-4 text-sm font-medium">
                  {project.title} {project.is_featured && '⭐'}
                </span>
              </div>
              <button onClick={() => handleDeleteProject(project.id)} className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition duration-150 flex-shrink-0">Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <hr />

      {/* 4. SKILLS SECTION (POST & DELETE) */}
      <section className={sectionClass}>
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">4. Skills</h2>
        
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Add New Skill</h3>
        <div className="text-gray-700 font-bold grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <div>
            <label htmlFor="skill-name" className="sr-only">Skill Name</label>
            <input id="skill-name" type="text" placeholder="Skill Name" value={newSkill.skill_name} onChange={(e) => setNewSkill({ ...newSkill, skill_name: e.target.value })} className={inputClass + " md:col-span-2"} />
          </div>
          <div>
            <label htmlFor="skill-category" className="sr-only">Category (e.g., Frontend)</label>
            <input id="skill-category" type="text" placeholder="Category (e.g., Frontend)" value={newSkill.category} onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label htmlFor="skill-priority" className="sr-only">Priority (0-10)</label>
            <input id="skill-priority" type="number" placeholder="Priority (0-10)" value={newSkill.priority} onChange={(e) => setNewSkill({ ...newSkill, priority: parseInt(e.target.value) || 0 })} className={inputClass} />
          </div>
          <button onClick={handleAddSkill} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-150 md:col-span-4">Add Skill</button>
        </div>

        <h3 className="text-lg font-semibold mb-2 text-gray-700 border-t pt-4">Current Skills ({skills.length})</h3>
        <ul className="space-y-2">
          {skills.map((skill) => (
            <li key={skill.id} className="border p-3 flex justify-between items-center bg-gray-50 rounded">
              <span className="text-gray-800 truncate mr-4 text-sm font-medium">
                {skill.skill_name} ({skill.category})
              </span>
              <button onClick={() => handleDeleteSkill(skill.id)} className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition duration-150 flex-shrink-0">Delete</button>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}