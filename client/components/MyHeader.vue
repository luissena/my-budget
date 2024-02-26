<template>
  <header>
    <nav class="flex items-center justify-center gap-10 p-5">
      <NuxtLink class="hover:font-semibold" active-class="font-semibold border-b" to="/"> Dashboard </NuxtLink>

      <NuxtLink class="hover:font-semibold" active-class="font-semibold border-b" to="/transactions">
        Transações
      </NuxtLink>

      <NuxtLink class="hover:font-semibold" active-class="font-semibold border-b" to="/settings">
        Configurações
      </NuxtLink>
    </nav>
  </header>
</template>
