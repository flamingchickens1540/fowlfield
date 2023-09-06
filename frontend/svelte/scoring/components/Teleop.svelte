<script lang="ts">
    import matchData from "@store";
    export let alliance: "red" | "blue";

    let bunnies = 0;
    let penalty = 0;

    function handlePenalty() {
        if (alliance == "red") {
            matchData.blueScore.update((val) => val + penalty);
        } else {
            matchData.redScore.update((val) => val + penalty);
        }
    }
    $:  if (alliance == "red") {
            matchData.redScore.update((score) => score + bunnies * 5);
        } else {
            matchData.blueScore.update((score) => score + bunnies * 5);
        }
</script>

<div class="bunnies">
    <span class="bunnyHeader">Teleop Bunnies</span>
    <button on:click={() => bunnies--}>-</button>
    <input type="number" bind:value={bunnies}>
    <button on:click={() => bunnies++}>+</button>
</div>

<div class="penalties">

    <!-- This either adds or subtracts the value of penalty from the opponent's score -->
    <!-- TODO: make this more intuitive -->
    <span class="penaltiesHeader">Penalties are added to opponent's score</span>
    <input type="number" bind:value={penalty}>
    <button on:click={handlePenalty}>-</button>
    <button on:click={handlePenalty}>+</button>
</div>
