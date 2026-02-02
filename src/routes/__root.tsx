import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
  Link,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClient } from "@tanstack/react-query";
import Header from "@/components/header";

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        name: "description",
        content:
          "Share, explore and build on the best startup ideas and side hustles.",
      },
      {
        title: "IdeaDrop - Your Idea Hub",
      },
    ],
  }),

  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <HeadContent />
      <Header />
      <main className="flex justify-center py-6">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-2xl p-8">
          <Outlet />
        </div>
      </main>
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </div>
  );
}

function NotFound() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-700">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="text-center mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
