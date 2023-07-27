<template>
    <div>
        <header class="shadow-sm bg-black">
            <nav class="mx-auto p-4 flex justify-between text-white">
                <NuxtLink to="/">
                    <p class="font-bold rounded-lg px-3 py-2">Bandlink</p>
                </NuxtLink>

                <ul class="flex gap-14">
                    <li class="rounded-lg px-3 py-2">
                        <NuxtLink to="/bands">Bands</NuxtLink>
                    </li>
                    <li class="rounded-lg px-3 py-2">
                        <NuxtLink to="/musicians">Musicians</NuxtLink>
                    </li>
                    <li class="rounded-lg px-3 py-2">
                        <NuxtLink to="/cortexes">Map</NuxtLink>
                    </li>
                    <li class="rounded-lg px-3 py-2">
                        <NuxtLink to="/neural-networks">My Bands</NuxtLink>
                    </li>
                </ul>
                <NuxtLink to="/account" class="rounded-full bg-violet-500 px-4 py-2">Account</NuxtLink>

            </nav>
        </header>
    </div>
    <div class="text-black transition-all">
        <slot/> 
    </div>
</template>

<style scoped>
    .router-link-exact-active {
        color: #d8b4fe;
    }
</style>