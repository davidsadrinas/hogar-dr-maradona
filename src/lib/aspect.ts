// Orientación de las fotos, elegible desde el panel /admin.
// El marco recorta la foto a esta proporción, así la grilla no se descuadra.
const RATIOS: Record<string, string> = {
  horizontal: '4/3',
  vertical: '4/5',
  cuadrada: '1/1',
};

export function aspecto(orientacion?: string | null, porDefecto = 'horizontal'): string {
  return RATIOS[orientacion || porDefecto] ?? RATIOS.horizontal;
}
