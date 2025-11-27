import { Layout } from "@/components/layout/MainLayout";

export default function Privacy() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose dark:prose-invert">
          <p>Last updated: November 27, 2025</p>
          <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service.</p>
          
          <h3>Information Collection</h3>
          <p>We do not collect any personal data. All tools run client-side in your browser.</p>
          
          <h3>Cookies</h3>
          <p>We use cookies to maintain your preferences (like dark mode) and for analytics/advertising purposes via third-party providers (Google AdSense).</p>
        </div>
      </div>
    </Layout>
  );
}
