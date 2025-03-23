import { AuthMenu } from "@/module/auth/menu"
import { HomePage } from "@/system/route"
import { ThemeSelect } from "@/system/theme"

export const metadata = HomePage.Metadata

function Header() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 mx-auto flex max-w-5xl items-center gap-2 rounded-md border px-3 py-2 backdrop-blur-sm">
      <h2 className="mr-auto text-2xl">Guppy</h2>
      <AuthMenu />
      <ThemeSelect />
    </header>
  )
}

function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm">
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

export default function IndexPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto mt-24 px-4 pt-24">
        {/* Hero Section */}
        <section className="mb-20 text-center">
          <h1 className="mb-6 text-5xl font-bold">
            One Link, Endless Possibilities
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
            Share all your important links with your audience using a single,
            customizable Guppy profile.
          </p>
        </section>

        {/* Features Grid */}
        <section className="mb-20">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              title="Simple Setup"
              description="Create your profile in minutes. Add your social media, portfolio, store, and any other links."
            />
            <FeatureCard
              title="Customizable Design"
              description="Make your profile uniquely yours with custom themes, colors, and layouts that match your brand."
            />
            <FeatureCard
              title="Analytics & Insights"
              description="Track clicks, understand your audience, and optimize your link performance with detailed analytics."
            />
            <FeatureCard
              title="Mobile Optimized"
              description="Your Guppy profile looks great on all devices, ensuring a perfect experience for every visitor."
            />
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="mb-20 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Join thousands of creators using Guppy
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Musicians, artists, entrepreneurs, and influencers trust Guppy to
            connect with their audience.
          </p>
        </section>
      </main>
    </div>
  )
}
