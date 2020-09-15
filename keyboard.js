const keyboard = () => {
  let keyboardWrapper = document.querySelector('.keyboard');
  let keys = document.querySelector('.keyboardKeys');
  let userInputArea = document.querySelector('.userInput');

  let value = '';
  let capslock = false;
  let keysCollection = [];

  let onInput = null;
  let onClose = null;

  // open keyboard on text area focus
  userInputArea.addEventListener('focus', () => {
    open(userInputArea.value, val => {
      userInputArea.value = val;
    });
  });

  let createKeys = () => {
    let fragment = document.createDocumentFragment();
    let keyLayout = [
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace',
      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
      'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'enter',
      'done', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '?',
      'space'
    ];

    // html for creating icon
    let createIconHtml = iconName => {
      return `<i class='material-icons'>${iconName}</i>`;
    };

    let lineBreakElements = ['backspace', 'p', 'enter', '?'];

    keyLayout.forEach(key => {
      const element = document.createElement('button');
      const insertLineBreak = lineBreakElements.indexOf(key) !== -1;

      // Add properties
      element.setAttribute('type', 'button');
      element.classList.add('key');

      switch(key) {
        case 'backspace':
          element.classList.add('wide');
          element.innerHTML = createIconHtml('backspace');

          element.addEventListener('click', () => {
            // user might use actual keyboard to type in between
            // this syncs the value between actual keyboard and virtual keyboard
            if (userInputArea.value !== value) {
              value = userInputArea.value;
            }

            value = value.substring(0, value.length-1);
            triggerEvent('onInput');
          });
          break;
        case 'caps':
          element.classList.add('wide', 'capslock');
          element.innerHTML = createIconHtml('keyboard_capslock');

          element.addEventListener('click', () => {
            if (userInputArea.value !== value) {
              value = userInputArea.value;
            }

            toggleCapslock();
            element.classList.toggle('active', capslock);
          });
          break;
        case 'done':
          element.classList.add('wide', 'dark');
          element.innerHTML = createIconHtml('check_circle');

          element.addEventListener('click', () => {
            if (userInputArea.value !== value) {
              value = userInputArea.value;
            }

            close();
            triggerEvent('onClose');
          });
          break;
        case 'enter':
          element.classList.add('wide');
          element.innerHTML = createIconHtml('keyboard_return');

          element.addEventListener('click', () => {
            if (userInputArea.value !== value) {
              value = userInputArea.value;
            }

            value += '\n';
            triggerEvent('onInput');
          });
          break;
        case 'space':
          element.classList.add('extraWide');
          element.innerHTML = createIconHtml('space_bar');

          element.addEventListener('click', () => {
            if (userInputArea.value !== value) {
              value = userInputArea.value;
            }

            value += ' ';
            triggerEvent('onInput');
          });
          break;
        default:
          element.textContent = key.toLowerCase();

          element.addEventListener('click', () => {
            if (userInputArea.value !== value) {
              value = userInputArea.value;
            }

            value += capslock ? key.toUpperCase() : key.toLowerCase();
            triggerEvent('onInput');
          });
      }

      fragment.appendChild(element);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  };

  let close = () => {
    value = '';
    onClose = null;
    onInput = null;

    // hide keyboard
    keyboardWrapper.classList.add('hidden');
  };

  let open = (initValue = '', onInput, onClose) => {
    value = initValue;
    this.onClose = onClose;
    this.onInput = onInput;

    // show keyboard
    keyboardWrapper.classList.remove('hidden');
  }

  let toggleCapslock = () => {
    capslock = !capslock;

    for (let key of keysCollection) {
      // this makes sure it is a alphabet or digits key
      // other keys like caps, space, etc. has child <i></i> tag
      if (key.childElementCount === 0) {
        let content = key.textContent;
        key.textContent = capslock ? content.toUpperCase() : content.toLowerCase();
      }
    }
  };

  let triggerEvent = event => {
    window[event](value);
  };

  // add keys to the keyboard
  keys.appendChild(createKeys());
  // childNodes cannot be used as it returns <br /> as well
  //keysCollection = keys.childNodes;
  keysCollection = keys.querySelectorAll('.key');
  // open('', val => console.log('open: ', val), val => console.log('close: ', val))
};

keyboard();
