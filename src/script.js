const mainContainer = document.createElement('div');
const keyboard = document.createElement('div');
const textarea = document.createElement('textarea');
const layoutMessage = document.createElement('div');

mainContainer.classList.add('main-container');
keyboard.setAttribute('id', 'keyboard');
textarea.setAttribute('id', 'textarea');
textarea.toggleAttribute('autofocus');
layoutMessage.classList.add('message');
layoutMessage.innerText = 'Press Shift + Alt on physical keyboard to change layout';

// Textarea always on focus
textarea.onblur = () => {
    textarea.focus();
};

// Keyboard layouts
class KeyLayout {
  constructor(keys) {
    this.keys = keys;
  }
}

const RUSSIAN = new KeyLayout(
  ['ё', ['1', '!'],
    ['2', '"'],
    ['3', '№'],
    ['4', ';'],
    ['5', '%'],
    ['6', ':'],
    ['7', '?'],
    ['8', '*'],
    ['9', '('],
    ['0', ')'],
    ['-', '_'],
    ['=', '+'],
    'Backspace',
    'Tab',
    'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', ['\x5c', '/'],
    'Del',
    'Caps Lock',
    'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э',
    'Enter', 'Shift',
    'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', ['.', ','],
    '▲', 'Shift', 'Ctrl',
    'Win', 'Alt', 'Space', 'Alt', 'Ctrl', '◀', '▼', '▶',
  ]
);

const ENGLISH = new KeyLayout(
  [
    ['`', '~'],
    ['1', '!'],
    ['2', '@'],
    ['3', '#'],
    ['4', '$'],
    ['5', '%'],
    ['6', '^'],
    ['7', '&'],
    ['8', '*'],
    ['9', '('],
    ['0', ')'],
    ['-', '_'],
    ['=', '+'],
    'Backspace',
    'Tab',
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', ['[', '{'],
    [']', '}'],
    ['\x5c', '|'],
    'Del',
    'Caps Lock',
    'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', [';', ':'],
    ["'", '"'],
    'Enter', 'Shift',
    'z', 'x', 'c', 'v', 'b', 'n', 'm', [',', '<'],
    ['.', '>'],
    ['/', '?'],
    '▲', 'Shift', 'Ctrl',
    'Win', 'Alt', 'Space', 'Alt', 'Ctrl', '◀', '▼', '▶',
  ]
);

if (!localStorage.getItem('layout')) {
  localStorage.setItem('layout', JSON.stringify(ENGLISH));
}
let keyLayout = JSON.parse(localStorage.getItem('layout'));

// Building the keyboard
function keyboardInit(layout) {
  keyboard.innerHTML = '';
  layout.keys.forEach((el) => {
    const key = document.createElement('button');
    if (Array.isArray(el)) {
      // For double buttons such as numbers and special symbols
      key.classList.add('key');
      key.innerHTML = `<span class="non-shift">${el[1]}</span><span class="onshift">${el[0]}</span>`;
      key.addEventListener('click', () => {
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, startPos)
        + el[0] + textarea.value.substring(endPos, textarea.value.length);
        textarea.selectionStart = startPos + 1;
        textarea.selectionEnd = endPos + 1;
      });
    } else {
      // For single buttons
      switch (el) {
        case 'Backspace':
          key.classList.add('key', 'backspace');
          key.addEventListener('click', () => {
            const startPos = textarea.selectionStart;
            const endPos = textarea.selectionEnd;
            textarea.value = textarea.value.substring(0, startPos - 1)
            + textarea.value.substring(endPos, textarea.value.length);
            textarea.selectionStart = startPos - 1;
            textarea.selectionEnd = endPos - 1;
          });
          break;
        case 'Tab':
          key.classList.add('key', 'tab');
          key.addEventListener('click', () => {
            const startPos = textarea.selectionStart;
            const endPos = textarea.selectionEnd;
            textarea.value = `${textarea.value.substring(0, startPos)}\t${textarea.value.substring(endPos, textarea.value.length)}`;
            textarea.selectionStart = startPos + 1;
            textarea.selectionEnd = endPos + 1;
          });
          break;
        case 'Del':
          key.classList.add('key', 'del');
          key.addEventListener('click', () => {
            const startPos = textarea.selectionStart;
            const endPos = textarea.selectionEnd;
            textarea.value = textarea.value.substring(0, startPos)
            + textarea.value.substring(endPos + 1, textarea.value.length);
            textarea.selectionStart = startPos;
            textarea.selectionEnd = endPos;
          });
          break;
        case 'Caps Lock':
          key.classList.add('key', 'caps-lock');
          key.addEventListener('click', () => {
            const letters = document.querySelectorAll('.letter');
            letters.forEach((item) => {
              item.innerText = item.innerText === item.innerText.toUpperCase()
                ? item.innerText.toLowerCase() : item.innerText.toUpperCase();
            });
          });
          break;
        case 'Enter':
          key.classList.add('key', 'enter');
          key.addEventListener('click', () => {
            const startPos = textarea.selectionStart;
            const endPos = textarea.selectionEnd;
            textarea.value = `${textarea.value.substring(0, startPos)}\n${textarea.value.substring(endPos, textarea.value.length)}`;
            textarea.selectionStart = startPos + 1;
            textarea.selectionEnd = endPos + 1;
          });
          break;
        case 'Shift':
          key.classList.add('key', 'shift');
          break;
        case '▲':
          key.classList.add('key', 'up');
          key.addEventListener('click', () => {
            textarea.selectionStart = textarea.value.length;
            textarea.selectionEnd = textarea.value.length;
          });
          break;
        case 'Ctrl':
          key.classList.add('key', 'ctrl');
          break;
        case 'Win':
          key.classList.add('key', 'win');
          break;
        case 'Alt':
          key.classList.add('key', 'alt');
          break;
        case 'Space':
          key.classList.add('key', 'space');
          key.addEventListener('click', () => {
            const startPos = textarea.selectionStart;
            const endPos = textarea.selectionEnd;
            textarea.value = `${textarea.value.substring(0, startPos)} ${textarea.value.substring(endPos, textarea.value.length)}`;
            textarea.selectionStart = startPos + 1;
            textarea.selectionEnd = endPos + 1;
          });
          break;
        case '◀':
          key.classList.add('key', 'left');
          key.addEventListener('click', () => {
            if (textarea.selectionStart === textarea.selectionEnd) {
              textarea.selectionStart -= 1;
              textarea.selectionEnd -= 1;
            } else {
              textarea.selectionEnd = textarea.selectionStart;
            }
          });
          break;
        case '▼':
          key.classList.add('key', 'down');
          key.addEventListener('click', () => {
            textarea.selectionStart = 0;
            textarea.selectionEnd = 0;
          });
          break;
        case '▶':
          key.classList.add('key', 'right');
          key.addEventListener('click', () => {
            if (textarea.selectionStart === textarea.selectionEnd) {
              textarea.selectionStart = textarea.selectionEnd;
              textarea.selectionEnd += 1;
              textarea.selectionStart += 1;
            } else {
              textarea.selectionStart = textarea.selectionEnd;
            }
          });
          break;
        default:
          // For letters
          key.classList.add('key');
          key.classList.add('letter');
          key.addEventListener('click', () => {
            const startPos = textarea.selectionStart;
            const endPos = textarea.selectionEnd;
            textarea.value = textarea.value.substring(0, startPos)
            + key.innerText + textarea.value.substring(endPos, textarea.value.length);
            textarea.selectionStart = startPos + 1;
            textarea.selectionEnd = endPos + 1;
          });
          break;
      }
      key.innerText = el;
    }
    keyboard.appendChild(key);
  });
}

keyboardInit(keyLayout);

// Physical and virtual keyboard synchronization
const keyAlternateNames = {
  Alt: 'Alt',
  Shift: 'Shift',
  Delete: 'Del',
  CapsLock: 'Caps Lock',
  Control: 'Ctrl',
  Meta: 'Win',
  ' ': 'Space',
  ArrowUp: '▲',
  ArrowDown: '▼',
  ArrowLeft: '◀',
  ArrowRight: '▶'
};

document.addEventListener('keydown', (event) => {
  for (const el of keyboard.childNodes) {
    const isKeyMatched = event.key === el.innerText || event.key === el.childNodes[0]?.innerText
        || event.key === el.childNodes[1]?.innerText
        || keyAlternateNames[event.key] === el.innerText;

    if (isKeyMatched) {
      el.classList.toggle('active');

      // Clicking on special buttons as shift, ctrl, etc
      /* eslint-disable */
      if (keyAlternateNames.hasOwnProperty(event.key)) {
        el.click();
      }
      /* eslint-enable */

      break;
    }
  }
});

document.addEventListener('keyup', (event) => {
  for (const el of keyboard.childNodes) {
    const isKeyMatched = event.key === el.innerText || event.key === el.childNodes[0]?.innerText
    || event.key === el.childNodes[1]?.innerText || keyAlternateNames[event.key] === el.innerText;

    if (isKeyMatched) {
      el.classList.toggle('active');

      break;
    }
  }
});

// Keys combinations
let isShiftPressed = false;
let isAltPressed = false;

function checkKeyCombinationPhysical(event) {
  if (event.key === 'Shift') {
    isShiftPressed = true;
  } else if (event.key === 'Alt') {
    isAltPressed = true;
  } else {
    isShiftPressed = false;
    isAltPressed = false;
  }

  if (isShiftPressed && isAltPressed) {
    if (keyLayout === ENGLISH) {
      keyLayout = RUSSIAN;
      localStorage.setItem('layout', JSON.stringify(RUSSIAN));
    } else {
      keyLayout = ENGLISH;
      localStorage.setItem('layout', JSON.stringify(ENGLISH));
    }

    keyboardInit(keyLayout);
    isShiftPressed = false;
    isAltPressed = false;
  }
}

/* function checkKeyCombinationVirtual(el) {
  if (el.innerText === 'Shift') {
    isShiftPressed = true;
  } else if (el.innerText === 'Alt') {
    isAltPressed = true;
  } else {
    isShiftPressed = false;
    isAltPressed = false;
  }

  if (isShiftPressed && isAltPressed) {
    if (keyLayout === ENGLISH) {
      keyLayout = RUSSIAN;
      localStorage.setItem('layout', JSON.stringify(RUSSIAN));
    } else {
      keyLayout = ENGLISH;
      localStorage.setItem('layout', JSON.stringify(ENGLISH));
    }

    keyboardInit(keyLayout);
    isShiftPressed = false;
    isAltPressed = false;
  }
} */

document.addEventListener('keydown', (event) => {
  if (keyAlternateNames[event.key]) {
    checkKeyCombinationPhysical(event);
  }
});

/* keyboard.childNodes.forEach((el) => {
      el.addEventListener('click', () => {
          if (Object.values(keyAlternateNames).includes(el.innerText)) {
              console.log(isShiftPressed)
              checkKeyCombinationVirtual(el);
          }
      });
  }); */

mainContainer.appendChild(layoutMessage);
mainContainer.appendChild(keyboard);
mainContainer.appendChild(textarea);

document.body.append(mainContainer);
