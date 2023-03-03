const background = document.querySelector('.background');
const tile = document.createElement('span');
const tileCount = 100;

for (let i = 0; i < tileCount; i++) {
    background.appendChild(tile.cloneNode());
}