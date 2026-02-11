<script lang="ts" setup>
import type { SelectBoardGameExpansion, SelectBoardGameWithExpansions } from "~~/server/db/schema";
import type { FetchError } from "ofetch";

import { InsertBoardGameExpansion } from "~~/server/db/schema";
import { useForm } from "vee-validate";

const props = defineProps({
  mode: String as PropType<"create" | "update">,
  game: {
    type: Object as PropType<SelectBoardGameWithExpansions | null>,
    default: null,
  },
  selectedExpansion: {
    type: Object as PropType<SelectBoardGameExpansion | null>,
    default: null,
  },
});

const emit = defineEmits(["success", "close"]);
const gameStore = useGameStore();

const loading = ref(false);
const errorMessage = ref("");

const { handleSubmit, errors, meta, setErrors, setFieldValue, values, resetForm } = useForm({
  validationSchema: toTypedSchema(InsertBoardGameExpansion),
  initialValues: {
    name: props.selectedExpansion?.name || "",
    slug: props.selectedExpansion?.slug || "",
    minPlayers: props.selectedExpansion?.minPlayers || 1,
    maxPlayers: props.selectedExpansion?.maxPlayers || 1,
    bggBestPlayers: props.selectedExpansion?.bggBestPlayers || 1,
  },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    errorMessage.value = "";
    loading.value = true;

    if (props.game?.id) {
      if (props.mode === "update" && props.selectedExpansion?.id) {
        await $fetch(`/api/board-games/${props.game.id}/expansion/${props.selectedExpansion.id}`, {
          method: "PUT",
          body: values,
        });
      }
      else {
        await $fetch(`/api/board-games/${props.game.id}/expansion/post`, {
          method: "POST",
          body: values,
        });
      }
      emit("success"); // It's good practice to emit success to refresh lists
      emit("close");
    }
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data) {
      setErrors(error.data.data);
    }
    errorMessage.value = getFetchErrorMessage(error);
  }
  finally {
    resetForm();
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

watch(() => props.selectedExpansion, (newGame) => {
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
  <div class="modal-box bg-base-100 w-xl">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">
        {{ mode === 'update' ? `${game?.name} aanpassen` : `Uitbreiding voor ${game?.name} toevoegen` }}
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
</template>
