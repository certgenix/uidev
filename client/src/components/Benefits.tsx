import { Target, Bot, Clock, TrendingUp, Globe, Rocket } from "lucide-react";
import { useState } from "react";

export default function Benefits() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const benefits = [
    {
      icon: Target,
      title: "Simulations So Real, Test Day Feels Like a Review",
      description: "Practice for PMP, CISSP, CCSP, CISM, and more in true exam conditions.",
      color: "from-red-500 to-orange-500",
      bgColor: "from-red-500/10 to-orange-500/10",
    },
    {
      icon: Bot,
      title: "Learning That Adapts to You, Not the Other Way Around",
      description: "Our AI identifies your strengths and weak spots, creating a plan just for you.",
      color: "from-primary to-blue-600",
      bgColor: "from-primary/10 to-blue-600/10",
    },
    {
      icon: Clock,
      title: "Time-Smart Study",
      description: "Flexible study blocks that fit your schedule.",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
    },
    {
      icon: TrendingUp,
      title: "Your Personal Confidence Score",
      description: "Always know when you're exam-ready — no second-guessing.",
      color: "from-chart-3 to-emerald-600",
      bgColor: "from-chart-3/10 to-emerald-600/10",
    },
    {
      icon: Globe,
      title: "Real-World Application",
      description: "Learn with case studies and scenarios that prepare you for your job, not just the test.",
      color: "from-chart-2 to-cyan-500",
      bgColor: "from-chart-2/10 to-cyan-500/10",
    },
    {
      icon: Rocket,
      title: "Career Acceleration",
      description: "Move beyond exams into mastery and professional growth.",
      color: "from-amber-500 to-yellow-500",
      bgColor: "from-amber-500/10 to-yellow-500/10",
    },
  ];

  return (
    <section id="benefits" className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Animated Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3" data-testid="text-benefits-title">
            Why Choose CertGenix?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative"
              data-testid={`card-benefit-${index}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Glowing border effect on hover */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${benefit.color} rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500`} />
              
              {/* Main Card */}
              <div className="relative h-full bg-card border border-border rounded-lg p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* Icon Container with Gradient Background */}
                <div className="relative mb-4">
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.bgColor} rounded-xl blur-lg transition-all duration-300 ${hoveredIndex === index ? 'scale-110' : 'scale-100'}`} />
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.color} transition-all duration-300 ${hoveredIndex === index ? 'rotate-12 scale-110' : 'rotate-0'}`}>
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-base font-semibold mb-2 transition-colors duration-300 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-chart-2 group-hover:bg-clip-text group-hover:text-transparent" data-testid={`text-benefit-title-${index}`}>
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-benefit-description-${index}`}>
                  {benefit.description}
                </p>

                {/* Decorative Corner Element */}
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity duration-300`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
