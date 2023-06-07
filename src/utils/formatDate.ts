const formatDate = (dateData: Date): string => {
  const yyyy = dateData.getFullYear();
  let mm: string | number = dateData.getMonth() + 1; // Months start at 0!
  let dd: string | number = dateData.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const formattedToday = `${dd}/${mm}/${yyyy}`;
  return formattedToday;
};

export default formatDate;
