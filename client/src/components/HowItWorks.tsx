import { User, Brain, Trophy, MoveRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      icon: User,
      title: "We Learn About You",
      description: "A quick diagnostic uncovers your knowledge, time, and goals.",
      gradient: "from-blue-500 via-blue-600 to-primary",
    },
    {
      number: "2",
      icon: Brain,
      title: "You Follow Your Smart Plan",
      description: "Our AI builds and adapts your personalized roadmap in real-time.",
      gradient: "from-primary via-chart-2 to-teal-500",
    },
    {
      number: "3",
      icon: Trophy,
      title: "You Certify & Apply",
      description: "Pass your exam with confidence and apply your knowledge to accelerate your career.",
      gradient: "from-teal-500 via-emerald-500 to-chart-3",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-card to-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4" data-testid="text-how-it-works-title">
            How CertGenix Works
          </h2>
        </div>

        {/* Horizontal Flow Layout */}
        <div className="relative">
          {/* Connection Line - Desktop Only */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-primary to-chart-3 opacity-20" style={{ top: '7rem' }} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4 relative">
            {steps.map((step, index) => (
              <div key={step.number} className="relative" data-testid={`step-${index + 1}`}>
                {/* Hexagonal Container */}
                <div className="relative group">
                  {/* Hexagon Background */}
                  <div className="relative mx-auto w-40 h-40 mb-6 flex items-center justify-center" data-testid={`hexagon-${index + 1}`}>
                    <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 drop-shadow-2xl">
                      <defs>
                        <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" className="text-blue-500" style={{ stopColor: 'currentColor' }} />
                          <stop offset="50%" className="text-primary" style={{ stopColor: 'currentColor' }} />
                          <stop offset="100%" className="text-chart-2" style={{ stopColor: 'currentColor' }} />
                        </linearGradient>
                      </defs>
                      <polygon
                        points="50 3, 95 25, 95 75, 50 97, 5 75, 5 25"
                        fill={`url(#gradient-${index})`}
                        className="group-hover:opacity-90 transition-opacity"
                      />
                    </svg>
                    
                    {/* Icon */}
                    <step.icon className="relative z-10 h-16 w-16 text-white group-hover:scale-110 transition-transform" />
                    
                    {/* Number Badge */}
                    <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-chart-2 text-white flex items-center justify-center font-bold text-xl shadow-xl border-4 border-background z-20" data-testid={`badge-step-number-${step.number}`}>
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center px-4" data-testid={`card-step-${index + 1}`}>
                    <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent" data-testid={`text-step-title-${index + 1}`}>
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed" data-testid={`text-step-description-${index + 1}`}>
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Arrow Connector - Desktop Only */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-8 top-28 z-30 items-center justify-center">
                    <div className="relative">
                      <MoveRight className="h-12 w-12 text-primary drop-shadow-lg" data-testid={`arrow-${index + 1}`} />
                      <div className="absolute inset-0 blur-md bg-primary/30 rounded-full" />
                    </div>
                  </div>
                )}

                {/* Arrow for Mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-6">
                    <MoveRight className="h-10 w-10 text-primary rotate-90" data-testid={`arrow-mobile-${index + 1}`} />
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
