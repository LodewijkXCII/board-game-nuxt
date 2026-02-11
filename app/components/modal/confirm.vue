<script setup lang="ts">
defineProps<{
  title: string;
  message: string;
  loading?: boolean;
}>();

const emit = defineEmits(["confirm"]);
const modalRef = ref<HTMLDialogElement | null>(null);

// Expose methods to parent
defineExpose({
  show: () => modalRef.value?.showModal(),
  close: () => modalRef.value?.close(),
});

function handleGlobalKeyDown(event: KeyboardEvent) {
  if ((event.key === "Enter")) {
    emit("confirm");
  }
}
onMounted(() => {
  window.addEventListener("keydown", handleGlobalKeyDown);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleGlobalKeyDown);
});
</script>

<template>
  <dialog ref="modalRef" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg text-error">
        {{ title }}
      </h3>
      <p class="py-4">
        {{ message }}
      </p>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn btn-neutral" :disabled="loading">
            Annuleer
          </button>
        </form>
        <button class="btn btn-error" :disabled="loading" @click="emit('confirm')">
          <span v-if="loading" class="loading loading-spinner" />
          Verwijderen
        </button>
      </div>
    </div>
  </dialog>
</template>
