<div>
    <img alt="orientation overlay" src="/orientation_image.svg"/>
</div>

<style>
    div {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 20;
        background-color: rgba(0, 0, 0, 0.5);
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    @media (orientation: landscape) {
        div {
            display: none;
        }
    }
</style>