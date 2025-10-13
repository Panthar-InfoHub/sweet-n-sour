export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-4xl py-12">
        <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>

        <div className="prose prose-green max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to our website. By accessing and using this website, you accept and agree to
              be bound by the terms and provision of this agreement. If you do not agree to abide by
              the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p className="text-muted-foreground leading-relaxed">
              Permission is granted to temporarily download one copy of the materials on our website
              for personal, non-commercial transitory viewing only. This is the grant of a license,
              not a transfer of title.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Product Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We strive to provide accurate product descriptions and pricing. However, we do not
              warrant that product descriptions, pricing, or other content is accurate, complete,
              reliable, current, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Orders and Payment</h2>
            <p className="text-muted-foreground leading-relaxed">
              All orders are subject to acceptance and availability. We reserve the right to refuse
              or cancel any order for any reason. Payment must be received before order processing
              begins.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Shipping and Delivery</h2>
            <p className="text-muted-foreground leading-relaxed">
              We aim to process and ship orders within 2-3 business days. Delivery times may vary
              based on location and shipping method selected. We are not responsible for delays
              caused by shipping carriers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Returns and Refunds</h2>
            <p className="text-muted-foreground leading-relaxed">
              Please refer to our Return & Refund Policy for detailed information about returns,
              exchanges, and refunds.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall we be liable for any damages arising out of the use or inability to
              use our products or services, even if we have been advised of the possibility of such
              damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms & Conditions, please contact us at
              support@example.com
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
