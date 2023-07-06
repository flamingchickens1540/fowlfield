<script lang="ts">
    import matchData, { teamList } from "@store"
    export let team_num: number;
    export let alliance: 'red' | 'blue'
    export let rank: number;

    const { type } = matchData
</script>

<div class="{alliance} team-card">
    <strong>
        <div class="team-num">{$teamList[team_num].displaynum.get()}</div>
        <div class="team-info">
            <div class="team-info-item">Team Name: {$teamList[team_num].name.get()}</div>
            <div class="team-info-item">Robot Name: {$teamList[team_num].robotname.get()}</div>
            {#if $type == "qualification"}
                <div>Team Rank: {rank + 1}</div>
            {:else}
                <div>Alliance Pick: {$teamList[team_num].alliancePosition.get()}</div>
            {/if}
        </div>
    </strong>
</div>

<style>
    .team-info-item {
        padding-bottom: 1%;
    }
    .team-info {
        font-size: x-large;
    }
    .team-num {
        font-size: xxx-large;
        padding-bottom: 2%;
    }

    .team-card {
        padding-bottom: 3%;
        padding-top: 3%;
    }

    .red {
        background-color: rgb(218, 56, 50);
        border-radius: 25px;
    }

    .blue {
        background-color: rgb(42, 100, 173);
        border-radius: 25px;
    }
</style>