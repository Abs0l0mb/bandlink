<template>
        <div class="rounded-tr-lg bg-slate-900 w-2/12 h-screen p-3">
            <FilterList :items="styles" key="Styles"></FilterList>
        </div>    
</template> 


<script setup>

    const supabase = useSupabaseClient()


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