import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { createIdea } from "@/api/ideas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "@/components/Modal";

export const Route = createFileRoute("/ideas/new/")({
  component: NewIdeasPage,
});

function NewIdeasPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<{ title: string; message: string } | null>(
    null,
  );

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      navigate({ to: "/ideas" });
    },
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !description.trim()) {
      setModal({
        title: "Missing required fields",
        message: "Please fill in all required fields before submitting.",
      });
      return;
    }
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
    try {
      await mutateAsync({
        title,
        summary,
        description,
        tags: tagsArray,
      });
    } catch (err) {
      setModal({
        title: "Submission failed",
        message: "Failed to submit idea. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className=" flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Submit a New Idea</h1>
        <Link
          to="/ideas"
          className="inline-block text-blue-600 text-sm underline py-2 rounded hover:text-blue-800 hover:font-semibold transition mb-4"
        >
          Back to Ideas
        </Link>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
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
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="e.g., tech, health, finance"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          {isPending ? "Submitting..." : "Submit Idea"}
        </button>
      </form>
      <Modal
        isOpen={!!modal}
        title={modal?.title}
        onClose={() => setModal(null)}
      >
        {modal?.message}
      </Modal>
    </div>
  );
}
