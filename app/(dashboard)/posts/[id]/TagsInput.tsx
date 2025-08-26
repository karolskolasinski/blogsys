import ChevronIcon from "@/public/icons/blogsys/chevron-right.svg";
import { useState } from "react";

type TagsInputProps = {
  tags: string[];
  allTags?: string[];
  setTags: (fn: (prev: string[]) => string[]) => void;
};

export default function TagsInput(props: TagsInputProps) {
  const { tags, allTags, setTags } = props;
  const [tagInput, setTagInput] = useState("");

  function addTag() {
    if (tags.length >= 3) {
      return;
    }
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags((prev) => [...prev, newTag]);
    }
    setTagInput("");
  }

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="group flex-1 relative inline-block">
        <input
          list="tag"
          name="tag"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleEnter}
          maxLength={20}
          className="w-full bg-white p-2 border border-gray-300 rounded-lg shadow disabled:cursor-not-allowed"
          placeholder={tags.length >= 3 ? "Możesz dodać maksymalnie 3 tagi" : "Wpisz tag"}
          title="Możesz dodać maksymalnie 3 tagi"
          disabled={tags.length >= 3}
        />
        <datalist id="tag">
          {allTags?.map((tag) => <option key={tag} value={tag} />)}
        </datalist>

        <ChevronIcon className="hidden group-hover:block group-focus-within:block w-5 h-5 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transform rotate-90" />
      </div>

      <button
        type="button"
        onClick={addTag}
        className="button disabled:opacity-30 disabled:!translate-0"
        title="Możesz dodać maksymalnie 3 tagi"
        disabled={tags.length >= 3}
      >
        Dodaj
      </button>
    </div>
  );
}
