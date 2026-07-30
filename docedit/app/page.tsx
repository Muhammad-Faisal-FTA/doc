import UserSwitcher from "@/components/UserSwitcher";
import NewDocumentButton from "@/components/NewDocumentButton";
import UploadWidget from "@/components/UploadWidget";
import DocumentList from "@/components/DocumentList";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">DocEdit</h1>
          <p className="text-sm text-gray-400">A minimal collaborative document editor</p>
        </div>
        <UserSwitcher />
      </header>

      <div className="mb-8 flex flex-wrap items-start gap-4">
        <NewDocumentButton />
        <UploadWidget />
      </div>

      <DocumentList />
    </main>
  );
}
