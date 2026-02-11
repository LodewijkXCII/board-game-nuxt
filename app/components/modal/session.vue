<script lang="ts" setup>
import type { SelectGameSession } from "~~/server/db/schema";
import type { FetchError } from "ofetch";
import type z from "zod";

import { InsertGameSessionWithPlayersSchema } from "~~/server/db/schema";

const props = defineProps({
  mode: String as PropType<"create" | "update">,
  session: {
    type: Object as PropType<SelectGameSession | null>,
    default: null,
  },
});

const emit = defineEmits(["success", "close"]);

type GameSessionForm = z.infer<typeof InsertGameSessionWithPlayersSchema> & {
  players: PlayerSessionRow[];
};

const gameSessionStore = useSessionStore();
const gameStore = useGameStore();
const playerStore = usePlayerStore();

const loading = ref(false);
const errorMessage = ref("");
const sessionHasWinner = ref(true);

const { errors, values, setFieldValue, meta, handleSubmit, setErrors } = useForm<GameSessionForm>({
  validationSchema: toTypedSchema(InsertGameSessionWithPlayersSchema),
  initialValues: {
    boardGameId: props.session?.boardGameId || undefined,
    expansionId: props.session?.expansionId || null,
    winnerPlayerId: props.session?.winnerPlayerId || null,
    points: props.session?.points || null,
    playedDate: props.session?.playedDate ? new Date(props.session.playedDate) : new Date(),
    players: [],
  },
});

const { push, remove, fields } = useFieldArray<PlayerSessionRow>("players");

const availiblePlayers = computed(() => {
  if (!values.players) {
    return playerStore.allPlayers;
  }

  else {
    return playerStore.allPlayers?.filter((player) => {
      return !values.players.some(p => p.playerId === player.id);
    });
  }
});

function addPlayer(event: Event) {
  const select = event.target as HTMLSelectElement;
  const playerId = Number(select.value);

  if (!playerId)
    return;

  // Check if player is already added
  const exists = values.players.some((p: PlayerSessionRow) => p.playerId === playerId);

  if (!exists) {
    const player = playerStore.allPlayers?.find(p => p.id === playerId);
    push({
      playerId,
      name: player?.name || null, // stored for UI display
      playerPoints: null,
    });
  }
  select.value = "undefined";
}

// Function to toggle the winner trophy icon
function setWinner(index: number) {
  const currentPlayer = values.players[index];

  if (!currentPlayer) {
    return;
  }

  setFieldValue("winnerPlayerId", values.winnerPlayerId === currentPlayer.playerId ? null : currentPlayer.playerId);
}
const winnerScore = computed<number | null>(() => {
  if (!sessionHasWinner.value) {
    return null;
  }

  if (values.winnerPlayerId) {
    return values.players.find(p => p.playerId === values.winnerPlayerId)?.score || null;
  }

  return null;
});

// watch(() => props.session, (newSession) => {
//   setFieldValue("boardGameId", newSession?.boardGameId);
//   setFieldValue("winnerPlayerId", newSession?.winnerPlayerId);
//   setFieldValue("points", newSession?.points);
//   setFieldValue("playedDate", newSession?.playedDate);
//   setFieldValue("players", newSession?.players);
// });

const onSubmit = handleSubmit(async (formValues) => {
  try {
    errorMessage.value = "";
    loading.value = true;

    const payload = {
      ...formValues,
      points: winnerScore.value,
      players: formValues.players.map((player: PlayerSessionRow) => {
        return {
          playerId: player.playerId,
          playerPoints: player.playerPoints,
        };
      }),
    };
    // if (props.mode === "update" && selectedGame.value?.id) {
    //   await $fetch(`/api/board-games/${selectedGame.value.id}`, {
    //     method: "PUT",
    //     body: values,
    //   });
    // }
    // else {
    await $fetch("/api/sessions", {
      method: "POST",
      body: payload,
    });

    emit("success"); // It's good practice to emit success to refresh lists
    emit("close");
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data) {
      setErrors(error.data.data);
    }
    errorMessage.value = getFetchErrorMessage(error);
  }
  finally {
    loading.value = false;
  }
});

watch(() => values.boardGameId, (newId) => {
  gameStore.selectedGame = newId ? (gameStore.findGameById(newId) ?? null) : null;
});

onMounted(() => {
  if (!gameSessionStore.allSessions) {
    gameSessionStore.refreshAllSessions();
  }
  if (!gameStore.allGames) {
    gameStore.refreshAllGames();
  }
  if (!playerStore.allPlayers) {
    playerStore.refreshAllPlayers();
  }
});
</script>

<template>
  <div class="modal-box bg-base-100 w-xl">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">
        {{ mode === 'update' ? `Sessie aanpassen` : 'Nieuwe sessie toevoegen' }}
      </h2>
      <button class="btn btn-sm btn-circle btn-ghost" @click="$emit('close')">
        <Icon name="tabler:x" />
      </button>
    </div>
    <form class="grid gap-4" @submit.prevent="onSubmit">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">
          Selecteer spel
        </legend>
        <Field
          as="select"
          name="boardGameId"
          class="input input-bordered w-full"
          :class="{
            'input-error': errors.boardGameId,
          }"
        >
          <option :value="undefined" disabled selected>
            Selecteer spel
          </option>
          <option
            v-for="game in gameStore.allGames"
            :key="game.id"
            :value="game.id"
          >
            {{ game.name }}
          </option>
        </Field>
        <p v-if="errors.boardGameId" class="fieldset-label text-error">
          {{ errors.boardGameId }}
        </p>
      </fieldset>

      <fieldset v-if="gameStore.selectedGame?.expansions.length" class="fieldset">
        <legend class="fieldset-legend">
          Uitbreiding gespeeld?
        </legend>

        <div class="flex flex-col gap-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <Field
              type="radio"
              name="expansionId"
              :value="undefined"
              class="radio radio-primary"
            />
            <span class="label-text">Geen uitbreiding</span>
          </label>

          <label
            v-for="expansion in gameStore.selectedGame.expansions"
            :key="expansion.id"
            class="flex items-center gap-2 cursor-pointer"
          >
            <Field
              type="radio"
              name="expansionId"
              :value="expansion.id"
              class="radio radio-primary"
            />
            <span class="label-text">{{ expansion.name }}</span>
          </label>
        </div>

        <p v-if="errors.expansionId" class="fieldset-label text-error">
          {{ errors.expansionId }}
        </p>
      </fieldset>

      <AppFormDateField
        name="playedDate"
        label="Datum"
        :error="errors.playedDate"
        :disabled="loading"
      />

      <label class="label">
        <input
          type="checkbox"
          :checked="sessionHasWinner"
          class="checkbox checkbox-primary"
          @change="sessionHasWinner = !sessionHasWinner"
        >
        Spel heeft winnaar
      </label>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">
          Spelers
        </legend>

        <div class="flex flex-col gap-2 mb-3">
          <div
            v-for="(field, index) in fields"
            :key="field.key"
            class="flex items-center gap-3 p-2 bg-base-300 rounded-xl"
          >
            <div class="avatar avatar-placeholder">
              <div class="bg-primary text-primary-content w-8 rounded-full">
                <span>{{ field.value.name?.substring(0, 1).toUpperCase() }}</span>
              </div>
            </div>

            <span class="grow font-medium">{{ field.value.name }}</span>

            <Field
              :name="`players[${index}].playerPoints`"
              type="number"
              placeholder="Score"
              class="input input-sm input-bordered w-20 text-center"
            />

            <button
              v-if="sessionHasWinner"
              type="button"
              class="btn btn-sm btn-circle"
              :class="values.winnerPlayerId === field.value.playerId ? 'btn-warning' : 'btn-ghost'"
              @click="setWinner(index)"
            >
              <Icon name="tabler:trophy" />
            </button>

            <button type="button" class="btn btn-sm btn-ghost text-error" @click="remove(index)">
              <Icon name="tabler:x" />
            </button>
          </div>
        </div>

        <select
          v-if="availiblePlayers && availiblePlayers.length"
          class="select select-bordered w-full"
          :value="undefined"
          selected
          @change="addPlayer"
        >
          <option value="undefined" disabled selected>
            + Speler toevoegen
          </option>
          <option
            v-for="player in availiblePlayers"
            :key="player.id"
            :value="player.id"
          >
            {{ player.name }}
          </option>
        </select>

        <p v-if="errors.players" class="fieldset-label text-error">
          {{ errors.players }}
        </p>
      </fieldset>
      <div class="flex gap-2 mt-4 justify-end col-span-full">
        <button
          :disabled="loading"
          type="button"
          class="btn btn-outline"
          @click="$emit('close')"
        >
          Annuleren
        </button>
        <button class="btn btn-primary text-primary-content" :disabled="!meta.touched || loading" type="submit">
          <span v-if="loading" class="loading loading-spinner loading-sm" />
          {{ mode === 'update' ? `Aanpassen` : 'Toevoegen' }}
        </button>
      </div>
    </form>
  </div>
</template>
