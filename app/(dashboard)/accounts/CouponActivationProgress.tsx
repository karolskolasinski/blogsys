"use client";

import { useState } from "react";
import Button from "@/components/blogsys/Button";
import ActivateIcon from "@/public/activate.svg";
import SpinnerIcon from "@/public/icons/spinner.svg";

interface ProgressState {
  isActive: boolean;
  logs: Array<{
    id: string;
    login?: string;
    type: string;
    message: string;
    timestamp: Date;
    status: "info" | "success" | "error";
  }>;
  currentAccount?: string;
  progress: {
    current: number;
    total: number;
  };
}

export default function CouponActivationProgress() {
  const [state, setState] = useState<ProgressState>({
    isActive: false,
    logs: [],
    progress: { current: 0, total: 0 },
  });

  const addLog = (log: Omit<ProgressState["logs"][0], "id" | "timestamp">) => {
    setState((prev) => ({
      ...prev,
      logs: [...prev.logs, {
        ...log,
        id: Date.now().toString(),
        timestamp: new Date(),
      }],
    }));
  };

  const startActivation = async () => {
    setState((prev) => ({ ...prev, isActive: true, logs: [] }));

    try {
      const response = await fetch("/api/activate-coupons", { method: "POST" });
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              switch (data.type) {
                case "start":
                  setState((prev) => ({
                    ...prev,
                    progress: { current: 0, total: data.total },
                  }));
                  addLog({
                    type: "start",
                    message: `Rozpoczęcie aktywacji kuponów dla ${data.total} kont`,
                    status: "info",
                  });
                  break;

                case "account_start":
                  setState((prev) => ({
                    ...prev,
                    currentAccount: data.login,
                    progress: { current: data.current, total: data.total },
                  }));
                  addLog({
                    login: data.login,
                    type: "account_start",
                    message:
                      `Rozpoczynam aktywację kuponów dla konta ${data.login} (${data.current}/${data.total})`,
                    status: "info",
                  });
                  break;

                case "progress":
                  addLog({
                    login: data.login,
                    type: "progress",
                    message: data.message,
                    status: "info",
                  });
                  break;

                case "account_success":
                  addLog({
                    login: data.login,
                    type: "success",
                    message:
                      `✅ Przetwarzanie konta ${data.login} zakończone - aktywowano ${data.activatedCoupons} kuponów`,
                    status: "success",
                  });
                  break;

                case "account_error":
                  addLog({
                    login: data.login,
                    type: "error",
                    message: `❌ Błąd podczas przetwarzania konta ${data.login}: ${data.error}`,
                    status: "error",
                  });
                  break;

                case "complete":
                  addLog({
                    type: "complete",
                    message: "🎉 Wszystkie konta przetworzone!",
                    status: "success",
                  });
                  setState((prev) => ({ ...prev, isActive: false, currentAccount: undefined }));
                  break;

                case "error":
                  addLog({
                    type: "error",
                    message: `Błąd ogólny: ${data.error}`,
                    status: "error",
                  });
                  setState((prev) => ({ ...prev, isActive: false }));
                  break;
              }
            } catch (e) {
              console.error("Failed to parse SSE data:", e);
            }
          }
        }
      }
    } catch (error) {
      addLog({
        type: "error",
        message: `Błąd połączenia: ${error}`,
        status: "error",
      });
      setState((prev) => ({ ...prev, isActive: false }));
    }
  };

  return (
    <div className="pt-4 space-y-4">
      <div className="flex gap-4 items-center">
        <button onClick={startActivation} disabled={state.isActive} className="button">
          {state.isActive
            ? <SpinnerIcon className="w-5 h-5 fill-current animate-spin" />
            : <ActivateIcon className="w-5 h-5 fill-white" />}
          Aktywuj kupony
        </button>

        {state.progress.total > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(state.progress.current / state.progress.total) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-600">
              {state.progress.current}/{state.progress.total}
            </span>
          </div>
        )}
      </div>

      {state.currentAccount && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm font-medium text-blue-800">
            Aktualnie przetwarzam: {state.currentAccount}
          </p>
        </div>
      )}

      {state.logs.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium mb-2">Dziennik aktywności:</h3>
          <div className="space-y-1 text-sm font-mono break-all">
            {state.logs.map((log) => {
              const colorClass = log.status === "error"
                ? "text-red-600"
                : log.status === "success"
                ? "text-green-600"
                : "text-gray-600";

              return (
                <div key={log.id} className={`flex items-center gap-2 ${colorClass}`}>
                  <span className="text-gray-400 text-xs">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                  <span>{log.message}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
