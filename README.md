# NoriDraw

yarn `yarn add nori-draw`
npm  `npm install nori-draw`

### Using

your file in created dist folder
```
import Draw from 'nori-draw'
 
const div = document.getElementById('id');
const options = {
        width: 500,
        height: 500,
        sizeValue:'px',
        bg: '#FFFFFF',
        lineColor: '#FFFFFF',
        lineWidth: 1,
        cursor: 'default',
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderStyle: 'solid'
}
 
const draw = new Draw(div, options);
```
