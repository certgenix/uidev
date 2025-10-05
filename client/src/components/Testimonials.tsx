import { Card } from "@/components/ui/card";
import { Award, FileCheck, Brain } from "lucide-react";

export default function Testimonials() {
  const stats = [
    {
      icon: Award,
      title: "15+ Certifications Covered",
      description: "PMP, CISSP, CCSP, CISM, CAPM, and more—with new certifications added regularly.",
      color: "from-primary to-blue-600",
    },
    {
      icon: FileCheck,
      title: "10,000+ Practice Questions",
      description: "Verified by certified professionals and updated to match current exam formats.",
      color: "from-chart-2 to-teal-500",
    },
    {
      icon: Brain,
      title: "AI That Learns You in Minutes",
      description: "Our diagnostic identifies your strengths and gaps in under 10 minutes.",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <section id="stats" className="py-16 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3" data-testid="text-stats-title">
            Join Thousands Preparing Smarter
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300" data-testid={`card-stat-${index}`}>
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} mb-4 shadow-lg`}>
                <stat.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2" data-testid={`text-stat-title-${index}`}>
                {stat.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-stat-description-${index}`}>
                {stat.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
