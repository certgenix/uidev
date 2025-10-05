import { Card } from "@/components/ui/card";
import { User, Brain, Trophy, ArrowDown } from "lucide-react";

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

        <div className="max-w-4xl mx-auto space-y-12">
          {steps.map((step, index) => (
            <div key={step.number} data-testid={`step-${index + 1}`}>
              <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
                {/* Icon Section */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center shadow-xl hover:scale-105 transition-transform" data-testid={`icon-container-${index + 1}`}>
                      <step.icon className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-lg" data-testid={`badge-step-number-${step.number}`}>
                      {step.number}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <Card className="flex-1 p-6 hover-elevate" data-testid={`card-step-${index + 1}`}>
                  <h3 className="text-2xl font-semibold mb-3" data-testid={`text-step-title-${index + 1}`}>
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-lg" data-testid={`text-step-description-${index + 1}`}>
                    {step.description}
                  </p>
                </Card>
              </div>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="flex justify-center my-8">
                  <div className="flex flex-col items-center gap-2">
                    <ArrowDown className="h-8 w-8 text-primary animate-bounce" data-testid={`arrow-${index + 1}`} />
                    <div className="h-8 w-0.5 bg-gradient-to-b from-primary to-transparent" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
