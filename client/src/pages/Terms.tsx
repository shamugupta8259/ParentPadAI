import { Layout } from "@/components/layout/MainLayout";

export default function Terms() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <div className="prose dark:prose-invert">
          <h3>1. Acceptance of Terms</h3>
          <p>By accessing this website, you agree to be bound by these Terms of Service.</p>
          
          <h3>2. Use License</h3>
          <p>Permission is granted to temporarily download one copy of the materials (information or software) on this website for personal, non-commercial transitory viewing only.</p>
          
          <h3>3. Disclaimer</h3>
          <p>The materials on this website are provided on an 'as is' basis. We make no warranties, expressed or implied.</p>
        </div>
      </div>
    </Layout>
  );
}
