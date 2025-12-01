import { getAllMessages, getMessageStats } from "@/lib/actions/messageActions";
import MessagesPageClient from "./MessagesPageClient";

async function MessagesPage() {
  let messages = { documents: [], total: 0 };
  let stats = { total: 0, pending: 0, completed: 0, inProgress: 0 };

  try {
    [messages, stats] = await Promise.all([
      getAllMessages({ limit: 50 }),
      getMessageStats(),
    ]);
  } catch (error) {
    console.error("Error fetching messages:", error);
    // Return default empty state if there's an error
  }

  return (
    <MessagesPageClient
      initialMessages={messages?.documents || []}
      totalMessages={messages?.total || 0}
      stats={stats || { total: 0, pending: 0, completed: 0, inProgress: 0 }}
    />
  );
}

export default MessagesPage;
