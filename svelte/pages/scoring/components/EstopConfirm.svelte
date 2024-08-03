<script lang=ts>


    let dialogElement: HTMLDivElement


    let resolveFunc
    export const confirm: () => Promise<boolean> = () => {
        dialogElement.style.display = "contents"
        return new Promise((resolve) => {
            resolveFunc = resolve
        })
    }

    function responseCancel() {
        resolveFunc(false)
        dialogElement.style.display = "none"
    }

    function responseConfirm() {
        resolveFunc(true)
        dialogElement.style.display = "none"
    }
</script>

<div style="display:none" bind:this={dialogElement}>
    <div class="mask"></div>
    <div class=dialog style="width:50vw; height:30vh;display:flex;flex-flow:column nowrap;justify-content:space-between">
        <slot>
        <span>
            Are you sure you want to Estop?
            <br>
            <br>Team <slot name=robot></slot>
        </span>
        </slot>
        <div>
            <button on:click={responseCancel} style="background-color:#505050;padding:20px;">Cancel</button>
            <button on:click={responseConfirm} style="background-color:#8a3333;padding:20px;">Estop</button>
        </div>
    </div>
</div>

<style>
    .dialog {
        z-index: 99999;

        position: fixed;
        top: 50%;
        left:50%;
        transform: translate(-50%, -50%);
        background-color: #1c1c1c;
        border-radius: 5px;
        padding:50px;
    }

    .mask {
        background: rgba(0, 0, 0, 0.5);
        position: absolute;
        z-index: 99998;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }
</style>
