import { Card } from "@/components/ui/card";
import { Shield, Infinity, RefreshCw, HeadphonesIcon } from "lucide-react";

export default function Commitment() {
  const commitments = [
    {
      icon: Shield,
      title: "Our pass pledge",
      description: "Complete your entire AI study plan and don't pass? Get 3 additional months free to try again.",
      color: "from-primary to-blue-600",
    },
    {
      icon: Infinity,
      title: "Pass once, review forever",
      description: "When you pass your exam, keep lifetime free access to that certification's materials for refreshers and renewals.",
      color: "from-chart-3 to-emerald-600",
    },
    {
      icon: RefreshCw,
      title: "Always up-to-date",
      description: "Study materials updated with every exam change.",
      color: "from-chart-2 to-cyan-500",
    },
    {
      icon: HeadphonesIcon,
      title: "Expert support",
      description: "Stuck on a concept? Get help from certified professionals.",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3" data-testid="text-commitment-title">
            Our Commitment to You
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {commitments.map((commitment, index) => (
            <Card key={index} className="p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300" data-testid={`card-commitment-${index}`}>
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${commitment.color} mb-4 shadow-lg`}>
                <commitment.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2" data-testid={`text-commitment-title-${index}`}>
                {commitment.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-commitment-description-${index}`}>
                {commitment.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
