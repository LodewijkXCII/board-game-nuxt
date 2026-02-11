import type { SelectGameSession } from "~~/server/db/schema";

export const useSessionStore = defineStore("useSessionStore", () => {
  const {
    data: allSessions,
    refresh: refreshAllSessions,
    status: allSessionsStatus,
    error: allSessionsError,
  } = useFetch<SelectGameSession[]>(() => "/api/sessions", {
    method: "GET",
    lazy: true,
    immediate: false,
  });

  const findSessionById = (id: number) => {
    return allSessions.value?.find(s => s.id === id);
  };

  const selectedSession = ref<SelectGameSession | null>(null);

  return {
    allSessions,
    refreshAllSessions,
    allSessionsStatus,
    allSessionsError,

    findSessionById,
    selectedSession,
  };
});
