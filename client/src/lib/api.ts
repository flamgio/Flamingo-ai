
const API_BASE = "";

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }

  return res;
}

export const sendMessage = async (data: { message: string; conversationId?: string }) => {
  const response = await apiRequest("POST", "/api/chat", data);
  return response.json();
};

export const getConversations = async () => {
  const response = await apiRequest("GET", "/api/conversations");
  return response.json();
};

export const getConversation = async (id: string) => {
  const response = await apiRequest("GET", `/api/conversations/${id}`);
  return response.json();
};

export const deleteConversation = async (id: string) => {
  const response = await apiRequest("DELETE", `/api/conversations/${id}`);
  return response.json();
};

export const enhancePrompt = async (data: { prompt: string }) => {
  const response = await apiRequest("POST", "/api/enhance-prompt", data);
  return response.json();
};
