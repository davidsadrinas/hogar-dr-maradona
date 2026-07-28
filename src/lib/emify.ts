// Convierte la convención de los textos editables a HTML seguro:
// *texto* → <em>texto</em> (destacado en color) y **texto** → <b>texto</b>.
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function emify(s: string = ''): string {
  return esc(s)
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
