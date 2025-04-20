import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

interface ApiRequestOptions {
  method: string;
  data?: unknown;
}

export async function apiRequest(
  methodOrUrl: string,
  urlOrData?: string | unknown,
  data?: unknown,
): Promise<any> {
  let method: string;
  let url: string;
  let body: unknown;

  // Handle both call patterns:
  // apiRequest(method, url, data) - old style
  // apiRequest(url, options) - new style
  if (typeof urlOrData === 'string') {
    // Old style: apiRequest('POST', '/api/login', { username, password })
    method = methodOrUrl;
    url = urlOrData;
    body = data;
  } else if (typeof urlOrData === 'object' && urlOrData !== null) {
    // New style with options object
    url = methodOrUrl;
    const options = urlOrData as ApiRequestOptions;
    method = options.method;
    body = options.data;
  } else {
    // Just URL and method (like 'GET', '/api/user')
    method = methodOrUrl;
    url = urlOrData as string;
    body = undefined;
  }

  console.log(`API Request: ${method} ${url}`, body);

  try {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    
    // For DELETE operations or when no content is expected
    if (res.status === 204) {
      return { success: true };
    }
    
    const responseData = await res.json();
    console.log(`API Response from ${url}:`, responseData);
    return responseData;
  } catch (error) {
    console.error(`API Error in ${method} ${url}:`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
