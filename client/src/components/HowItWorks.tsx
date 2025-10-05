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
      description: "Pass with confidence and use what you learned to get promoted or land a better job.",
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
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3" data-testid="text-how-it-works-title">
            How CertGenix Works
          </h2>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden lg:block relative">
            {/* Dotted Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ height: '500px' }}>
              {/* Line from card 1 to connector 1 */}
              <line x1="20%" y1="35%" x2="30%" y2="20%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="8,8" opacity="0.4" />
              {/* Line from connector 1 to card 2 */}
              <line x1="30%" y1="20%" x2="50%" y2="55%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="8,8" opacity="0.4" />
              {/* Line from card 2 to connector 2 */}
              <line x1="50%" y1="55%" x2="50%" y2="65%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="8,8" opacity="0.4" />
              {/* Line from connector 2 to connector 3 */}
              <line x1="50%" y1="65%" x2="70%" y2="30%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="8,8" opacity="0.4" />
              {/* Line from connector 3 to card 3 */}
              <line x1="70%" y1="30%" x2="80%" y2="35%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="8,8" opacity="0.4" />
            </svg>

            {/* Content Cards */}
            <div className="relative flex justify-between items-start" style={{ minHeight: '500px' }}>
              {steps.map((step, index) => (
                <div 
                  key={step.number} 
                  className={`relative w-72 transition-all duration-500 ${index === 1 ? 'lg:translate-y-24' : ''}`} 
                  data-testid={`step-${index + 1}`} 
                  style={{ zIndex: 10 }}
                >
                  <div className="relative p-[1px] rounded-xl bg-gradient-to-br from-primary/30 via-chart-2/20 to-primary/30 hover:from-primary/50 hover:via-chart-2/30 hover:to-primary/50 transition-all duration-300">
                    <Card className="p-6 bg-background/95 backdrop-blur-sm rounded-xl border-0 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300" data-testid={`card-step-${index + 1}`}>
                      {/* Icon with gradient background */}
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} mb-4 shadow-lg`}>
                        <step.icon className="h-7 w-7 text-white" />
                      </div>

                      {/* Step Number */}
                      <div className="text-xs font-semibold tracking-wider text-primary/80 mb-3" data-testid={`badge-step-number-${step.number}`}>
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
                <div className="relative p-[1px] rounded-xl bg-gradient-to-br from-primary/30 via-chart-2/20 to-primary/30">
                  <Card className="p-6 bg-background/95 backdrop-blur-sm rounded-xl border-0" data-testid={`card-step-${index + 1}`}>
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} mb-4 shadow-lg`}>
                      <step.icon className="h-7 w-7 text-white" />
                    </div>

                    <div className="text-xs font-semibold tracking-wider text-primary/80 mb-3" data-testid={`badge-step-number-${step.number}`}>
                      STEP {step.number}
                    </div>

                    <h3 className="text-lg font-bold mb-3" data-testid={`text-step-title-${index + 1}`}>
                      {step.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-step-description-${index + 1}`}>
                      {step.description}
                    </p>
                  </Card>
                </div>

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
