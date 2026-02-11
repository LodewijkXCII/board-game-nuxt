<script lang="ts" setup>
const filterActive = ref(false);
const played = ref<boolean>(true);
</script>

<template>
  <div class="my-2 border-base-100 border px-2 py-3 bg-base-200">
    <h4 class="text-lg">
      Filters:
    </h4>

    <div class="flex gap-2 flex-wrap mt-3">
      <fieldset class="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
        <label class="label">
          <input
            v-model="played"
            type="checkbox"
            class="checkbox checkbox-primary"
            :disabled="!filterActive"
          >
          {{ !played ? 'Niet ' : '' }} Gespeeld
        </label>
      </fieldset>
    </div>
  </div>
</template>
