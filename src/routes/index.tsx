import { createFileRoute, Link } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";
import { fetchIdeas } from "@/api/ideas";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import IdeaCard from "@/components/IdeaCard";

const ideasQueryOptions = queryOptions({
  queryKey: ["ideas", { limit: 3 }],
  queryFn: () => fetchIdeas(3),
});

export const Route = createFileRoute("/")({
  component: HomePage,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(ideasQueryOptions),
});

function HomePage() {
  const { data: ideas } = useSuspenseQuery(ideasQueryOptions);

  return (
    <div className="flex flex-col md:flex-row items-start justify-between gap-10 p-6 text-blue-600">
      <div className="flex w-full flex-col items-start gap-4 md:w-1/2">
        <Lightbulb className="w-16 h-16 text-yellow-400" />
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to IdeaDrop
        </h1>
        <p className="text-gray-600 w-full max-w-none md:max-w-xs">
          Share, explore, and build on the best startup ideas and side hustles.
        </p>
      </div>

      <section className="w-full md:flex-1 md:w-1/2">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Latest Ideas
        </h2>
        <ul className="space-y-6">
          {ideas.map((idea) => (
            <IdeaCard key={idea._id} idea={idea} button={false} />
          ))}
        </ul>

        <div className="mt-6">
          <a
            href="/ideas"
            className="w-full text-center inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md transition"
          >
            View All Ideas
          </a>
        </div>
      </section>
    </div>
  );
}
