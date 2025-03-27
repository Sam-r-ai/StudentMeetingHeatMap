import MajorSelection from "@/app/_components/MajorSelection";

export default function Page() {
  return (
    <main className="flex flex-col gap-4 text-2xl justify-center items-center h-screen">
      <p>Select a major!</p>
      <MajorSelection />
    </main>
  );
}
