import { Card } from "@/components/ui/card";
import { User, Brain, Trophy } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      icon: User,
      title: "We Learn About You",
      description: "A quick diagnostic uncovers your knowledge, time, and goals.",
    },
    {
      number: "2",
      icon: Brain,
      title: "You Follow Your Smart Plan",
      description: "Our AI builds and adapts your personalized roadmap in real-time.",
    },
    {
      number: "3",
      icon: Trophy,
      title: "You Certify & Apply",
      description: "Pass your exam with confidence and apply your knowledge to accelerate your career.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 lg:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4" data-testid="text-how-it-works-title">
            How CertGenix Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={step.number} className="p-6 md:p-8 hover-elevate" data-testid={`card-step-${index + 1}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-chart-2 text-primary-foreground font-bold text-xl" data-testid={`badge-step-number-${step.number}`}>
                  {step.number}
                </div>
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3" data-testid={`text-step-title-${index + 1}`}>
                {step.title}
              </h3>
              <p className="text-muted-foreground" data-testid={`text-step-description-${index + 1}`}>
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
