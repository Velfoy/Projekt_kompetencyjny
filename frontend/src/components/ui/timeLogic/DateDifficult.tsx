import React, { useState } from 'react';
import '@styles/components/DateDifficult.css';

interface DaySchedule {
  day: string; // "DD.MM.YYYY"
  from: string;
  to: string;
}

interface Props {
  schedule: DaySchedule[];
  semesterStart: string;
  semesterEnd: string;
}

const DateDifficult: React.FC<Props> = ({ schedule, semesterStart, semesterEnd }) => {
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('.').map(Number);
    return new Date(year, month - 1, day);
  };

  const polishWeekdays = [
    'Poniedziałek',
    'Wtorek',
    'Środa',
    'Czwartek',
    'Piątek',
    'Sobota',
    'Niedziela',
  ];

  const getFirstMonday = (date: Date): Date => {
    const newDate = new Date(date);
    const day = newDate.getDay();
    const daysToAdd = day === 0 ? 1 : (8 - day) % 7;
    newDate.setDate(newDate.getDate() + daysToAdd);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const getWeekNumber = (adjustedStartDate: Date, targetDate: Date): number => {
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    const diff = target.getTime() - adjustedStartDate.getTime();
    if (diff < 0) return 0;
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    return Math.floor(diff / msPerWeek) + 1;
  };

  const semesterStartDate = parseDate(semesterStart);
  const semesterEndDate = parseDate(semesterEnd);
  const adjustedSemesterStart = getFirstMonday(semesterStartDate);

  type TimeEntry = { from: string; to: string };
  type WeekData = { [weekday: string]: TimeEntry[] };
  type AllWeeksData = { [week: number]: WeekData };

  const weeksData: AllWeeksData = {};

  schedule.forEach(({ day, from, to }) => {
    const date = parseDate(day);
    if (date < semesterStartDate || date > semesterEndDate) return;

    const weekNum = getWeekNumber(adjustedSemesterStart, date);
    const weekdayIdx = (date.getDay() + 6) % 7;
    const weekdayName = polishWeekdays[weekdayIdx];

    if (!weeksData[weekNum]) weeksData[weekNum] = {};
    if (!weeksData[weekNum][weekdayName]) weeksData[weekNum][weekdayName] = [];
    weeksData[weekNum][weekdayName].push({ from, to });
  });

  const [openWeeks, setOpenWeeks] = useState<{ [key: number]: boolean }>({});

  const toggleWeek = (week: number) => {
    setOpenWeeks((prev) => ({ ...prev, [week]: !prev[week] }));
  };

  const sortedWeeks = Object.keys(weeksData)
    .map(Number)
    .sort((a, b) => a - b);

  if (sortedWeeks.length === 0) {
    return <div className="date-difficult__empty">Brak rezerwacji w podanym semestrze.</div>;
  }

  return (
    <div className="date-difficult">
      {sortedWeeks.map((week) => (
        <div key={week} className="date-difficult__week">
         <button
            className="date-difficult__toggle"
            onClick={() => toggleWeek(week)}
            aria-expanded={!!openWeeks[week]}
            >
            Tydzień {week}
            </button>


          {openWeeks[week] && (
            <div className="date-difficult__schedule">
              {polishWeekdays.map((weekday) =>
                weeksData[week][weekday] ? (
                  <div key={weekday} className="date-difficult__day">
                    <span className="date-difficult__day-name">{weekday}:</span>
                    <ul className="date-difficult__times">
                      {weeksData[week][weekday].map(({ from, to }, idx) => (
                        <li key={idx} className="date-difficult__time">
                          {from} - {to}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DateDifficult;
