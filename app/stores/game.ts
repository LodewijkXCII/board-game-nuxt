import type { SelectBoardGameWithExpansions } from "~~/server/db/schema";

export const useGameStore = defineStore("useGameStore", () => {
  const {
    data: allGames,
    refresh: refreshAllGames,
    status: allGamesStatus,
    error: allGamesError,
  } = useFetch<SelectBoardGameWithExpansions[]>(() => "/api/board-games", {
    method: "GET",
    lazy: true,
    immediate: false,
  });

  function findGameById(id: number) {
    return allGames.value?.find(s => s.id === id);
  };
  const selectedGame = ref<SelectBoardGameWithExpansions | null>(null);

  return {
    allGames,
    refreshAllGames,
    allGamesStatus,
    allGamesError,
    findGameById,
    selectedGame,
  };
});
