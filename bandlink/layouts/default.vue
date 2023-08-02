<template>
    <section class="border-b-2 border-gray-100 relative w-full px-8 text-gray-700 bg-white body-font tails-selected-element"
        data-tails-scripts="//unpkg.com/alpinejs">
        <div class="container flex flex-col flex-wrap items-center justify-between py-5 mx-auto md:flex-row max-w-7xl">
            <NuxtLink to="/"
                class="relative z-10 flex items-center w-auto text-2xl font-extrabold leading-none text-black select-none">
                <img class='w-[5vw] h-[5vw]' src='../public/favicon.ico'>Bandlink</NuxtLink>
            <nav
                class="top-0 left-0 z-0 flex items-center justify-center w-full h-full py-5 -ml-0 space-x-5 text-base md:-ml-5 md:py-0 md:absolute">
                <NuxtLink to="/Bands" class="relative font-medium text-gray-600 duration-150 hover:text-gray-900">
                    <span class="block">Bands</span>
                </NuxtLink>
                <NuxtLink to="/Musicians" class="relative font-medium text-gray-600 duration-150 hover:text-gray-900">
                    <span class="block">Musicians</span>
                </NuxtLink>
                <NuxtLink to="/Map" class="relative font-medium text-gray-600 duration-150 hover:text-gray-900">
                    <span class="block">Map</span>
                </NuxtLink>
                <NuxtLink to="/MyBands" class="relative font-medium text-gray-600 duration-150 hover:text-gray-900">
                    <span class="block">My Bands</span>
                </NuxtLink>
            </nav>
            <div class="relative z-10 inline-flex items-center space-x-3 md:ml-5 lg:justify-end">
                
                <NuxtLink to="/sign-in"
                    class="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-gray-600 whitespace-no-wrap bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:shadow-none"
                    data-rounded="rounded-md"> Sign in </NuxtLink>
                <span class="inline-flex rounded-md shadow-sm">
                    <NuxtLink to="/sign-up"
                        class="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-violet-500 border border-violet-600 rounded-md shadow-sm hover:bg-violet-600"
                        data-rounded="rounded-md" data-primary="blue-600"> Sign up </NuxtLink>
                </span>
            </div>
        </div>
    </section>

    <div class="text-black duration-800">
        <slot />
    </div>
</template>

<style scoped>
.router-link-exact-active {
    font-weight: bold;
}
</style>

<script setup>
let hover = false
</script>
