import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

interface EnvData {
  environment: string;
  variables: Array<{
    name: string;
    value: string;
    type: 'public' | 'secret';
    description?: string;
  }>;
  models: Array<{
    name: string;
    status: 'active' | 'inactive';
    type: 'local' | 'cloud';
    description: string;
  }>;
}

export default function AdminEnv() {
  const { data: envData, isLoading } = useQuery<EnvData>({
    queryKey: ['/api/admin/env'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse bg-white dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-6">
            <div className="h-8 bg-blue-100 dark:bg-blue-800 rounded mb-4"></div>
            <div className="h-32 bg-blue-100 dark:bg-blue-800 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const defaultEnvData: EnvData = {
    environment: 'development',
    variables: [
      { name: 'NODE_ENV', value: 'development', type: 'public', description: 'Application environment' },
      { name: 'ADMIN_KEY', value: '••••••••', type: 'secret', description: 'Admin access key' }
    ],
    models: [
      { name: 'GPT-4', status: 'active', type: 'cloud', description: 'OpenAI GPT-4 via OpenRouter' },
      { name: 'Claude-3', status: 'active', type: 'cloud', description: 'Anthropic Claude-3 via OpenRouter' },
      { name: 'Llama-2-7b', status: 'active', type: 'local', description: 'Meta Llama-2 7B (Local HF)' },
      { name: 'CodeLlama', status: 'inactive', type: 'local', description: 'Code generation model' }
    ]
  };

  const actualEnvData = envData || defaultEnvData;

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
        <i className="fas fa-check-circle mr-1"></i>
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
        <i className="fas fa-times-circle mr-1"></i>
        Inactive
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    return type === 'local' ? (
      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
        <i className="fas fa-server mr-1"></i>
        Local
      </Badge>
    ) : (
      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
        <i className="fas fa-cloud mr-1"></i>
        Cloud
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-2">Environment & Models</h1>
        <p className="text-blue-600 dark:text-blue-400">Manage system configuration and AI models</p>
      </div>

      {/* Environment Variables */}
      <Card className="bg-white dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center">
            <i className="fas fa-cogs mr-2 text-blue-600"></i>
            Environment Variables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-blue-200 dark:border-blue-700">
                  <TableHead className="text-blue-700 dark:text-blue-300">Variable</TableHead>
                  <TableHead className="text-blue-700 dark:text-blue-300">Value</TableHead>
                  <TableHead className="text-blue-700 dark:text-blue-300">Type</TableHead>
                  <TableHead className="text-blue-700 dark:text-blue-300">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actualEnvData.variables.map((variable, index) => (
                  <TableRow key={index} className="border-blue-100 dark:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/10">
                    <TableCell className="font-mono text-blue-800 dark:text-blue-200">{variable.name}</TableCell>
                    <TableCell className="font-mono text-blue-600 dark:text-blue-400">
                      {variable.type === 'secret' ? '••••••••' : variable.value}
                    </TableCell>
                    <TableCell>
                      <Badge className={variable.type === 'secret' 
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      }>
                        {variable.type === 'secret' ? (
                          <><i className="fas fa-lock mr-1"></i>Secret</>
                        ) : (
                          <><i className="fas fa-eye mr-1"></i>Public</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-blue-600 dark:text-blue-400">{variable.description || 'No description'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* AI Models */}
      <Card className="bg-white dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center">
              <i className="fas fa-robot mr-2 text-blue-600"></i>
              AI Models ({actualEnvData.models.length})
            </CardTitle>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              <i className="fas fa-plus mr-2"></i>
              Add Model
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-blue-200 dark:border-blue-700">
                  <TableHead className="text-blue-700 dark:text-blue-300">Model</TableHead>
                  <TableHead className="text-blue-700 dark:text-blue-300">Type</TableHead>
                  <TableHead className="text-blue-700 dark:text-blue-300">Status</TableHead>
                  <TableHead className="text-blue-700 dark:text-blue-300">Description</TableHead>
                  <TableHead className="text-blue-700 dark:text-blue-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actualEnvData.models.map((model, index) => (
                  <TableRow key={index} className="border-blue-100 dark:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/10">
                    <TableCell className="font-semibold text-blue-800 dark:text-blue-200">{model.name}</TableCell>
                    <TableCell>{getTypeBadge(model.type)}</TableCell>
                    <TableCell>{getStatusBadge(model.status)}</TableCell>
                    <TableCell className="text-blue-600 dark:text-blue-400">{model.description}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                          <i className="fas fa-cog text-xs"></i>
                        </Button>
                        <Button size="sm" variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
                          <i className="fas fa-play text-xs"></i>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="bg-white dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center">
            <i className="fas fa-server mr-2 text-blue-600"></i>
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-600 dark:text-blue-400">Environment:</span>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {actualEnvData.environment}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600 dark:text-blue-400">Active Models:</span>
                <span className="text-blue-800 dark:text-blue-200 font-semibold">
                  {actualEnvData.models.filter(m => m.status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600 dark:text-blue-400">Local Models:</span>
                <span className="text-blue-800 dark:text-blue-200 font-semibold">
                  {actualEnvData.models.filter(m => m.type === 'local').length}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-600 dark:text-blue-400">Cloud Models:</span>
                <span className="text-blue-800 dark:text-blue-200 font-semibold">
                  {actualEnvData.models.filter(m => m.type === 'cloud').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600 dark:text-blue-400">Config Variables:</span>
                <span className="text-blue-800 dark:text-blue-200 font-semibold">
                  {actualEnvData.variables.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600 dark:text-blue-400">Secret Variables:</span>
                <span className="text-blue-800 dark:text-blue-200 font-semibold">
                  {actualEnvData.variables.filter(v => v.type === 'secret').length}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}