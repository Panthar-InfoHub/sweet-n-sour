import { ContactForm } from "@/components/store/contact/contact-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with us. We'd love to hear from you!",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-muted-foreground">
            Have a question or feedback? Fill out the form below and we'll get back to you via
            WhatsApp!
          </p>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
