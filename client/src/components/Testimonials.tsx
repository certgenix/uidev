import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "I thought I was weak in Domain 3, but CertGenix turned it into my best score.",
      author: "Sarah M.",
      role: "CISSP Certified",
    },
    {
      quote: "Finally, a platform that felt like it understood me. I didn't waste time on things I already knew.",
      author: "James L.",
      role: "PMP Certified",
    },
    {
      quote: "I passed my exam and walked into work confident about applying it right away.",
      author: "Priya K.",
      role: "CISM Certified",
    },
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4" data-testid="text-testimonials-title">
            What Our Learners Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 hover-elevate" data-testid={`card-testimonial-${index}`}>
              <Quote className="h-8 w-8 text-primary mb-4" />
              <p className="text-foreground mb-6 text-lg" data-testid={`text-testimonial-quote-${index}`}>
                "{testimonial.quote}"
              </p>
              <div className="border-t pt-4">
                <p className="font-semibold" data-testid={`text-testimonial-author-${index}`}>
                  {testimonial.author}
                </p>
                <p className="text-sm text-muted-foreground" data-testid={`text-testimonial-role-${index}`}>
                  {testimonial.role}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
