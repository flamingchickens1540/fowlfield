<script lang=ts>
    import type {SocketWritableOf} from "../socketStore";
    import matchData from "~/lib/store";
    import type { Team } from '@prisma/client'

    export let team:SocketWritableOf<Team>
    const {red1, red2, red3, blue1, blue2, blue3} = matchData
    const {display_number, id} = team
    
    $: isAlreadySelected = ($red1 == $id || $red2 == $id || $red3 == $id || $blue1 == $id || $blue2 == $id || $blue3 == $id)
    
</script>
{#if !isAlreadySelected}
    <option value={$display_number}></option>
{/if}