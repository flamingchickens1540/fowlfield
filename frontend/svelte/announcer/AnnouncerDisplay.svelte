<script lang="ts">
    import matchData from "@store"
    import TeamCard from "./components/TeamCard.svelte";

	const {red1, red2, red3, blue1, blue2, blue3, type, redAlliance, blueAlliance} = matchData

</script>

<h2>Announcer Display</h2>

<div class="grid-cols-2">
    <div class="grid-rows-flux">
        <h1>Red Alliance</h1>
        {#if $type == 'elimination'}
            <div>
                <h2>Alliance Position: {$redAlliance}</h2> <!--This isn't working and I can't tell why-->
            </div>
        {/if}
        {#if $red1 != 0 }
            <TeamCard alliance={'red'} team_num={$red1}/>
        {/if}
        {#if $red2 != 0}
            <TeamCard alliance={'red'} team_num={$red2}/>
        {/if}
        {#if $red3 != 0}
            <TeamCard alliance={'red'} team_num={$red3}/>
        {/if}
    </div>
    <div class="grid-rows-flux">
        <h1>Blue Alliance</h1>
        {#if $type == 'elimination'}
            <div>
                <h2>Alliance Position: {$blueAlliance}</h2> <!--This isn't working and I can't tell why-->
            </div>
        {/if} 
        {#if $blue1 != 0}
            <TeamCard alliance={'blue'} team_num={$blue1}/>
        {/if}
        {#if $blue2 != 0}
            <TeamCard alliance={'blue'} team_num={$blue2}/>
        {/if}
        {#if $blue3 != 0}
            <TeamCard alliance={'blue'} team_num={$blue3}/>
        {/if}
    </div>
</div>


<style>

    .grid-rows-flux {
        display: grid;
        place-items: center str;
        gap: 10px;
        grid-template-rows: 1fr auto
    }

    .grid-cols-2 {
        display: grid;
        place-items: center str;
        gap: 10px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
</style>