<script lang="ts">
    import { matchData } from '~/lib/store'
    import ElimBracket from '~/pages/rankings/ElimBracket.svelte'
    import QualsRankings from '~/pages/rankings/QualsRankings.svelte'

    const { type } = matchData
</script>

{#if $type == 'elimination'}
    <ElimBracket></ElimBracket>
{:else}
    <QualsRankings></QualsRankings>
{/if}
