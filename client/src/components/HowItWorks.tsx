import { User, Brain, Trophy } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      icon: User,
      title: "We Learn About You",
      description: "A quick diagnostic uncovers your knowledge, time, and goals.",
      color: "from-blue-500 to-blue-600",
    },
    {
      number: "2",
      icon: Brain,
      title: "You Follow Your Smart Plan",
      description: "Our AI builds and adapts your personalized roadmap in real-time.",
      color: "from-primary to-chart-2",
    },
    {
      number: "3",
      icon: Trophy,
      title: "You Certify & Apply",
      description: "Pass your exam with confidence and apply your knowledge to accelerate your career.",
      color: "from-chart-3 to-emerald-600",
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

        <div className="relative max-w-5xl mx-auto">
          {/* Desktop Flow Path - Curved SVG Line */}
          <svg className="hidden md:block absolute top-32 left-0 w-full h-32 pointer-events-none" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path
              d="M 0 50 Q 250 20, 500 50 T 1000 50"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeDasharray="8 8"
              opacity="0.3"
            />
          </svg>

          {/* Mobile Flow Path - Vertical Line */}
          <div className="md:hidden absolute left-1/2 top-24 bottom-24 w-1 bg-gradient-to-b from-primary/30 via-chart-2/30 to-chart-3/30 -translate-x-1/2" />

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative flex flex-col items-center" data-testid={`step-${index + 1}`}>
                {/* Large Circle Node */}
                <div 
                  className={`relative z-10 flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${step.color} shadow-lg mb-6 group hover:scale-110 transition-transform duration-300`}
                  data-testid={`node-step-${index + 1}`}
                >
                  <div className="absolute inset-2 rounded-full bg-background/10 backdrop-blur-sm" />
                  <step.icon className="relative h-16 w-16 text-white" />
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 flex items-center justify-center w-10 h-10 rounded-full bg-background border-2 border-primary text-primary font-bold text-lg shadow-md" data-testid={`badge-step-number-${step.number}`}>
                    {step.number}
                  </div>
                </div>

                {/* Content Card */}
                <div className="text-center max-w-xs bg-background/50 backdrop-blur-sm rounded-lg p-6 border border-border hover-elevate" data-testid={`card-step-${index + 1}`}>
                  <h3 className="text-xl font-semibold mb-3" data-testid={`text-step-title-${index + 1}`}>
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm" data-testid={`text-step-description-${index + 1}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
