import {
  createFileRoute,
  Link,
  notFound,
  useNavigate,
} from "@tanstack/react-router";
import {
  queryOptions,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchIdea, deleteIdea } from "@/api/ideas";
import Modal from "@/components/Modal";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const ideasQueryOptions = (ideaId: string) =>
  queryOptions({
    queryKey: ["ideas", ideaId],
    queryFn: () => fetchIdea(ideaId),
  });

export const Route = createFileRoute("/ideas/$ideaId/")({
  head: () => ({
    meta: [
      {
        title: "IdeaHub - Idea Details",
      },
    ],
  }),
  component: IdeaDetailsPage,
  loader: async ({ context: { queryClient }, params }) => {
    const idea = await queryClient.ensureQueryData(
      ideasQueryOptions(params.ideaId),
    );
    if (!idea) {
      throw notFound();
    }
    return { idea };
  },
});

function IdeaDetailsPage() {
  const { ideaId } = Route.useParams();
  const { data: idea } = useSuspenseQuery(ideasQueryOptions(ideaId));

  const navigate = useNavigate();
  const { user } = useAuth();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [errorModal, setErrorModal] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const queryClient = useQueryClient();

  const { mutateAsync: deleteMutate, isPending } = useMutation({
    mutationFn: () => deleteIdea(ideaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      queryClient.invalidateQueries({ queryKey: ["ideas", ideaId] });
      navigate({ to: "/ideas" });
    },
    onError: () => {
      setErrorModal({
        title: "Delete failed",
        message: "Failed to delete idea. Please try again.",
      });
    },
  });

  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setIsConfirmOpen(false);
    await deleteMutate();
  };

  return (
    <div className="p-4">
      <div className="mt-6">
        <Link
          to="/ideas"
          className="inline-block text-blue-600 text-sm underline py-2 rounded hover:text-blue-800 hover:font-semibold transition mb-4"
        >
          Back to Ideas
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-2">{idea.title}</h1>
      <p>
        By {user?.name} - {new Date(idea.createdAt).toLocaleDateString()}
      </p>
      <p className="text-gray-700">{idea.summary}</p>
      <p className="text-gray-600 mt-4">{idea.description}</p>

      {user && user?.id === idea.user && (
        <>
          {/* Edit Link */}
          <Link
            to="/ideas/$ideaId/edit"
            params={{ ideaId }}
            className="inline-block bg-yellow-500 text-white text-sm px-4 mt-4 mr-2 py-2 rounded hover:bg-yellow-600 transition"
          >
            Edit
          </Link>

          {/* Delete Button */}
          <button
            disabled={isPending}
            className="text-sm bg-red-600 text-white mt-4 px-4 py-2 rounded transition disabled:opacity-50 hover:bg-red-700"
            onClick={handleDelete}
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </>
      )}

      <Modal
        isOpen={isConfirmOpen}
        title="Delete idea?"
        onClose={() => setIsConfirmOpen(false)}
        showDefaultAction={false}
      >
        <p className="text-gray-700">
          This action cannot be undone. Do you want to continue?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsConfirmOpen(false)}
            className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={!!errorModal}
        title={errorModal?.title}
        onClose={() => setErrorModal(null)}
      >
        {errorModal?.message}
      </Modal>
    </div>
  );
}
