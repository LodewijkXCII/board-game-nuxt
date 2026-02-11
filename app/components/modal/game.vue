<script lang="ts" setup>
import type { FetchError } from "ofetch";

import { InsertBoardGame } from "~~/server/db/schema";
import { useForm } from "vee-validate";

const props = defineProps({
  mode: String as PropType<"create" | "update">,
});
const emit = defineEmits(["success", "close"]);

const gameStore = useGameStore();
const { selectedGame } = storeToRefs(gameStore);

const loading = ref(false);
const errorMessage = ref("");

const { handleSubmit, errors, meta, setErrors, setFieldValue, values } = useForm({
  validationSchema: toTypedSchema(InsertBoardGame),
  initialValues: {
    name: selectedGame.value?.name || "",
    slug: selectedGame.value?.slug || "",
    minPlayers: selectedGame.value?.minPlayers || 1,
    maxPlayers: selectedGame.value?.maxPlayers || 1,
    bggBestPlayers: selectedGame.value?.bggBestPlayers || 1,
  },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    errorMessage.value = "";
    loading.value = true;

    if (props.mode === "update" && selectedGame.value?.id) {
      await $fetch(`/api/board-games/${selectedGame.value.id}`, {
        method: "PUT",
        body: values,
      });
    }
    else {
      await $fetch("/api/board-games/post", {
        method: "POST",
        body: values,
      });
    }

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

watch(() => values.name, (newName) => {
  if (newName) {
    const generatedSlug = newName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special chars
      .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with hyphens
      .replace(/^-+|-+$/g, ""); // Trim hyphens from ends

    setFieldValue("slug", generatedSlug);
  }
  else {
    setFieldValue("slug", "");
  }
});

watch(() => selectedGame.value, (newGame) => {
  if (newGame) {
    setFieldValue("name", newGame.name);
    setFieldValue("slug", newGame.slug);
    setFieldValue("minPlayers", newGame.minPlayers);
    setFieldValue("maxPlayers", newGame.maxPlayers);
    setFieldValue("bggBestPlayers", newGame.bggBestPlayers);
  }
});

onMounted(() => {
  if (!gameStore.allGames) {
    gameStore.refreshAllGames();
  }
});
</script>

<template>
  <div class="modal-box bg-base-100" :class="selectedGame?.expansions.length ? 'w-9/10 max-w-4xl' : 'w-xl'">
    <div
      class="grid"
      :class="{ 'grid-cols-2 gap-4': selectedGame?.expansions.length }"
    >
      <div>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">
            {{ mode === 'update' ? `${selectedGame?.name} aanpassen` : 'Nieuw spel toevoegen' }}
          </h2>
          <button class="btn btn-sm btn-circle btn-ghost" @click="$emit('close')">
            <Icon name="tabler:x" />
          </button>
        </div>

        <form class="grid gap-4 grid-cols-2" @submit.prevent="onSubmit">
          <AppFormField
            name="name"
            label="Titel"
            :error="errors.name"
            :disabled="loading"
            class="col-span-full"
          />
          <AppFormField
            name="slug"
            label="Slug"
            :error="errors.slug"
            :disabled="true"
            class="col-span-full"
          />
          <AppFormNumberField
            name="minPlayers"
            label="Min spelers"
            :error="errors.minPlayers"
            :disabled="loading"
          />
          <AppFormNumberField
            name="maxPlayers"
            label="Max spelers"
            :error="errors.maxPlayers"
            :disabled="loading"
          />
          <AppFormNumberField
            name="bggBestPlayers"
            label="Beste volgens BGG"
            :error="errors.bggBestPlayers"
            :disabled="loading"
            class="col-span-full"
          />

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
      <div v-if="selectedGame?.expansions.length">
        <h3 class="text-xl font-bold mb-4">
          Uitbreidingen
        </h3>
        <div class="grid gap-4">
          <div v-for="expansion in selectedGame.expansions" :key="expansion.id" class="p-4 bg-base-300/50 rounded-md flex justify-between gap-2 items-center">
            <p>{{ expansion.name }}</p>
            <div v-if="expansion.played" class="badge badge-success">
              <Icon name="tabler:check" /> Gespeeld
            </div>
            <!-- <div class="flex gap-2">
              <div class="btn btn-soft btn-accent">
                <Icon name="tabler:edit" />
              </div>
              <div class="btn btn-soft btn-error">
                <Icon name="tabler:trash" />
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
