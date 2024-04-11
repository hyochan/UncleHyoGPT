export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2); // 월은 0부터 시작하므로 +1 해줍니다.
  const day = (`0${date.getDate()}`).slice(-2);

  const hours = (`0${date.getHours()}`).slice(-2);
  const minutes = (`0${date.getMinutes()}`).slice(-2);
  const seconds = (`0${date.getSeconds()}`).slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
