<script lang="ts" setup>
import type { player } from "~~/server/db/schema";

import { computed } from "vue";

const props = defineProps<{ player: PlayerWithStats }>();

const playerStore = usePlayerStore();

const selectedPlayer = ref<PlayerWithStats | null>(null);
const gameModal = ref<HTMLDialogElement | null>(null);
const confirmDeleteModal = ref<any>(null);
const loading = ref(false);

const stats = computed(() => {
  if (!selectedPlayer.value)
    return;

  const player = selectedPlayer.value;
  if (!player || !player.sessions.length) {
    return { totalWins: 0, totalSessions: 0, winRate: 0, mostPlayedGame: "-" };
  }

  const totalSessions = player.sessions.length;
  const totalWins = player.sessions.filter(s => s.isWinner).length;

  // 1. Create a frequency map of game names
  // Result looks like: { "Catan": 3, "Wingspan": 1 }
  const gameCounts = player.sessions.reduce((acc, session) => {
    const name = session.gameName;
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 2. Find the entry with the highest count
  const mostPlayedGame = Object.entries(gameCounts).reduce((a, b) =>
    (b[1] > a[1] ? b : a),
  )[0];

  return {
    totalWins,
    totalSessions,
    winRate: Math.round((totalWins / totalSessions) * 100),
    mostPlayedGame,
  };
});

const modalMode = ref<"create" | "update">("update");

function openUpdate() {
  modalMode.value = "update";
  gameModal.value?.showModal();
}

function handleSuccess() {
  gameModal.value?.close();
  playerStore.refreshAllPlayers();
}

function openDelete() {
  confirmDeleteModal.value?.show();
}

async function confirmDeletion() {
  if (!selectedPlayer.value) {
    return;
  }
  loading.value = true;
  try {
    await $fetch(`/api/player/${selectedPlayer.value.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    playerStore.refreshAllPlayers();
    confirmDeleteModal.value?.close();
  }
  catch (e) {
    console.error("Delete failed", e);
  }
  finally {
    loading.value = false;
  }
}

onMounted(() => {
  selectedPlayer.value = props.player;
});
</script>

<template>
  <div class="card card-side bg-base-100 shadow-sm items-center p-4 gap-4">
    <div class="card-body p-0">
      <div class="flex gap-4 items-center">
        <div class="avatar avatar-placeholder">
          <div class="bg-neutral text-neutral-content w-16 rounded-full">
            <span class="text-3xl">{{ player.name[0] }}</span>
          </div>
        </div>
        <div class="flex-1">
          <div class="card-title justify-between items-start">
            <h2 class="text-xl font-bold">
              {{ player.name }}
            </h2>
          </div>
          <p>{{ stats?.totalSessions }} spellen gespeeld</p>
        </div>

        <div class="flex gap-2 mt-4 card-actions">
          <div class="btn btn-soft btn-accent" @click="openUpdate">
            <Icon name="tabler:edit" />
          </div>
          <div class="btn btn-soft btn-error" @click="openDelete">
            <Icon name="tabler:trash" />
          </div>
        </div>
      </div>
      <div class="my-4">
        <div class="flex items-center justify-between text-sm mb-1.5">
          <p>
            <Icon name="tabler:trophy" class="text-primary" /> Winstpercentage
          </p>
          <span>
            {{ stats?.winRate }}%
          </span>
        </div>
        <progress class="progress progress-primary w-full" :value="stats?.winRate" max="100" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-base-300 rounded-md p-4 grid gap-2 text-center">
          <span class="text-xs uppercase text-neutral-content">
            Sessies
          </span>
          <p class="text-xl font-bold">
            {{ stats?.totalSessions }}
          </p>
        </div>
        <div class="bg-base-300 rounded-md p-4 grid gap-2 text-center">
          <span class="text-xs uppercase text-neutral-content">
            Gewonnen
          </span>
          <p class="text-xl font-bold">
            {{ stats?.totalWins }}
          </p>
        </div>
        <div class="bg-base-300 rounded-md p-4 grid gap-2 text-center col-span-full">
          <span class="text-xs uppercase text-neutral-content">
            Meest gespeelde spel
          </span>
          <p class="text-xl font-bold">
            {{ stats?.mostPlayedGame }}
          </p>
        </div>
      </div>
    </div>

    <dialog ref="gameModal" class="modal">
      <ModalPlayer
        :mode="modalMode"
        :player="selectedPlayer"
        @success="handleSuccess"
        @close="gameModal?.close()"
      />
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
    <ModalConfirm
      ref="confirmDeleteModal"
      title="Klant verwijderen?"
      :message="`Weet je zeker dat je ${selectedPlayer?.name} wilt verwijderen?`"
      :loading="loading"
      @confirm="confirmDeletion"
    />
  </div>
</template>
