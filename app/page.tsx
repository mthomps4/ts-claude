import ClaudeChat from "./ClaudeChat";

export default async function Home() {
  return (
    <div className="min-h-screen w-full">
      <main className="bg-slate-200 rounded-lg m-4 p-10">
        <h1 className="font-bold text-4xl">TS Claude</h1>
        <ClaudeChat />
      </main>
    </div>
  );
}
