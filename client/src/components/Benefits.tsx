import { Card } from "@/components/ui/card";
import { Target, Bot, Clock, TrendingUp, Globe, Rocket } from "lucide-react";

export default function Benefits() {
  const benefits = [
    {
      icon: Target,
      title: "Simulations So Real, Test Day Feels Like a Review",
      description: "Practice for PMP, CISSP, CCSP, CISM, and more in true exam conditions.",
    },
    {
      icon: Bot,
      title: "Learning That Adapts to You, Not the Other Way Around",
      description: "Our AI identifies your strengths and weak spots, creating a plan just for you.",
    },
    {
      icon: Clock,
      title: "Time-Smart Study",
      description: "Flexible study blocks that fit your schedule.",
    },
    {
      icon: TrendingUp,
      title: "Your Personal Confidence Score",
      description: "Always know when you're exam-ready — no second-guessing.",
    },
    {
      icon: Globe,
      title: "Real-World Application",
      description: "Learn with case studies and scenarios that prepare you for your job, not just the test.",
    },
    {
      icon: Rocket,
      title: "Career Acceleration",
      description: "Move beyond exams into mastery and professional growth.",
    },
  ];

  return (
    <section id="benefits" className="py-16 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4" data-testid="text-benefits-title">
            Why Choose CertGenix?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="p-6 hover-elevate" data-testid={`card-benefit-${index}`}>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-chart-2/10 mb-4">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3" data-testid={`text-benefit-title-${index}`}>
                {benefit.title}
              </h3>
              <p className="text-muted-foreground" data-testid={`text-benefit-description-${index}`}>
                {benefit.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
