export const usePlayerStore = defineStore("usePlayerStore", () => {
  const {
    data: allPlayers,
    refresh: refreshAllPlayers,
    status: allPlayersStatus,
    error: allPlayersError,
  } = useFetch<PlayerWithStats[]>(() => "/api/player", {
    method: "GET",
    lazy: true,
    immediate: false,
  });

  return {
    allPlayers,
    refreshAllPlayers,
    allPlayersStatus,
    allPlayersError,
  };
});
