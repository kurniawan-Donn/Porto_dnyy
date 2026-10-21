import { SITE_NAME, SITE_URL } from "@/lib/site";

export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: SITE_URL,
    jobTitle: "IT Audit & Web Developer",
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Politeknik Negeri Madiun",
    },
    knowsAbout: [
      "IT Audit",
      "Web Development",
      "Kotlin",
      "Next.js",
      "PHP",
      "MySQL",
      "Information Security",
    ],
    sameAs: [
      "https://github.com/donykurniawan1298",
      "https://linkedin.com/in/donykurniawan",
      "https://instagram.com/donykurniawan",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}