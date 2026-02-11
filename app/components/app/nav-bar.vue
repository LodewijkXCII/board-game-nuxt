<template>
  <div class="bg-base-100 shadow-sm border-b border-base-300 px-4">
    <div class="wrapper">
      <div class="navbar   justify-between">
        <NuxtLink to="/" class="flex gap-2 items-center brand-logo">
          <div class="flex aspect-square items-center justify-center rounded-lg bg-primary text-primary-content p-2">
            <Icon name="tabler:dice-5" size="32" />
          </div>
          <span class="font-serif text-2xl font-semibold tracking-tight">Loek's Spellenkast</span>
        </NuxtLink>

        <nav class="content-end">
          <ul class="menu menu-horizontal px-1 gap-2">
            <li>
              <NuxtLink to="/" class="contrast">
                <Icon name="tabler:dice-5" size="16" />
                Spellen
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/sessies" class="contrast">
                <Icon
                  name="tabler:device-gamepad-3"
                  size="16"
                />
                Bekijk sessies
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/spelers" class="contrast">
                <Icon
                  name="tabler:users"
                  size="16"
                />
                Spelers
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>
