// =========================================================================
// ---------------------- 1. ESTRUCTURACIÓN DE CALENDARIO POR SEMANAS -------
// =========================================================================

export interface DayInfo {
  dayNum: number;
  dayName: string;
  isPlaceholder: boolean;
}

export function getMonthWeeksMatrix(monthIndex: number, year: number): DayInfo[][] {
  const weeks: DayInfo[][] = [];
  const firstDayInstance = new Date(year, monthIndex, 1);
  const totalDays = new Date(year, monthIndex + 1, 0).getDate();
  
  // Ajustar para que la semana empiece en Lunes (0 = Lunes, 6 = Domingo)
  let startDayOfWeek = firstDayInstance.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6; // Si era Domingo, pasa a ser el índice 6

  let currentWeek: DayInfo[] = [];

  // 1. Rellenar los días vacíos de la primera semana si el mes no empieza en Lunes
  for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push({ dayNum: 0, dayName: '', isPlaceholder: true });
  }

  // 2. Inyectar los días reales del mes
  for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
    const dateObj = new Date(year, monthIndex, dayNum);
    const dayName = dateObj.toLocaleString('es', { weekday: 'narrow' });

    currentWeek.push({ dayNum, dayName, isPlaceholder: false });

    // Cuando completamos 7 días (Lunes a Domingo), cerramos la semana y abrimos otra
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // 3. Rellenar la última semana si quedó incompleta
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ dayNum: 0, dayName: '', isPlaceholder: true });
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

export const MONTHS_LIST = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];