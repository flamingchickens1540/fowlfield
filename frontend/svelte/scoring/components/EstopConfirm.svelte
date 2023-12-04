<script lang=ts>
    let dialogElement:HTMLDialogElement
    export const confirm:() => Promise<boolean> = () => {
        return new Promise((resolve) => {
            dialogElement.addEventListener("close", () => {
                resolve(dialogElement.returnValue == '1')
                dialogElement.close()
            }, {once: true})
            dialogElement.showModal()
        })
    }
</script>

<dialog bind:this={dialogElement}>
    <div style="width:50vw; height:30vh;display:flex;flex-flow:column nowrap;justify-content:space-between">
    <slot>
        <span>
            Are you sure you want to Estop?
            <br>
            <br>Team <slot name=robot></slot>
        </span>
    </slot>
    <form method="dialog">
        <button value="0" formmethod="dialog" style="background-color:#505050;padding:20px;">Cancel</button>
        <button value="1" formmethod="dialog" style="background-color:#8a3333;padding:20px;">Estop</button>
    </form>
</div>
</dialog>

<style>
    dialog::backdrop {
        touch-action: none;
        height: 100%;
        overscroll-behavior-y: none;
    }
    dialog {
        touch-action:none;
    }
</style>