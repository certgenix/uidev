import { Target, Bot, Clock, TrendingUp, Globe, Rocket } from "lucide-react";

export default function Benefits() {
  const benefits = [
    {
      icon: Target,
      title: "Practice exams that feel like the real thing",
      description: "Practice for PMP, CISSP, CCSP, CISM, and more in true exam conditions.",
      color: "from-red-500 to-orange-500",
      gridClass: "lg:col-span-2 lg:row-span-1",
      featured: true,
    },
    {
      icon: Bot,
      title: "Your plan adapts to you, not the other way around",
      description: "We figure out what you're good at and what you need to work on.",
      color: "from-primary to-blue-600",
      gridClass: "lg:col-span-1 lg:row-span-2",
      featured: true,
    },
    {
      icon: Clock,
      title: "Study when it works for you—even if that's 20 minutes before bed",
      description: "Flexible study blocks that fit your schedule.",
      color: "from-purple-500 to-pink-500",
      gridClass: "lg:col-span-1 lg:row-span-1",
      featured: false,
    },
    {
      icon: TrendingUp,
      title: "We'll tell you exactly when you're ready to pass—no guessing",
      description: "Always know when you're exam-ready with our confidence tracking.",
      color: "from-chart-3 to-emerald-600",
      gridClass: "lg:col-span-1 lg:row-span-1",
      featured: false,
    },
    {
      icon: Globe,
      title: "Use what you learn at work, not just on test day",
      description: "Learn with case studies and scenarios that prepare you for your job, not just the test.",
      color: "from-chart-2 to-cyan-500",
      gridClass: "lg:col-span-1 lg:row-span-1",
      featured: false,
    },
    {
      icon: Rocket,
      title: "Land the job you want",
      description: "Move beyond exams into mastery and professional growth.",
      color: "from-amber-500 to-yellow-500",
      gridClass: "lg:col-span-2 lg:row-span-1",
      featured: true,
    },
  ];

  return (
    <section id="benefits" className="py-16 md:py-24 lg:py-32 relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-benefits-title">
            Why Choose CertGenix?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 auto-rows-fr">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`group relative ${benefit.gridClass}`}
              data-testid={`card-benefit-${index}`}
            >
              <div className="relative h-full">
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                
                <div className={`relative h-full bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 ${benefit.featured ? 'bg-card/80' : ''}`}>
                  <div className="flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                        <benefit.icon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold tracking-wider text-primary/60 mb-2 uppercase">
                          Benefit {index + 1}
                        </div>
                        <h3 
                          className={`${benefit.featured ? 'text-xl lg:text-2xl' : 'text-lg lg:text-xl'} font-bold leading-tight mb-3 transition-colors duration-300 group-hover:text-primary`} 
                          data-testid={`text-benefit-title-${index}`}
                        >
                          {benefit.title}
                        </h3>
                      </div>
                    </div>
                    
                    <p 
                      className={`${benefit.featured ? 'text-base' : 'text-sm'} text-muted-foreground leading-relaxed mt-auto`} 
                      data-testid={`text-benefit-description-${index}`}
                    >
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
