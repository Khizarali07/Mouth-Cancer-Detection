import React from "react";
import { getCurrentUser } from "@/lib/actions/userActions";
import { getAdminStats } from "@/lib/actions/adminActions";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Users, FileText, HardDrive, Clock } from "lucide-react";

const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const RecentActivityCard = ({ title, items, type }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.$id} className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            {type === "user" ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">
                {type === "user"
                  ? item.fullName.slice(0, 15)
                  : item.name.slice(0, 15)}
              </p>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500 ml-4 flex-shrink-0 w-32 justify-end">
            <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">
              {formatDistanceToNow(new Date(item.$createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AdminPage = async () => {
  const currentUser = await getCurrentUser();

  // Redirect to login if no user is found
  if (!currentUser) return redirect("/login");

  // Redirect to root if user is not an admin
  if (!currentUser.isAdmin) return redirect("/");

  const stats = await getAdminStats();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Welcome,</span>
          <span className="font-medium">{currentUser.fullName}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Files"
          value={stats.totalFiles}
          icon={FileText}
          color="bg-green-500"
        />
        <StatCard
          title="Storage Used"
          value={formatBytes(stats.totalStorageUsed)}
          icon={HardDrive}
          color="bg-purple-500"
        />
        <StatCard
          title="Active Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityCard
          title="Recent Users"
          items={stats.recentUsers}
          type="user"
        />
        <RecentActivityCard
          title="Recent Files"
          items={stats.recentFiles}
          type="file"
        />
      </div>
    </div>
  );
};

export default AdminPage;
