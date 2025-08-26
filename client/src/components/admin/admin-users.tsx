
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

interface UserData {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  conversationCount: number;
  lastActive: string;
  status: 'active' | 'idle' | 'inactive';
}

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: users, isLoading } = useQuery<UserData[]>({
    queryKey: ['/api/admin/users'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const filteredUsers = users?.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: "success" as const, color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
      idle: { variant: "warning" as const, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
      inactive: { variant: "secondary" as const, color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-blue-100 dark:bg-blue-800 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-2">User Management</h1>
        <p className="text-blue-600 dark:text-blue-400">Manage registered users and their activity</p>
      </div>

      <Card className="bg-white dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center">
              <i className="fas fa-users mr-2 text-blue-600"></i>
              Registered Users ({filteredUsers.length})
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 text-sm"></i>
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 border-blue-200 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-blue-900/30"
                />
              </div>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                <i className="fas fa-plus mr-2"></i>
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-users text-blue-300 text-4xl mb-4"></i>
              <p className="text-blue-600 dark:text-blue-400">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-blue-200 dark:border-blue-700">
                    <TableHead className="text-blue-700 dark:text-blue-300">User</TableHead>
                    <TableHead className="text-blue-700 dark:text-blue-300">Email</TableHead>
                    <TableHead className="text-blue-700 dark:text-blue-300">Conversations</TableHead>
                    <TableHead className="text-blue-700 dark:text-blue-300">Last Active</TableHead>
                    <TableHead className="text-blue-700 dark:text-blue-300">Status</TableHead>
                    <TableHead className="text-blue-700 dark:text-blue-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-blue-100 dark:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/10">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-blue-800 dark:text-blue-200">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-blue-500 dark:text-blue-400">ID: {user.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-blue-600 dark:text-blue-400">{user.email}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-200">
                          {user.conversationCount || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-blue-600 dark:text-blue-400">{user.lastActive || 'Never'}</TableCell>
                      <TableCell>
                        {getStatusBadge(user.status || 'inactive')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                            <i className="fas fa-eye text-xs"></i>
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                            <i className="fas fa-trash text-xs"></i>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
