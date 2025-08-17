"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  updateMessageStatus,
  deleteMessage,
  getAllMessages,
} from "@/lib/actions/messageActions";
import { toast } from "sonner";
import {
  Search,
  Trash2,
  Eye,
  Filter,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const MessagesPageClient = ({ initialMessages, totalMessages, stats }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [filteredMessages, setFilteredMessages] = useState(initialMessages);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageStats, setMessageStats] = useState(stats);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [viewingMessage, setViewingMessage] = useState(null);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    "in-progress": "bg-brand-100 text-yellow-300 border-blue-300",
    completed: "bg-green-100 text-green-800 border-green-300",
  };

  const statusIcons = {
    pending: Clock,
    "in-progress": AlertCircle,
    completed: CheckCircle,
  };

  const statusLabels = {
    pending: "Pending",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  // Filter messages based on search and status
  useEffect(() => {
    let filtered = messages;

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (message) => message.status === selectedStatus
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (message) =>
          message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          message.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMessages(filtered);
  }, [messages, selectedStatus, searchQuery]);

  const handleStatusUpdate = async (messageId, newStatus) => {
    try {
      setIsLoading(true);
      await updateMessageStatus(messageId, newStatus);

      // Update local state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.$id === messageId ? { ...msg, status: newStatus } : msg
        )
      );

      // Update stats
      const updatedStats = { ...messageStats };
      const oldMessage = messages.find((msg) => msg.$id === messageId);
      if (oldMessage) {
        updatedStats[oldMessage.status.replace("-", "")]--;
        updatedStats[newStatus.replace("-", "")]++;
      }
      setMessageStats(updatedStats);

      toast.success("Message status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMessage = async () => {
    if (!messageToDelete) return;

    setIsDeleting(true);
    try {
      await deleteMessage(messageToDelete.$id);

      // Update local state
      setMessages((prev) =>
        prev.filter((msg) => msg.$id !== messageToDelete.$id)
      );

      // Update stats
      const updatedStats = { ...messageStats };
      updatedStats[messageToDelete.status.replace("-", "")]--;
      updatedStats.total--;
      setMessageStats(updatedStats);

      toast.success("Message deleted successfully!");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    } finally {
      setIsDeleting(false);
      setMessageToDelete(null);
    }
  };

  const handleFilterChange = async (status) => {
    setSelectedStatus(status);
    setIsLoading(true);

    try {
      const filteredMessages = await getAllMessages({
        limit: 50,
        status: status === "all" ? undefined : status,
      });
      setMessages(filteredMessages.documents);
    } catch (error) {
      console.error("Error filtering messages:", error);
      toast.error("Failed to filter messages");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateMessage = (message, length = 100) => {
    return message.length > length
      ? message.substring(0, length) + "..."
      : message;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Messages Management</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedStatus} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Messages</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                  Total
                </p>
                <p className="text-lg sm:text-xl font-bold">
                  {messageStats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                  Pending
                </p>
                <p className="text-lg sm:text-xl font-bold text-yellow-600">
                  {messageStats.pending}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                  In Progress
                </p>
                <p className="text-lg sm:text-xl font-bold text-blue-600">
                  {messageStats.inProgress}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                  Completed
                </p>
                <p className="text-lg sm:text-xl font-bold text-green-600">
                  {messageStats.completed}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages Table */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>All Messages ({filteredMessages.length})</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {/* Mobile View (sm: hidden) */}
          <div className="grid gap-4 sm:hidden">
            {filteredMessages.map((message) => {
              const StatusIcon = statusIcons[message.status];
              return (
                <Card key={message.$id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium">{message.name}</h3>
                        <p className="text-sm text-muted-foreground break-all">
                          {message.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {message.phone}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setViewingMessage(message)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive/90"
                          onClick={() => setMessageToDelete(message)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 justify-between text-sm">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {formatDate(message.$createdAt)}
                        </span>
                        {/* <Badge className={statusColors[message.status]}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusLabels[message.status]}
                        </Badge> */}
                      </div>
                      <Select
                        value={message.status}
                        onValueChange={(newStatus) =>
                          handleStatusUpdate(message.$id, newStatus)
                        }
                      >
                        <SelectTrigger className="flex-1 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              );
            })}
            {filteredMessages.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No messages found
              </div>
            )}
          </div>

          {/* Desktop View (sm: block) */}
          <div className="hidden sm:block">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((message) => {
                    const StatusIcon = statusIcons[message.status];
                    return (
                      <TableRow key={message.$id}>
                        <TableCell className="font-medium">
                          <div className="space-y-1">
                            <p className="truncate">{message.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {message.phone}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell md:text-sm">
                          {formatDate(message.$createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <Badge className={statusColors[message.status]}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusLabels[message.status]}
                            </Badge>
                            <Select
                              value={message.status}
                              onValueChange={(newStatus) =>
                                handleStatusUpdate(message.$id, newStatus)
                              }
                            >
                              <SelectTrigger className="w-full h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in-progress">
                                  In Progress
                                </SelectItem>
                                <SelectItem value="completed">
                                  Completed
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setViewingMessage(message)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive/90"
                              onClick={() => setMessageToDelete(message)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredMessages.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-6 text-muted-foreground"
                      >
                        No messages found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message View Modal */}
      <Dialog
        open={!!viewingMessage}
        onOpenChange={() => setViewingMessage(null)}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              Complete message from {viewingMessage?.name}
            </DialogDescription>
          </DialogHeader>
          {viewingMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Name
                  </h4>
                  <p className="text-sm">{viewingMessage.name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Email
                  </h4>
                  <p className="text-sm break-all">{viewingMessage.email}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Phone
                  </h4>
                  <p className="text-sm">{viewingMessage.phone || "N/A"}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Date
                  </h4>
                  <p className="text-sm">
                    {formatDate(viewingMessage.$createdAt)}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Status
                  </h4>
                  <Badge className={statusColors[viewingMessage.status]}>
                    {React.createElement(statusIcons[viewingMessage.status], {
                      className: "h-3 w-3 mr-1",
                    })}
                    {statusLabels[viewingMessage.status]}
                  </Badge>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">
                  Message
                </h4>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {viewingMessage.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!messageToDelete}
        onOpenChange={() => setMessageToDelete(null)}
      >
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              message from{" "}
              <span className="font-semibold">{messageToDelete?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMessage}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MessagesPageClient;
