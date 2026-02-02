import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  useMutation,
  useSuspenseQuery,
  queryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchIdea, updateIdea } from "@/api/ideas";
import Modal from "@/components/Modal";

const ideasQueryOptions = (ideaId: string) =>
  queryOptions({
    queryKey: ["ideas", ideaId],
    queryFn: () => fetchIdea(ideaId),
  });

export const Route = createFileRoute("/ideas/$ideaId/edit")({
  component: IdeaEditPage,
  loader: async ({ context: { queryClient }, params }) => {
    return queryClient.ensureQueryData(ideasQueryOptions(params.ideaId));
  },
});

function IdeaEditPage() {
  const { ideaId } = Route.useParams();
  const { data: idea } = useSuspenseQuery(ideasQueryOptions(ideaId));
  const navigate = useNavigate();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [errorModal, setErrorModal] = useState<{
    title: string;
    message: string;
  } | null>(null);

  const [title, setTitle] = useState(idea.title);
  const [summary, setSummary] = useState(idea.summary);
  const [description, setDescription] = useState(idea.description);
  const [tagsInput, setTagsInput] = useState(idea.tags.join(", "));
  const updatedIdea = {
    title,
    summary,
    description,
    tags: tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    createdAt: idea.createdAt,
  };

  const queryClient = useQueryClient();

  const { mutateAsync: updateMutate, isPending } = useMutation({
    mutationFn: () => updateIdea(ideaId, updatedIdea),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      queryClient.invalidateQueries({ queryKey: ["ideas", ideaId] });
      navigate({ to: "/ideas/$ideaId", params: { ideaId } });
    },
    onError: () => {
      setErrorModal({
        title: "Update failed",
        message: "Failed to update idea. Please try again.",
      });
    },
  });

  const handleEdit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setIsConfirmOpen(true);
  };

  const confirmEdit = async () => {
    setIsConfirmOpen(false);
    await updateMutate();
  };

  return (
    <div className="space-y-6">
      <div className=" flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Edit Idea</h1>
        <Link
          to="/ideas/$ideaId"
          params={{ ideaId }}
          className="inline-block text-blue-600 text-sm underline py-2 rounded hover:text-blue-800 hover:font-semibold transition mb-4"
        >
          Back to Idea
        </Link>
      </div>
      <form className="space-y-6" onSubmit={handleEdit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Enter idea title"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="summary"
            className="block text-sm font-medium text-gray-700"
          >
            Summary
          </label>
          <input
            type="text"
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Enter a brief summary of your idea"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Describe your idea in detail"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700"
          >
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="e.g., tech, health, finance"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          {isPending ? "Editing..." : "Edit Idea"}
        </button>
      </form>
      <Modal
        isOpen={isConfirmOpen}
        title="Edit idea?"
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
            onClick={confirmEdit}
            className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
          >
            Edit
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
