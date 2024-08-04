<div class=estop-container>
    This product has been discontinued
</div>


<style lang="scss">
    :global(:root) {
        touch-action: none;
        height: 100%;
        overscroll-behavior-y: none;
    }
    :global(body) {
        margin:0 !important;
        padding:0;
    }


    .estop-container {
        position:absolute;
        left:0;
        right:0;
        top:0;
        bottom:0;   
        display:grid;
        grid-auto-flow:column;
        grid-template-columns: 50vw 50vw;
        grid-template-rows: auto auto auto;
    }
    .red-estop-box, .blue-estop-box {
        border:1px solid white;
        margin:5px;
    }
    .red-estop-box {
        background-color: var(--red);
    }
    .blue-estop-box {
        background-color: var(--blue);
    }
    // .red-estop-box, .blue-estop-box {
    //     border:1px solid white;
    //     position:absolute;
    //     &:nth-child(1) {
    //         top:0px;
    //         bottom:calc(200vh/3);
    //     }
    //     &:nth-child(2) {
    //         top:calc(100vh/3);
    //         bottom:calc(100vh/3)
    //     }
    //     &:nth-child(3) {
    //         top:calc(200vh/3);
    //         bottom:0
    //     }
    // }

</style>