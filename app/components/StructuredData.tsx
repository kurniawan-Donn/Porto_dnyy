export default function StructuredData() {
  const SITE_URL = "https://donykurniawan.vercel.app"; // ✏️ Ganti setelah deploy
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Dony Kurniawan",
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