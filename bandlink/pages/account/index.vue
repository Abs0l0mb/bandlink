<template>
  <div class="max-w-7xl px-5 flex flex-col space-y-5 w-full h-full items-center justify-center mx-auto">
    <div class="items-center flex">
      <div class="w-full mt-12 lg:flex">
        <div class="flex flex-col items-start justify-start w-full h-auto lg:w-1/3">
          <div class="flex items-center justify-center">
            <div
              class="w-16 h-16 mr-4 overflow-hidden bg-gray-200 rounded-full ring-violet-500 ring-2 ring-offset-2">
              <img src="../../assets/images/imageMain.jpg" class="object-cover w-full h-full">
            </div>
            <div class="flex flex-col items-start justify-center">
              <h4 class="font-bold text-xl text-gray-800"> {{ musicianProfileInput?.name }} </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="max-w-7xl px-5 py-10 flex space-x-5 w-full h-full items-center justify-center mx-auto"
    >
      <div class="flex flex-col space-y-5 w-full h-full">
        <div
          class="relative w-full px-6 py-6 mx-auto bg-white border border-gray-200 rounded-lg sm:px-8 md:px-12 sm:py-8 sm:shadow lg:w-5/6 xl:w-2/3"
        >
          <button
            class="absolute top-4 right-4 px-2 py-1 text-sm text-white bg-violet-500 hover:bg-violet-600 rounded-lg duration-300"
            @click=""
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-pen"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </button>
          <h3 class="text-lg font-bold text-purple-500 sm:text-xl md:text-2xl">
            Bio
          </h3>
          <p class="mt-2 text-base text-gray-600 sm:text-lg md:text-normal">
            {{ musicianProfileInput?.bio }}
          </p>
        </div>
        <div
          class="relative w-full px-6 py-6 mx-auto mt-10 bg-white border border-gray-200 rounded-lg sm:px-8 md:px-12 sm:py-8 sm:shadow lg:w-5/6 xl:w-2/3"
        >
          <h3 class="text-lg font-bold text-purple-500 sm:text-xl md:text-2xl">
            Past experiences jsp
          </h3>
          <p class="mt-2 text-base text-gray-600 sm:text-lg md:text-normal">
            1994 - j'ai joué pour la bo de adibou
          </p>
        </div>
      </div>
      <div class="flex flex-col space-y-5 w-full h-full">
        <div
          class="relative w-full px-6 py-6 mx-auto mt-10 bg-white border border-gray-200 rounded-lg sm:px-8 md:px-12 sm:py-8 sm:shadow lg:w-5/6 xl:w-2/3"
        >
          <h3 class="text-lg font-bold text-purple-500 sm:text-xl md:text-2xl">
            Instruments
          </h3>
          <p class="mt-2 text-base text-gray-600 sm:text-lg md:text-normal">
            {{ getDisplayTextFromList(musicianProfileInput?.instruments) }}
          </p>
        </div>
        <div
          class="relative w-full px-6 py-6 mx-auto mt-10 bg-white border border-gray-200 rounded-lg sm:px-8 md:px-12 sm:py-8 sm:shadow lg:w-5/6 xl:w-2/3"
        >
          <h3 class="text-lg font-bold text-purple-500 sm:text-xl md:text-2xl">
            Styles
          </h3>
          <p class="mt-2 text-base text-gray-600 sm:text-lg md:text-normal">
            {{ getDisplayTextFromList(musicianProfileInput?.styles) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

  import { createClient } from '@supabase/supabase-js'

  const musicianProfileInput = ref<MusicianProfile>();
  const supabase = createClient("https://vxnlmkevkguycioscpzk.supabase.co", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bmxta2V2a2d1eWNpb3NjcHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAzNjU0MDIsImV4cCI6MjAwNTk0MTQwMn0.Ayw39t5Ax8lXsW8DfZOcUoeUgbQaZkOBLH--i-3p4qo')

  const userSession = await supabase.auth.getSession();
  if (userSession?.data?.session?.user?.email) {
    const musicianProfileResponse = await supabase.rpc('get_musician_profile', {
      language: 'ENG',
      user_email: userSession.data.session.user.email,
    });
    musicianProfileInput.value = musicianProfileResponse.data[0];
  }

    
  interface MusicianProfile {
    id: number;
    name: string;
    avatarUrl: string;
    bio: string;
    styles: string[];
    instruments: string[];
  };

  function getDisplayTextFromList(list: string[] | undefined): string {
    if(!list)
      return '';
    let text = list[0];
    for(let i = 1; i < list.length; i++) {
      text += ', ' + list[i];
    }
    return text;
  };
</script>
