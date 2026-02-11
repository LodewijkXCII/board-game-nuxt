<script lang="ts" setup>
const sessionStore = useSessionStore();
const gameStore = useGameStore();

const sessionModal = ref<HTMLDialogElement | null>(null);
const confirmDeleteModal = ref<any>(null);
const loading = ref(false);
const selectedSessionId = ref<number | null>(null);

const modalMode = ref<"create" | "update">("create");

function openCreate() {
  modalMode.value = "create";
  gameStore.selectedGame = null;
  sessionModal.value?.showModal();
}

function handleSuccess() {
  sessionModal.value?.close();
  sessionStore.refreshAllSessions();
}

function openDelete(id: number) {
  selectedSessionId.value = id;
  confirmDeleteModal.value?.show();
}

async function confirmDeletion() {
  loading.value = true;
  try {
    await $fetch(`/api/sessions/${selectedSessionId.value}`, {
      method: "DELETE",
      credentials: "include",
    });
    sessionStore.refreshAllSessions();
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
  if (!sessionStore.allSessions) {
    sessionStore.refreshAllSessions();
  }
  if (!gameStore.allGames) {
    gameStore.refreshAllGames();
  }
});
</script>

<template>
  <div class="flex justify-between gap-2 items-center">
    <div>
      <h1 class="text-3xl font-extrabold">
        Sessies
      </h1>
      <p class="text-sm text-base-content/70">
        {{ sessionStore.allSessions?.length }} gespeelde sessies
      </p>
    </div>
    <button class="btn btn-primary" @click="openCreate">
      <Icon name="mdi:plus" size="16" />
      Nieuwe sessie
    </button>
  </div>

  <div class="my-8">
    <p>Hier komen zoekfuncties</p>
  </div>

  <div class="overflow-x-auto">
    <table class="table">
      <thead>
        <tr>
          <th />
          <th>Datum</th>
          <th>Spel</th>
          <th>Spelers</th>
          <th>Winnaar</th>
          <th>Acties</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(session, index) in sessionStore.allSessions" :key="session.id" class="hover:bg-base-300">
          <th>{{ index + 1 }}</th>
          <td>{{ new Date(session.playedDate).toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" }) }}</td>
          <td>{{ session.boardGame.name }} <span v-if="session.expansionId">{{ session.boardGame.expansions.find(e => e.id === session.expansionId)?.name }}</span></td>
          <td>{{ session.players.map(p => p.player.name).join(", ") }}</td>
          <td>{{ session.winnerPlayerId ? session.players.find(p => p.playerId === session.winnerPlayerId)?.player.name : "-" }} <span v-if="session.winnerPlayerId">({{ session.points }} ptn)</span></td>
          <td>
            <div class="btn btn-soft btn-error btn-sm" @click="openDelete(session.id)">
              <Icon name="tabler:trash" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <dialog ref="sessionModal" class="modal">
    <ModalSession
      :mode="modalMode"
      :session="sessionStore.selectedSession"
      @success="handleSuccess"
      @close="sessionModal?.close()"
    />
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
  <ModalConfirm
    ref="confirmDeleteModal"
    title="Sessie verwijderen?"
    message="Weet je zeker dat je sessie wilt verwijderen?"
    :loading="loading"
    @confirm="confirmDeletion"
  />
</template>
