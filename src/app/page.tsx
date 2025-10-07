import Section from "./components/Section";
import SkillsSection from "./components/SkillsSection";
import ProjectsSection from "./components/ProjectsSection";
import CertificatesSection from "./components/CertificateSection";
import AboutPreview from "./components/AboutPreview";
import HeroSection from "./components/HeroSection";
import ContactSection from "./components/ContactSection";

// --- 1. Define specific interfaces to replace 'any' ---

interface PersonalInfo {
  id?: number;
  name: string;
  tagline: string; // Changed from 'title' to match HeroSectionProps
  long_bio: string; // Changed from 'bio' to match AboutPreviewProps
  photo_url: string; // Changed from 'profile_pic_url' to match AboutPreviewProps
  github_url: string;
  linkedin_url: string;
  email: string;
  phone: string;
  resume_url: string; // Added to match HeroSectionProps
}
interface Skill {
  id: number;
  skill_name: string;
  category: string;
  priority: number;
}

interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  technologies: string[];
  github_url: string;
  live_url: string;
}

interface Achievement {
    id: number;
    title: string;
    issuer: string;
    type: 'certificate' | 'award';
    image_url: string; 
    date?: string; 
    credential_url?: string;
}

// Update PortfolioData to use the new interfaces
interface PortfolioData {
  personalInfo: PersonalInfo | Record<string, never>; // Can be PersonalInfo or an empty object {}
  skills: Skill[];
  projects: Project[];
  achievements: Achievement[];
}

// --- SAFE FALLBACK OBJECT ---
// This guarantees that if the API fails, the components still receive all required string properties.
const EMPTY_PERSONAL_INFO: PersonalInfo = {
  name: "Your Name",
  tagline: "Web Developer | Portfolio",
  long_bio: "Welcome! Data not yet loaded. Please set up your database tables.",
  photo_url: "https://placehold.co/150x150/EEEEEE/333333?text=Photo",
  github_url: "#",
  linkedin_url: "#",
  email: "contact@example.com",
  phone: "(555) 555-5555",
  resume_url: "#",
};
// ----------------------------


export default async function HomePage() {
  const data: PortfolioData = await getPortfolioData();

  // 2. Use a guaranteed PersonalInfo type. If data.personalInfo is the empty object ({}),
  // use the safe fallback instead. This resolves the HeroSection type error.
  const finalPersonalInfo: PersonalInfo =
    (Object.keys(data.personalInfo).length === 0 && data.personalInfo.constructor === Object)
      ? EMPTY_PERSONAL_INFO
      : (data.personalInfo as PersonalInfo);


  // Destructure the rest
  const {
    skills = [],
    projects = [],
    achievements = [],
  } = data;

  return (
    <main
      className="
        bg-gradient-to-b
        from-gray-300
        via-gray-500
        to-gray-900
        min-h-screen
        text-gray-800"
    >
      {/*hero section*/}
      <Section
        className="h-screen flex flex-col items-center justify-center text-center !bg-transparent"
        animationVariant="scale-in"
      >
        <HeroSection info={finalPersonalInfo} />
      </Section>

      <Section className="bg-white-800" delay={0}>
        <AboutPreview info={finalPersonalInfo} />
      </Section>

      <Section id="skills" title="Skills" className="bg-gray-50" delay={0} >
        <SkillsSection skills={skills} />
      </Section>

      <Section id="projects" title="Projects & Experience" delay={0} animationVariant="slide-left">
        <ProjectsSection projects={projects} />
      </Section>

      <Section id="certificates" title="Achievements" className="bg-gray-50" delay={0}>
        <CertificatesSection achievements={achievements} />
      </Section>

      <Section id="contact" title="Contact" className="bg-gray-900 text-white" delay={0}>
        <ContactSection contactInfo={finalPersonalInfo} />
      </Section>
    </main>
  );
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL
 ? process.env.NEXT_PUBLIC_SITE_URL 
 : 'http://localhost:3000'; // Development URL
async function getPortfolioData(): Promise<PortfolioData> {

  try {
    // When running in a Server Component on Vercel/Next.js runtime, 
    // fetch requests using relative paths are automatically routed internally and securely.
    const [infoRes, skillsRes, projectsRes, achievementsRes] = await Promise.all([
      fetch(`${BASE_URL}/api/v1/info`, { next: { revalidate: 3600 } }), // Cache for 1 hour
      fetch(`${BASE_URL}/api/v1/skills`, { next: { revalidate: 3600 } }),
      fetch(`${BASE_URL}/api/v1/projects`, { next: { revalidate:3600 } }),
      fetch(`${BASE_URL}/api/v1/achievements` , { next: { revalidate: 3600 } }),
    ]);

    const [personalInfo, skills, projects, achievements] = await Promise.all([
      infoRes.json(),
      skillsRes.json(),
      projectsRes.json(),
      achievementsRes.json(),
    ]);

    // Handle single row returns: personalInfo will be an array, but we need the object
    const infoObject = Array.isArray(personalInfo) ? personalInfo[0] || {} : personalInfo;

    return { personalInfo: infoObject as PersonalInfo, skills, projects, achievements };
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    // Return empty data structure on error, explicitly typed to match the interface
    return { personalInfo: {}, skills: [], projects: [], achievements: [] } as PortfolioData;
  }
}