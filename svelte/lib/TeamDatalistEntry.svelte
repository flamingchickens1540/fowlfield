<script lang=ts>
    import type {WritableTeamData} from "./socketStore";
    import matchData from "~/lib/store";

    export let team:WritableTeamData
    const {red1, red2, red3, blue1, blue2, blue3} = matchData
    const {displaynum, id} = team
    
    $: isAlreadySelected = ($red1 == id || $red2 == id || $red3 == id || $blue1 == id || $blue2 == id || $blue3 == id)
    
</script>
{#if !isAlreadySelected}
    <option value={$displaynum}></option>
{/if}