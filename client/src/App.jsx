
import Button from "./components/ui/Button";

function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-page p-6">
      <div className="w-full max-w-md space-y-5 rounded-card border border-border-main bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-navy">
          CareerForge AI
        </h1>

        <p className="text-text-muted">
          Our reusable button component
        </p>

        <div className="flex flex-col gap-3">
          <Button>Sign In</Button>

          <Button variant="secondary">
            View Progress
          </Button>

          <Button variant="outline">
            Cancel
          </Button>

          <Button isLoading>
            Loading
          </Button>
        </div>
      </div>
    </main>
  );
}

export default App;