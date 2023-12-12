<script lang="ts">
    import matchData, {teamList} from "@store";
    import writableDerived from "svelte-writable-derived";
    import {derived, writable, type Writable} from "svelte/store";
    import {MatchState} from "@fowltypes";


    export let store:Writable<number>;
    export let label:string

    let hasInitialized = false
    let prettyteamnum = writable("")
    const disableButton = derived(matchData.state, state => state !== MatchState.PENDING)
    teamList.subscribe((v) => {
        if (!hasInitialized && Object.keys(v).length > 0) {
            prettyteamnum = writableDerived(store,
                (storevalue) => {
                    return $teamList[storevalue]?.displaynum.get()
                },
                (value, storevalue) => {
                    if (value == "") {return 0}
                    const team = Object.values($teamList).find((team) => team.displaynum.get() == value)
                    if (team != null) {return team.id}

                    return storevalue;
                })
            hasInitialized = true
        }
    })
</script>

<div class=row>
    <span>{label}</span>
    <input inputmode="numeric" disabled={$disableButton} bind:value={$prettyteamnum} list=teams/>
</div>

<style lang=scss>
  $inputcolor: rgb(59,59,59);
  .row {
    display:flex;
    justify-content: space-evenly;
    align-items:center;
    flex-direction: column;
    margin:5px;
    height:100%;
    width:100%;

    border: solid $inputcolor 1px;

    background-color:var(--blue);
    &:nth-child(-n+3) {
      background-color:var(--red);
    }
  }
  span {
    font-size: 40px;
  }
  input {
    /* width:80%; */
    background-color:$inputcolor;
    border:0;
    height:50px;
    font-size: 30px;
    width:150px;
    padding:3px 5px;
  }
</style>