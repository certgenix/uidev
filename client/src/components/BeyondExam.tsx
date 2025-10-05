import { CheckCircle2 } from "lucide-react";
import careerImage from "@assets/generated_images/Professional_career_success_workplace_scene_48bc8cb9.png";

export default function BeyondExam() {
  const features = [
    {
      title: "Real-World Scenarios to Build Your Job-Readiness",
      description: "Practice applying certification concepts in real job situations.",
    },
    {
      title: "Walk Into Any Interview Prepared",
      description: "Be prepared to answer, 'How did you apply this framework in practice?'",
    },
    {
      title: "Career Growth Roadmap",
      description: "See which roles and opportunities open up after your certification.",
    },
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3" data-testid="text-beyond-title">
            Your Journey Doesn't Stop at Passing the Exam
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-beyond-subtitle">
            Earning your certification is just the beginning. CertGenix helps you take the next step — applying your new skills with confidence at work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-3" data-testid={`feature-${index}`}>
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1" data-testid={`text-feature-title-${index}`}>
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid={`text-feature-description-${index}`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
            <p className="text-base font-medium text-chart-2 pt-3" data-testid="text-beyond-highlight">
              CertGenix prepares you not just for the exam — but for the job, the promotion, and the impact you want to make.
            </p>
          </div>

          <div className="relative">
            <img
              src={careerImage}
              alt="Professional career success"
              className="rounded-lg shadow-lg w-full h-auto"
              data-testid="img-career"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
