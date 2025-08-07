import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getQueryFn } from "@/lib/queryClient";

interface EnvVar {
  key: string;
  value: string;
  masked: boolean;
}

interface EnvData {
  variables: EnvVar[];
}

export default function AdminEnv() {
  const { data: envData, isLoading } = useQuery<EnvData>({
    queryKey: ['/api/admin/env'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const maskValue = (value: string, shouldMask: boolean) => {
    if (!shouldMask) return value;
    if (value.length <= 8) return '*'.repeat(value.length);
    return value.substring(0, 4) + '*'.repeat(24) + value.substring(value.length - 4);
  };

  const defaultEnvVars: EnvVar[] = [
    { key: 'HF_LOCAL_URL', value: 'http://localhost:8000', masked: false },
    { key: 'OPENROUTER_KEY', value: 'sk-or-v1-********************************', masked: true },
    { key: 'ADMIN_KEY', value: 'flamgio_admin_2024_secure_key', masked: true },
    { key: 'DATABASE_URL', value: 'postgresql://user:pass@localhost:5432/flamgio', masked: true },
    { key: 'NODE_ENV', value: 'production', masked: false },
    { key: 'PORT', value: '5000', masked: false }
  ];

  const envVars = envData?.variables || defaultEnvVars;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Environment Variables</h1>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>.env Configuration</CardTitle>
            <span className="text-sm text-gray-500 dark:text-gray-400">Read-only view</span>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 animate-pulse">
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-700 rounded w-3/4"></div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
                <div className="space-y-2">
                  <div># Flamgio AI Environment Configuration</div>
                  <div></div>
                  <div># Hugging Face Local Model URL</div>
                  <div data-testid="env-hf-local">HF_LOCAL_URL={maskValue(envVars.find(v => v.key === 'HF_LOCAL_URL')?.value || '', false)}</div>
                  <div></div>
                  <div># OpenRouter API Configuration</div>
                  <div data-testid="env-openrouter">OPENROUTER_KEY={maskValue(envVars.find(v => v.key === 'OPENROUTER_KEY')?.value || '', true)}</div>
                  <div></div>
                  <div># Admin Panel Authentication</div>
                  <div data-testid="env-admin">ADMIN_KEY={maskValue(envVars.find(v => v.key === 'ADMIN_KEY')?.value || '', true)}</div>
                  <div></div>
                  <div># PostgreSQL Database</div>
                  <div data-testid="env-database">DATABASE_URL={maskValue(envVars.find(v => v.key === 'DATABASE_URL')?.value || '', true)}</div>
                  <div></div>
                  <div># Application Settings</div>
                  <div data-testid="env-node">NODE_ENV={maskValue(envVars.find(v => v.key === 'NODE_ENV')?.value || '', false)}</div>
                  <div data-testid="env-port">PORT={maskValue(envVars.find(v => v.key === 'PORT')?.value || '', false)}</div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                <div className="flex items-start space-x-3">
                  <i className="fas fa-exclamation-triangle text-yellow-600 dark:text-yellow-400 mt-1"></i>
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Security Notice</h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Sensitive values are masked for security. Never share these credentials.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
