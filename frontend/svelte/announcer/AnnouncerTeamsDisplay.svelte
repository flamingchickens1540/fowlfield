<script lang="ts">
    import matchData from "@store"
    import TeamCard from "./components/TeamCard.svelte";
    
    const {red1, red2, red3, blue1, blue2, blue3, type, redAlliance, blueAlliance} = matchData
</script>



<div class="grid-cols-2">
    <div class="grid-rows-flux">
        {#if $type == 'elimination'}
        <h1>Alliance {$redAlliance}</h1>    
        {:else} 
        <h1>Red Alliance</h1>
        {/if}
        <TeamCard alliance={'red'} team_num={$red1}/>
        <TeamCard alliance={'red'} team_num={$red2}/>
        <TeamCard alliance={'red'} team_num={$red3}/>
    </div>
    <div class="grid-rows-flux">
        {#if $type == 'elimination'}
        <h1>Alliance {$blueAlliance}</h1>    
        {:else} 
        <h1>Blue Alliance</h1>
        {/if}
        <TeamCard alliance={'blue'} team_num={$blue1}/>
        <TeamCard alliance={'blue'} team_num={$blue2}/>
        <TeamCard alliance={'blue'} team_num={$blue3}/>
    </div>
</div>

<style>
    
    .grid-rows-flux {
        display: grid;
        place-items: center;
        /* gap: 10px; */
        grid-template-rows: 15vh repeat(3, calc(85vh / 3));
        height:100vh;
    }
    
    .grid-cols-2 {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        overflow: hidden;
    }
</style>