import { getAllMessages, getMessageStats } from "@/lib/actions/messageActions";
import MessagesPageClient from "./MessagesPageClient";

async function MessagesPage() {
  const [messages, stats] = await Promise.all([
    getAllMessages({ limit: 50 }),
    getMessageStats(),
  ]);

  return (
    <MessagesPageClient
      initialMessages={messages.documents}
      totalMessages={messages.total}
      stats={stats}
    />
  );
}

export default MessagesPage;
