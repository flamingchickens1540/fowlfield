<script context=module lang=ts>

</script>
<script lang=ts>
    import matchData, { loadedMatch } from '~/lib/store'
    import { derived, writable } from 'svelte/store'
    import type { ToteKey } from '~common/types'
    import { getBlankTote } from '~common/utils/blanks'
    import SelectorButton from './components/SelectorButton.svelte'
    import InputComponent from './components/InputComponent.svelte'
    import type { Tote } from '@prisma/client'
    import socket from '~/lib/socket'
    import { onMount } from 'svelte'

    const { scores, state } = matchData
    const index = writable<ToteKey>('tote1')
    const tote = derived([scores, index], ([$scores, $index]) => $scores.totes[$index], getBlankTote())
    scores.setWritable()
    onMount(() => {
        const initialSize = window.visualViewport!.height
        window.visualViewport!.addEventListener('scroll', (e) => {
            if (window.visualViewport!.height == initialSize && window.scrollY != 0) {
                window.scrollTo(0, 0)

            }
        })
        document.addEventListener('dblclick', function(event) {
            event.preventDefault()
        }, { passive: false })
    })
    const totes: { label: string, key: ToteKey }[] = []
    for (let i = 1; i <= 12; i++) {
        totes.push({ label: i.toString(), key: `tote${i as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}` })
    }


    // Avoid updating too quickly
    const timeouts = new Map<string, number>()
    function update(field: keyof Tote, value?: number) {
        if (field == 'bunnies' && value != null && value < 0) {
            value = 0
        }
        if (value != null) {
            if (timeouts.has(field)) {
                clearTimeout(timeouts.get(field))
            }
            timeouts.set(field, setTimeout(() => {
                socket.emit('toteData', $loadedMatch, $index, { [field]: value })
                timeouts.delete(field)
            }, 500) as unknown as number)
        }
    }
</script>

<div class="btn-group">
    {#each totes as { key, label },i}
        <SelectorButton {key} {label} parentStore={index}></SelectorButton>
    {/each}
</div>
<div class="parent">
    <div class="inputcontainer">
        <InputComponent updateFunction={update} {tote} field="red_balloons"></InputComponent>
        <InputComponent updateFunction={update} {tote} field="blue_balloons"></InputComponent>
        <InputComponent updateFunction={update} {tote} field="bunnies"></InputComponent>
    </div>
    <div class="scorecontainer">
    </div>
</div>
<style lang=scss>
  .parent {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .inputcontainer {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .scorecontainer {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  :global(:root) {
    //touch-action: none;
    height: 100%;
    overscroll-behavior-y: none;
  }

  :global(body) {
    margin: 0 !important;
    padding: 0;
  }

  .btn-group {
    display: flex;
    flex-direction: row;
    gap: 0;
    justify-content: center;
    margin: 10px;
  }


  /* Clear floats (clearfix hack) */
  .btn-group:after {
    content: "";
    clear: both;
    display: table;
  }

</style>