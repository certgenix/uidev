import { Card } from "@/components/ui/card";
import { User, Brain, Trophy, Sparkles, Target, Zap } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      icon: User,
      title: "We Learn About You",
      description: "A quick diagnostic uncovers your knowledge, time, and goals.",
      color: "from-primary to-blue-600",
    },
    {
      number: "2",
      icon: Brain,
      title: "You Follow Your Smart Plan",
      description: "Our AI builds and adapts your personalized roadmap in real-time.",
      color: "from-chart-2 to-teal-500",
    },
    {
      number: "3",
      icon: Trophy,
      title: "You Certify & Apply",
      description: "Pass your exam with confidence and apply your knowledge to accelerate your career.",
      color: "from-emerald-500 to-chart-3",
    },
  ];

  const connectors = [
    { icon: Sparkles, top: "20%", left: "30%" },
    { icon: Target, top: "60%", left: "50%" },
    { icon: Zap, top: "30%", left: "70%" },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 lg:py-32 bg-card relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4" data-testid="text-how-it-works-title">
            How CertGenix Works
          </h2>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden lg:block relative">
            {/* Dotted Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ height: '400px' }}>
              {/* Line from card 1 to connector 1 */}
              <line x1="20%" y1="50%" x2="30%" y2="20%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="8,8" opacity="0.4" />
              {/* Line from connector 1 to card 2 */}
              <line x1="30%" y1="20%" x2="50%" y2="50%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="8,8" opacity="0.4" />
              {/* Line from card 2 to connector 2 */}
              <line x1="50%" y1="50%" x2="50%" y2="60%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="8,8" opacity="0.4" />
              {/* Line from connector 2 to connector 3 */}
              <line x1="50%" y1="60%" x2="70%" y2="30%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="8,8" opacity="0.4" />
              {/* Line from connector 3 to card 3 */}
              <line x1="70%" y1="30%" x2="80%" y2="50%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="8,8" opacity="0.4" />
            </svg>

            {/* Content Cards */}
            <div className="relative flex justify-between items-center" style={{ minHeight: '400px' }}>
              {steps.map((step, index) => (
                <div key={step.number} className="relative w-72" data-testid={`step-${index + 1}`} style={{ zIndex: 10 }}>
                  <Card className="p-6 hover-elevate bg-background" data-testid={`card-step-${index + 1}`}>
                    {/* Icon with gradient background */}
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} mb-4`}>
                      <step.icon className="h-7 w-7 text-white" />
                    </div>

                    {/* Step Number */}
                    <div className="text-xs font-semibold text-muted-foreground mb-2" data-testid={`badge-step-number-${step.number}`}>
                      STEP {step.number}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-3" data-testid={`text-step-title-${index + 1}`}>
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-step-description-${index + 1}`}>
                      {step.description}
                    </p>
                  </Card>
                </div>
              ))}

              {/* Floating Connector Nodes */}
              {connectors.map((connector, index) => (
                <div
                  key={index}
                  className="absolute w-12 h-12 rounded-full bg-muted/80 backdrop-blur-sm border-2 border-border flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  style={{ top: connector.top, left: connector.left, zIndex: 5 }}
                  data-testid={`connector-${index + 1}`}
                >
                  <connector.icon className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative" data-testid={`step-${index + 1}`}>
                <Card className="p-6 hover-elevate bg-background" data-testid={`card-step-${index + 1}`}>
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} mb-4`}>
                    <step.icon className="h-7 w-7 text-white" />
                  </div>

                  <div className="text-xs font-semibold text-muted-foreground mb-2" data-testid={`badge-step-number-${step.number}`}>
                    STEP {step.number}
                  </div>

                  <h3 className="text-lg font-bold mb-3" data-testid={`text-step-title-${index + 1}`}>
                    {step.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-step-description-${index + 1}`}>
                    {step.description}
                  </p>
                </Card>

                {/* Connector for Mobile */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-4">
                    <div className="w-8 h-8 rounded-full bg-muted/80 backdrop-blur-sm border-2 border-border flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
