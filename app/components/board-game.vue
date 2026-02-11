<script lang="ts" setup>
import type { SelectBoardGameWithExpansions } from "~~/server/db/schema";

const props = defineProps<{ game: SelectBoardGameWithExpansions }>();

const gameStore = useGameStore();

const { selectedGame } = storeToRefs(gameStore);
const gameModal = ref<HTMLDialogElement | null>(null);
const confirmDeleteModal = ref<any>(null);
const expansionModal = ref<HTMLDialogElement | null>(null);
const loading = ref(false);

const modalMode = ref<"create" | "update">("update");

function openUpdate() {
  gameStore.selectedGame = props.game;
  modalMode.value = "update";
  gameModal.value?.showModal();
}

function handleSuccess() {
  gameModal.value?.close();
  gameStore.refreshAllGames();
}

function openDelete() {
  confirmDeleteModal.value?.show();
}

function openExpansionModal() {
  modalMode.value = "create";
  expansionModal.value?.show();
}

async function confirmDeletion() {
  if (!selectedGame.value) {
    return;
  }
  loading.value = true;
  try {
    await $fetch(`/api/board-games/${selectedGame.value.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    gameStore.refreshAllGames();
    confirmDeleteModal.value?.close();
  }
  catch (e) {
    console.error("Delete failed", e);
  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="card bg-base-100 shadow-sm max-w-md">
    <div class="overflow-hidden bg-base-300 h-40 flex items-center place-content-center rounded-t-[inherit] relative">
      <div v-if="game.played" class="badge badge-success absolute top-4 left-4">
        <Icon name="tabler:check" /> Gespeeld
      </div>

      <Icon name="tabler:puzzle" class="text-base-content/30" size="64" />
    </div>
    <div class="card-body">
      <div class="card-title justify-between items-start">
        <h2 class="text-xl font-bold">
          {{ game.name }}
        </h2>
      </div>
      <div class="flex gap-2 grow">
        <p>
          <Icon name="tabler:users" /> {{ game.minPlayers }} tot {{ game.maxPlayers }} spelers <span class="text-primary text-xs">(beste met: {{ game.bggBestPlayers }})</span>
        </p>
      </div>

      <div class="flex gap-2 mt-4 card-actions">
        <div class="btn btn-primary">
          Nieuwe sessie
        </div>
        <div class="btn btn-soft btn-accent" @click="openUpdate">
          <Icon name="tabler:edit" />
        </div>
        <div class="btn btn-soft btn-error" @click="openDelete">
          <Icon name="tabler:trash" />
        </div>
      </div>

      <div>
        <div class="flex justify-between gap-4 mt-6 mb-4">
          <p class="text-bold">
            Uitbreidingen <span v-if="game.expansions.length">({{ game.expansions.length }})</span>
          </p>
          <div class="btn btn-soft hover:btn-secondary btn-xs" @click="openExpansionModal">
            <Icon name="tabler:plus" /> Toevoegen
          </div>
        </div>
        <div class="grid">
          <p v-for="expansion in game.expansions" :key="expansion.id">
            {{ expansion.name }}
          </p>
        </div>
      </div>
    </div>
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
  <dialog ref="expansionModal" class="modal">
    <ModalExpansion
      :mode="modalMode"
      :game="selectedGame"
      @success="handleSuccess"
      @close="expansionModal?.close()"
    />
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
  <ModalConfirm
    ref="confirmDeleteModal"
    title="Klant verwijderen?"
    :message="`Weet je zeker dat je ${selectedGame?.name || 'deze klant'} wilt verwijderen?`"
    :loading="loading"
    @confirm="confirmDeletion"
  />
</template>
