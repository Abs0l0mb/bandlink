<template>
        <div class="border-t bg-black w-2/12 h-screen p-3">
            <FilterList :items="styles" key="Styles"></FilterList>
        </div>    
</template> 


<script setup>

    import { createClient } from '@supabase/supabase-js'
    const supabase = createClient("https://vxnlmkevkguycioscpzk.supabase.co", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bmxta2V2a2d1eWNpb3NjcHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAzNjU0MDIsImV4cCI6MjAwNTk0MTQwMn0.Ayw39t5Ax8lXsW8DfZOcUoeUgbQaZkOBLH--i-3p4qo')


    //const supabase = useSupabaseClient()

    let { data, error } = await supabase.rpc('get_styles_translations', { lang: 'ENG' })

    if(error) {
        console.log(error.details)
        console.log(error.hint)
    }

    console.log('data:', data)

    let styles = [
        {
            "id": 1,
            "name": "Pop"
        },
        {
            "id": 2,
            "name": "Rock"
        },
        {
            "id": 3,
            "name": "Jazz"
        },
        {
            "id": 4,
            "name": "Metal"
        },
        {
            "id": 5,
            "name": "Funk"
        },
        {
            "id": 6,
            "name": "Soul"
        },
    ]

</script>