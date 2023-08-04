<template>
    <section @triedLogIn="verifySession()" class="border-b-2 border-gray-100 relative w-full px-4 text-gray-700 bg-white body-font tails-selected-element"
        data-tails-scripts="//unpkg.com/alpinejs">
        <div class="container flex flex-col flex-wrap items-center justify-between py-5 mx-auto md:flex-row max-w-7xl">
            <NuxtLink to="/"
                class="relative z-10 flex items-center w-auto text-xl leading-none text-black select-none">
                <img class='w-[3w] h-[3vw] mr-2' src='../public/favicon.ico'>Bandlink</NuxtLink>
            <nav
                class="top-0 left-0 z-0 flex items-center justify-center w-full h-full py-5 -ml-0 space-x-5 text-base md:-ml-5 md:py-0 md:absolute">
                <NuxtLink to="/bands" class="relative font-medium text-gray-600 duration-150 hover:text-gray-900">
                    <span class="block">Bands</span>
                </NuxtLink>
                <NuxtLink to="/musicians" class="relative font-medium text-gray-600 duration-150 hover:text-gray-900">
                    <span class="block">Musicians</span>
                </NuxtLink>
                <NuxtLink to="/map" class="relative font-medium text-gray-600 duration-150 hover:text-gray-900">
                    <span class="block">Map</span>
                </NuxtLink>
                <NuxtLink to="/my-bands" class="relative font-medium text-gray-600 duration-150 hover:text-gray-900">
                    <span class="block">My Bands</span>
                </NuxtLink>
            </nav>
            <div v-if="!refData.session" class="relative z-10 inline-flex items-center space-x-3 md:ml-5 lg:justify-end">       
                <NuxtLink to="/sign-in"
                    class="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-gray-600 whitespace-no-wrap bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:shadow-none"
                    data-rounded="rounded-md"> Sign in </NuxtLink>
                <span class="inline-flex rounded-md shadow-sm">
                    <NuxtLink to="/sign-up"
                        class="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-violet-500 border border-violet-600 rounded-md shadow-sm hover:bg-violet-600"
                        data-rounded="rounded-md" data-primary="blue-600"> Sign up </NuxtLink>
                </span>
            </div>
            <div v-if="refData.session" class="relative z-10 inline-flex items-center space-x-3 md:ml-5 lg:justify-end">       
                <NuxtLink to="/account"
                    class="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-gray-600 whitespace-no-wrap bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:shadow-none"
                    data-rounded="rounded-md"> Account </NuxtLink>
                <span class="inline-flex rounded-md shadow-sm">
                    <NuxtLink @click="signOut()" to="/sign-in"
                        class="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-violet-500 border border-violet-600 rounded-md shadow-sm hover:bg-violet-600"
                        data-rounded="rounded-md" data-primary="blue-600"> Sign out </NuxtLink>
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
    color: blue;
}
</style>

<script setup>

    import { createClient } from '@supabase/supabase-js'
    const supabase = createClient("https://vxnlmkevkguycioscpzk.supabase.co", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bmxta2V2a2d1eWNpb3NjcHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAzNjU0MDIsImV4cCI6MjAwNTk0MTQwMn0.Ayw39t5Ax8lXsW8DfZOcUoeUgbQaZkOBLH--i-3p4qo')

    let { data, error } = await supabase.auth.getSession()
    let refData = ref(data)

    async function verifySession() {
        data = await supabase.auth.getSession()
        refData.value = data
        console.log(data)
        let hover = false
    }

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        location.reload()
    }

</script>
