import React from 'react';
import '@styles/components/DateEasy.css';

interface DaySchedule {
  day: string; 
  from: string;
  to: string;
}

interface Props {
  schedules: DaySchedule[];
  startDate: string; 
  endDate: string;   
}

const DateEasy: React.FC<Props> = ({ schedules, startDate, endDate }) => {
  // Parse semester start/end dates from DD.MM.YYYY format
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('.').map(Number);
    return new Date(year, month - 1, day);
  };

  const semesterStart = parseDate(startDate);
  const semesterEnd = parseDate(endDate);

  const getWeekNumber = (semesterStart: Date, target: Date): number => {
    const start = new Date(semesterStart);
    start.setHours(0, 0, 0, 0);

    const date = new Date(target);
    date.setHours(0, 0, 0, 0);

    if (date < start) return 0;

    const diffMs = date.getTime() - start.getTime();
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;

    return Math.floor(diffMs / msPerWeek) + 1;
  };

  const formatDayName = (date: Date): string => {
    const weekday = date.toLocaleDateString('pl-PL', { weekday: 'long' });
    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
  };

  const getWeekdayNumber = (date: Date): number => date.getDay();

  const formatWeekRanges = (weeks: number[]): string => {
    const sorted = [...weeks].sort((a, b) => a - b);
    const ranges: string[] = [];

    let start = sorted[0];
    let end = start;

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === end + 1) {
        end = sorted[i];
      } else {
        if (end - start >= 2) {
          ranges.push(`${start}–${end}`);
        } else if (end - start === 1) {
          ranges.push(`${start}`, `${end}`);
        } else {
          ranges.push(`${start}`);
        }
        start = end = sorted[i];
      }
    }

    if (end - start >= 2) {
      ranges.push(`${start}–${end}`);
    } else if (end - start === 1) {
      ranges.push(`${start}`, `${end}`);
    } else {
      ranges.push(`${start}`);
    }

    return ranges.join(', ');
  };

  if (schedules.length === 0) return null;

  // Use first record to filter schedules
  const { day: firstDay, from: targetFrom, to: targetTo } = schedules[0];
  const targetDate = parseDate(firstDay);
  const targetWeekdayNumber = getWeekdayNumber(targetDate);
  const targetWeekdayName = formatDayName(targetDate);

  const filtered = schedules.filter((s) => {
    const date = parseDate(s.day);
    return (
      s.from === targetFrom &&
      s.to === targetTo &&
      getWeekdayNumber(date) === targetWeekdayNumber &&
      date >= semesterStart &&
      date <= semesterEnd
    );
  });

  const weekNumbers = filtered
    .map(({ day }) => getWeekNumber(semesterStart, parseDate(day)))
    .filter((w) => w > 0);

  return (
    <div className="date-easy">
      <div className="date-easy__item">
        <strong><i className="fa-solid fa-calendar-days"></i> {targetWeekdayName} ({targetFrom}–{targetTo})</strong><br />
        <span>Tygodnie: {formatWeekRanges(weekNumbers)}</span>
      </div>
    </div>
  );
};

export default DateEasy;
