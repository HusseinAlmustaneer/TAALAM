import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

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

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export function getQueryFn<TData>(options: { on401: UnauthorizedBehavior }) {
  const queryFn: QueryFunction<TData> = async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (options.on401 === "returnNull" && res.status === 401) {
      return null as unknown as TData;
    }

    await throwIfResNotOk(res);
    const data = await res.json();
    
    // التحقق ما إذا كان هيكل الاستجابة يحتوي على حقل user وعلامة نجاح
    if (data.success === true && data.user) {
      return data.user as unknown as TData;
    } else if (data.success === false) {
      throw new Error(data.message || "حدث خطأ غير معروف");
    }
    
    // إرجاع البيانات مباشرة إذا لم تكن بالتنسيق الجديد
    return data as TData;
  };
  
  return queryFn;
}

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
