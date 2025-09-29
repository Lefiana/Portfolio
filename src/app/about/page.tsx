import Section from "../components/Section";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About Me</h1>
      <p className="text-gray-700 mb-4">
        I’m Sean, an IT Technical Service professional with experience in
        networking, web, and app development. I enjoy solving problems,
        creating efficient solutions, and continuously learning in the tech
        space.
      </p>
      <p>
        Beyond coding, I’m also interested in cybersecurity, cloud deployment,
        and emerging technologies. My long-term goal is to innovate and create
        impactful solutions in the IT industry.
      </p>
      <p className="text-gray-700 mb-8">
        Outside of tech, I am also interested in fitness, calisthenics, and
        combat sports. I believe in balancing work with continuous learning and
        personal growth.
      </p>

      <Link href="/" className="text-blue-600 hover:underline">
        ← Back to Home
      </Link>
    </main>
  );
}
