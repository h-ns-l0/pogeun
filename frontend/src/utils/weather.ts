export function formatForecastLabel(date: string, time: string) {
  if (date.length !== 8 || time.length !== 4) {
    return `${date} ${time}`;
  }

  const month = date.slice(4, 6);
  const day = date.slice(6, 8);
  const hour = time.slice(0, 2);

  return `${month}.${day} ${hour}시`;
}
