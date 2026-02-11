<script  lang="ts" setup>
import type { SelectBoardGameWithExpansions } from "~~/server/db/schema";

const gameStore = useGameStore();
const { allGames, selectedGame } = storeToRefs(gameStore);
const searchQuery = ref("");
const searchPlayed = ref<boolean | null>(null);

const gameModal = ref<HTMLDialogElement | null>(null);
const modalMode = ref<"create" | "update">("create");

const isFilterDefault = computed(() => {
  return searchQuery.value === ""
    && searchPlayed.value === null;
});

const filteredGames = computed(() => {
  if (!allGames.value) {
    return [];
  }

  const query = searchQuery.value.toLowerCase();
  const filterStatus = searchPlayed.value;

  return allGames.value.filter((game) => {
    const matchesPlayed = filterStatus === null || game.played === filterStatus;
    const matchesSearch = !query || game.name.toLowerCase().includes(query);

    return matchesPlayed && matchesSearch;
  });
});

function clearFilters() {
  searchQuery.value = "";
  searchPlayed.value = null;
}

function openCreate() {
  modalMode.value = "create";
  selectedGame.value = null;
  gameModal.value?.showModal();
}

function handleSuccess() {
  gameModal.value?.close();
  gameStore.refreshAllGames();
}

onMounted(() => {
  gameStore.refreshAllGames();
});
</script>

<template>
  <div class="flex justify-between gap-2 items-center">
    <div>
      <h1 class="text-3xl font-extrabold">
        Loekie z'n spellen
      </h1>
      <p class="text-sm text-base-content/70">
        Overzicht van alle {{ gameStore.allGames?.length || null }} spellen in de kast
      </p>
    </div>
    <button class="btn btn-primary" @click="openCreate">
      <Icon name="mdi:plus" size="16" />
      Nieuw spel
    </button>
  </div>

  <div class="my-8">
    <div class="flex gap-4">
      <div class="join flex-1">
        <label class="input input-primary input-md w-full">
          <Icon name="mdi:magnify" size="16" />
          <input
            v-model="searchQuery"
            type="search"
            class="grow"
            placeholder="Zoek in de collectie..."
          >
        </label>
        <select v-model="searchPlayed" class="select select-bordered w-32 bg-base-100">
          <option value="null">
            Alle spellen
          </option>
          <option :value="true">
            Gespeeld
          </option>
          <option :value="false">
            Niet gespeeld
          </option>
        </select>
      </div>
      <button
        class="btn btn-error"
        :disabled="isFilterDefault"
        @click="clearFilters"
      >
        <Icon name="tabler:filter-off" />
      </button>
    </div>
  </div>

  <div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
    <BoardGame v-for="game in filteredGames" :key="game.id" :game="game" />
  </div>

  <dialog ref="gameModal" class="modal">
    <ModalGame
      :mode="modalMode"
      :game="selectedGame"
      @success="handleSuccess"
      @close="gameModal?.close()"
    />
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
