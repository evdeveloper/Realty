document.addEventListener('DOMContentLoaded', () => {
  
  const findElements = (object) => {
    const instance = object;
    const { node, select } = instance;
    instance.toggle = node.children[0];
    instance.holder = node.children[1];
    instance.isActive = false;
    instance.options = select.options;
    instance.active = select.selectedIndex >= 0 ? select.selectedIndex : 0;
    return instance;
  };
  
  const isOption = (target, { className }) => target.classList.contains(`${className}__option`);
  
  const shouldDropdown = (target, { className }) => target.classList.contains(`${className}__option`);
  
  const createBaseHTML = (value, className) => (`
    <div class="${className}">
      <button class="${className}__toggle" type="button">${value}</button>
      <ul class="${className}__options"></ul>
      <svg class="svg-sprite-icon  icon-arrow-down select__icon">
        <use xlink:href="static/images/svg/symbol/sprite.svg#arrow-down"></use>
      </svg>
    </div>
  `);
  
  const insertBase = (select, className) => {
    const selectedIndex = select.selectedIndex >= 0 ? select.selectedIndex : 0;
    const value = select.options[selectedIndex].textContent;
    const html = createBaseHTML(value, className);
    select.insertAdjacentHTML('afterend', html);
  };
  
  const renderOption = (html, option, index, active, className) => {
    const activeClassName = index === active ? `${className}__option--active` : '';
    return `
      ${html}
      <li class="${className}__option ${activeClassName}" data-index="${index}">${option.textContent}</li>
    `;
  };
  
  const renderOptions = (options, active, className) => {
    return [...options].reduce((acc, option, index) => renderOption(acc, option, index, active, className), '');
  };
  
  const pickOption = (object) => {
    const instance = object;
    const { select, active, customOptions, className } = instance;
    select.selectedIndex = active;
    instance.optionActive.classList.remove(`${className}__option--active`);
    instance.optionActive = customOptions[active];
    instance.optionActive.classList.add(`${className}__option--active`);
    instance.toggle.textContent = instance.optionActive.textContent;
  };
  
  const onOptionsClick = (event, object) => {
    event.preventDefault();
    const instance = object;
    const { select, hideDropdown } = instance;
    const { target } = event;
    if (isOption(target, instance)) {
        instance.active = target.dataset.index;
        pickOption(instance);
    }
    if (shouldDropdown(target, instance)) {
      hideDropdown();
    }
  };
  
  const initOptionsEvents = (instance) => {
    instance.holder.addEventListener('click', event => onOptionsClick(event, instance));
  };
  
  const render = (object) => {
    const instance = object;
    const { holder, options, className, active } = instance;
    const html = renderOptions(options, active, className);
    holder.insertAdjacentHTML('afterbegin', html);
    instance.customOptions = [...holder.children];
    instance.optionActive = instance.customOptions[active];
    initOptionsEvents(instance);
  };
  
  const hideSelect = ({ node, select }) => node.appendChild(select);
  
  const wrapSelect = (object) => {
    const instance = object;
    const { select, className } = instance;
    return new Promise((resolve) => {
      requestIdleCallback(() => {
        insertBase(select, className);
        instance.node = select.nextElementSibling;
        hideSelect(instance);
        resolve(instance);
      });
    });
  };
  
  const unsubscribeDocument = ({ hideDropdown }) => document.removeEventListener('click', hideDropdown); 
  const subscribeDocument = ({ hideDropdown }) => document.addEventListener('click', hideDropdown);
  
  const hideOptions = (object) => {
    const instance = object;
    const { node, className } = instance;
    instance.isActive = false;
    node.classList.remove(`${className}--active`);
    unsubscribeDocument(instance);
  };
  
  const showOptions = (object) => {
    const instance = object;
    const { node, className } = instance;
    instance.isActive = true;
    node.classList.add(`${className}--active`);
    subscribeDocument(instance);
  };
  
  const toggleOptions = (instance) => {
    if (instance.isActive) hideOptions(instance);
    else showOptions(instance);
  };
  
  const onNodeClick = event => event.stopPropagation();
  
  const initEvents = (object) => {
    const instance = object;
    const { node, toggle } = instance;
    const showDropdown = () => { showOptions(instance); };
    const hideDropdown = () => { hideOptions(instance); };
    const toggleDropdown = () => { toggleOptions(instance); };
    instance.showDropdown = showDropdown;
    instance.hideDropdown = hideDropdown;
    instance.toggleDropdown = toggleDropdown;
    toggle.addEventListener('click', toggleDropdown);
    node.addEventListener('click', onNodeClick);
    return instance;
  };
  
  const constructor = (select) => {
    const instance = {
      select,
      className: select.dataset.customSelectClass,
    };
    
    const init = () => {
      wrapSelect(instance)
        .then(findElements)
        .then(initEvents)
        .then(render);
    };
  
    init();
  };
  
  const selects = document.querySelectorAll('[data-custom-select-class]');
  selects.forEach(constructor);

});
