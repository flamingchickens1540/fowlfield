<script lang="ts">
    import { get, Writable } from 'svelte/store'
    import type { ChangeEventHandler } from 'svelte/elements'
    import { safeParseInt } from '~common/utils'

    export let label:string
    export let store:Writable<number>

    const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const target = event.target as HTMLInputElement
        store.set(safeParseInt(target.value) ?? get(store))
    }
</script>

<div class="row">
    <span>{label}</span>
    <div>
        <input type="number" value={$store} on:change={onChange}/>
    </div>
</div>

<style lang="scss">
  .row {
    span {
      font-weight: bold;
      font-size: 1.5rem;
    }
    input {
      width: 90%;
      outline-color: rgba(183, 183, 183, 0.3);
      background-color: #404040a0;
      accent-color: rgba(183, 183, 183, 0.63);
      padding: 5px;
      border-radius: 5px;
      font-size: 2rem;
      text-align: center;
    }
    padding: 5px 100px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    background-color: var(--bgcolor, #4a4a4a);
    border: solid #a0a0a0 1px;
  }
</style>
