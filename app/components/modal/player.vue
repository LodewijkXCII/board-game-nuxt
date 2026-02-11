<script lang="ts" setup>
import type { FetchError } from "ofetch";

import { InsertPlayer } from "~~/server/db/schema";
import { useForm } from "vee-validate";

const props = defineProps({
  mode: String as PropType<"create" | "update">,
  player: {
    type: Object as PropType<PlayerWithStats | null>,
    default: null,
  },
});

const emit = defineEmits(["success", "close"]);

const loading = ref(false);
const errorMessage = ref("");

const { handleSubmit, errors, meta, setErrors, setFieldValue } = useForm({
  validationSchema: toTypedSchema(InsertPlayer),
  initialValues: {
    name: props.player?.name || "",
  },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    errorMessage.value = "";
    loading.value = true;

    if (props.mode === "update" && props.player?.id) {
      await $fetch(`/api/player/${props.player.id}`, {
        method: "PUT",
        body: values,
      });
    }
    else {
      await $fetch("/api/player/post", {
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

watch(() => props.player, (newPlayer) => {
  if (newPlayer) {
    setFieldValue("name", newPlayer.name);
  }
});
</script>

<template>
  <div class="modal-box bg-base-100 w-xl">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">
        {{ mode === 'update' ? `${player?.name} aanpassen` : 'Speler toevoegen' }}
      </h2>
      <button class="btn btn-sm btn-circle btn-ghost" @click="$emit('close')">
        <Icon name="tabler:x" />
      </button>
    </div>

    <form class="grid gap-4 grid-cols-2" @submit.prevent="onSubmit">
      <AppFormField
        name="name"
        label="Naam"
        :error="errors.name"
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
