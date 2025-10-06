import { Card } from "@/components/ui/card";
import { Award, FileCheck, Brain } from "lucide-react";
import { useState } from "react";

export default function Testimonials() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const stats = [
    {
      icon: Award,
      title: "15+ Certifications Covered",
      description: "PMP, CISSP, CCSP, CISM, CAPM, and more—with new certifications added regularly.",
      color: "from-primary to-blue-600",
      bgColor: "from-primary/10 to-blue-600/10",
    },
    {
      icon: FileCheck,
      title: "10,000+ Practice Questions",
      description: "Verified by certified professionals and updated to match current exam formats.",
      color: "from-chart-2 to-teal-500",
      bgColor: "from-chart-2/10 to-teal-500/10",
    },
    {
      icon: Brain,
      title: "AI That Learns You in Minutes",
      description: "Our diagnostic identifies your strengths and gaps in under 10 minutes.",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
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
            <div
              key={index}
              className="group relative"
              data-testid={`card-stat-${index}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Glowing border effect on hover */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500`} />
              
              {/* Main Card */}
              <Card className="relative h-full p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                {/* Icon Container with Gradient Background */}
                <div className="relative mb-4">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} rounded-xl blur-lg transition-all duration-300 ${hoveredIndex === index ? 'scale-110' : 'scale-100'}`} />
                  <div className={`relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg transition-all duration-300 ${hoveredIndex === index ? 'rotate-12 scale-110' : 'rotate-0'}`}>
                    <stat.icon className="h-7 w-7 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-2 transition-colors duration-300 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-chart-2 group-hover:bg-clip-text group-hover:text-transparent" data-testid={`text-stat-title-${index}`}>
                  {stat.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-stat-description-${index}`}>
                  {stat.description}
                </p>

                {/* Decorative Corner Element */}
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity duration-300`} />
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
