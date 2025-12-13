export function createMarkerElement(count: number) {
  const el = document.createElement('div');

  // --- 1. Logarithmic size scaling ---
  const baseSize = 20; // minimum size
  const scale = Math.log(count + 1); // log scale
  const size = baseSize + scale * 10; // adjust multiplier to taste

  // --- 2. Dynamic sizing based on size ---
  el.style.minWidth = `${size}px`;
  el.style.minHeight = `${size}px`;
  el.style.padding = '4px'; // let text push outward if needed

  // --- 3. Random background color ---
  el.style.backgroundColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;

  // --- 4. Visual styling ---
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.borderRadius = '50%';
  el.style.color = '#fff';
  el.style.fontSize = '12px';
  el.style.fontWeight = 'bold';

  el.textContent = String(count);

  return el;
}
