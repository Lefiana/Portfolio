  import Section from "./components/Section";
  import Link from "next/link";
  import SkillsSection from "./components/SkillsSection"; 
  import ProjectsSection from "./components/ProjectsSection";
  import CertificatesSection from "./components/CertificateSection";
  import AboutPreview from "./components/AboutPreview";
  import HeroSection from "./components/HeroSection";
  import ContactSection from "./components/ContactSection";

  interface PortfolioData {
    personalInfo: any;
    skills: any[];
    projects: any[];
    achievements: any[];
  }

  export default async function HomePage( ){

    const data: PortfolioData = await getPortfolioData();

    const { personalInfo, skills, projects, achievements } = data;
    
    return(
      <main className="
            bg-gradient-to-b
          from-blue-200
          via-gray-300
          to-gray-900
            min-h-screen
          text-gray-800">

            {/*hero section*/ }
            <Section        
              className="h-screen flex flex-col items-center justify-center text-center !bg-transparent" 
              animationVariant="scale-in">

              <HeroSection info={personalInfo}/>

            </Section>

            <Section className="bg-white-800" delay={0}>

              <AboutPreview info={personalInfo}/>

            </Section>
            
            <Section id="skills" title="Skills" className="bg-gray-50" delay={0}>
              
              <SkillsSection skills={skills}/>

            </Section>  

            <Section id="projects" title="Projects" delay={0} animationVariant="slide-left">

              <ProjectsSection projects={projects} />

            </Section>

            <Section id="certificates" title="Achievements" className="bg-gray-50" delay={0}>

              <CertificatesSection achievements={achievements} />

            </Section>

            <Section id="contact" title="Contact" className="bg-gray-900 text-white" delay={0}>

            <ContactSection contactInfo={personalInfo} />

            </Section>
          </main>
    )
  }

  // 2. Implement getStaticProps to fetch data at build time
  async function getPortfolioData() {
    // Use 'internal' URL to avoid external network hops if deploying on Vercel/similar host
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; 

    const endpoints = {
      personalInfo: `${API_BASE_URL}/api/v1/info`,
      skills: `${API_BASE_URL}/api/v1/skills`,
      projects: `${API_BASE_URL}/api/v1/projects`,
      achievements: `${API_BASE_URL}/api/v1/achievements`,
    };

    try {
      const [infoRes, skillsRes, projectsRes, achievementsRes] = await Promise.all([
        fetch(endpoints.personalInfo, { next: { revalidate: 0 } }), // Revalidate data every hour (ISR equivalent)
        fetch(endpoints.skills, { next: { revalidate: 0 } }),
        fetch(endpoints.projects, { next: { revalidate: 0 } }),
        fetch(endpoints.achievements, { next: { revalidate: 0 } }),
      ]);

      const [personalInfo, skills, projects, achievements] = await Promise.all([
        infoRes.json(),
        skillsRes.json(),
        projectsRes.json(),
        achievementsRes.json(),
      ]);

      // Handle single row returns: personalInfo will be an array, but we need the object
      const infoObject = Array.isArray(personalInfo) ? personalInfo[0] || {} : personalInfo;

      return { personalInfo: infoObject, skills, projects, achievements };

    } catch (error) {
      console.error("Error fetching portfolio data:", error);
      // Return empty data structure on error
      return { personalInfo: {}, skills: [], projects: [], achievements: [] };
    }
  }