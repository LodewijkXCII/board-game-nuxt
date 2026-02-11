<script lang="ts" setup>
const props = defineProps<{
  label: string;
  name: string;
  error?: string;
  disabled?: boolean;
  initialValue?: Date;
}>();

// Ensure the field is typed as Date | undefined
const { handleBlur, value: inputValue, handleChange } = useField<Date | undefined>(props.name, {
  initialValue: props.initialValue,
});

function formatDateISO(value: any) {
  if (!value)
    return "";

  // Create a date object to be safe, regardless of what's stored
  const d = new Date(value);

  // Check if the date is actually valid before calling toISOString
  if (Number.isNaN(d.getTime()))
    return "";

  // This format (YYYY-MM-DD) is REQUIRED for <input type="date"> to show a value
  return d.toISOString().split("T")[0];
}

function dateChanged(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.value) {
    handleChange(undefined);
    return;
  }

  // Parse the YYYY-MM-DD string back into a Javascript Date object
  const dateObject = new Date(target.value);
  handleChange(dateObject);
}
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>
    <input
      :name="props.name"
      type="date"
      :disabled="disabled"
      class="input w-full"
      :class="{ 'input-error': props.error }"
      :value="formatDateISO(inputValue)"
      @input="dateChanged"
      @blur="handleBlur"
    >
    <p v-if="props.error" class="fieldset-label text-error">
      {{ props.error }}
    </p>
  </fieldset>
</template>
