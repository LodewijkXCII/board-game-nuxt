<script lang="ts" setup>
const props = defineProps<{
  label: string;
  name: string;
  error?: string;
  type?: "text" | "textarea";
  disabled?: boolean;
  initialValue?: string | number | Date;
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>

    <Field
      :label="props.label"
      :name="props.name"
      :error="props.error"
      :type="props.type"
      :value="props.initialValue"
      :as="type === 'textarea' ? 'textarea' : 'input'"
      class="input-bordered w-full"
      :class="[
        type === 'textarea' ? 'textarea' : 'input',
        { 'input-error': props.error },
      ]"
    />

    <p v-if="props.error" class="label text-error">
      {{ props.error }}
    </p>
  </fieldset>
</template>
