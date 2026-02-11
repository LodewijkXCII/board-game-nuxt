<script lang="ts" setup>
const props = defineProps<{
  label: string;
  name: string;
  error?: string;
  disabled?: boolean;
  initialValue?: number;
}>();

const { handleBlur, value, handleChange } = useField<number>(props.name, {
  initialValue: props.initialValue,
});
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>

    <input
      type="number"
      :label="props.label"
      :name="props.name"
      class="input input-bordered w-full"
      :class="[{ 'input-error': props.error }]"
      :value
      @blur="handleBlur"
      @input="handleChange"
    >

    <p v-if="props.error" class="fieldset-label text-error">
      {{ props.error }}
    </p>
  </fieldset>
</template>
