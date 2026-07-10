// Small typed helper for creating DOM nodes without a UI framework.
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | boolean | undefined> = {},
  ...children: (Node | string | null | undefined | false)[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === false) continue;
    if (key === 'className') {
      node.className = String(value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
    } else if (value === true) {
      // Boolean attributes render as present/empty, e.g. disabled="".
      node.setAttribute(key, '');
    } else {
      node.setAttribute(key, String(value));
    }
  }

  for (const child of children) {
    if (child == null || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }

  return node;
}

// Attach an event listener and return its cleanup function.
export function on(target: EventTarget, type: string, handler: EventListener): () => void {
  target.addEventListener(type, handler);
  return () => target.removeEventListener(type, handler);
}

// Clear a container before rendering a new page or state.
export function clearChildren(element: HTMLElement): void {
  element.replaceChildren();
}
