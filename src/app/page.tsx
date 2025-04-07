import MajorSelection from "@/app/_components/MajorSelection";
export default function Page() {
  return (
    <main className="flex justify-center items-center h-screen text-2xl">
      <div className="flex flex-col gap-4 justify-center items-center p-16 rounded-xl border w-lg h-min">
        <p>Select a major!</p>
        <MajorSelection />
      </div>
    </main>
  );
}
