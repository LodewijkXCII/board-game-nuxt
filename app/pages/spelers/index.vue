<script lang="ts" setup>
import type { SelectPlayer } from "~~/server/db/schema";

import { storeToRefs } from "pinia";

const playerStore = usePlayerStore();

const { allPlayers } = storeToRefs(playerStore);

const selectedPlayer = ref<SelectPlayer | null>(null);
const playerModal = ref<HTMLDialogElement | null>(null);
const modalMode = ref<"create" | "update">("create");

function openCreate() {
  modalMode.value = "create";

  playerModal.value?.showModal();
}

function handleSuccess() {
  playerModal.value?.close();
  playerStore.refreshAllPlayers();
}

onMounted(() => {
  playerStore.refreshAllPlayers();
});
</script>

<template>
  <div class="flex justify-between gap-2 items-center">
    <div>
      <h1 class="text-3xl font-extrabold">
        Spelers
      </h1>
      <p class="text-sm text-base-content/70">
        {{ allPlayers?.length || 0 }} spelers in het systeem
      </p>
    </div>
    <button class="btn btn-primary" @click="openCreate">
      <Icon name="mdi:plus" size="16" />
      Nieuwe speler
    </button>
  </div>

  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
    <Player v-for="player in allPlayers" :key="player.id" :player="player" />
  </div>

  <dialog ref="playerModal" class="modal">
    <ModalPlayer
      :mode="modalMode"
      :player="selectedPlayer"
      @success="handleSuccess"
      @close="playerModal?.close()"
    />
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
