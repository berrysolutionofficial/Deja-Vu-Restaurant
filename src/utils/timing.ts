/**
 * Deja Vu Restaurant Timing & Delivery Rules
 * Operating Hours: 11:00 AM to 2:00 AM (Next Day) Pakistan Standard Time (PKT / UTC+5)
 */

export interface RestaurantTimingStatus {
  isOpen: boolean;
  isNearClosing: boolean; // 30-40 mins before 2:00 AM (e.g. 1:20 AM - 2:00 AM)
  currentPKTTime: string;
  currentPKTHour: number;
  currentPKTMinute: number;
  message: string;
  deliveryWarning: string | null;
  canDeliverNow: boolean;
  nextOpeningTime: string;
}

export function getKarachiTime(): { hour: number; minute: number; timeString: string } {
  // Use Asia/Karachi timezone
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Karachi',
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(now);
  
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '12', 10);
  const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);

  // Formatted 12-hour display string
  const displayOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Karachi',
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
  };
  const timeString = new Intl.DateTimeFormat('en-US', displayOptions).format(now);

  return { hour, minute, timeString };
}

export function checkRestaurantTiming(simulationHour?: number, simulationMinute?: number): RestaurantTimingStatus {
  let { hour, minute, timeString } = getKarachiTime();

  if (typeof simulationHour === 'number') {
    hour = simulationHour;
    minute = typeof simulationMinute === 'number' ? simulationMinute : 0;
    const simDate = new Date();
    simDate.setHours(hour, minute);
    timeString = simDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) + ' (Simulated)';
  }

  // Convert time to minutes from midnight
  const currentTotalMinutes = hour * 60 + minute;

  // Open from 11:00 AM (660 mins) to 2:00 AM next day (120 mins)
  // An hour is OPEN if it is between 11:00 AM (inclusive) and midnight, OR between midnight and 2:00 AM (inclusive).
  const isMorningAfternoonNight = currentTotalMinutes >= 11 * 60; // 11:00 to 23:59
  const isPostMidnight = currentTotalMinutes <= 2 * 60; // 00:00 to 02:00

  const isOpen = isMorningAfternoonNight || isPostMidnight;

  // Near closing: 30-40 min before 2:00 AM => Between 1:20 AM (80 mins) and 2:00 AM (120 mins)
  const isNearClosing = currentTotalMinutes >= (1 * 60 + 20) && currentTotalMinutes <= (2 * 60);

  let message = 'Open Now · Daily 11:00 AM – 2:00 AM';
  let deliveryWarning: string | null = null;
  let canDeliverNow = true;

  if (!isOpen) {
    message = 'Closed Now · Opens at 11:00 AM';
    canDeliverNow = false;
    deliveryWarning = 'Restaurant is currently CLOSED. Our operating hours are 11:00 AM to 2:00 AM. Doorstep deliveries cannot be processed at this time. You can still pre-order for priority dispatch when we open at 11:00 AM.';
  } else if (isNearClosing) {
    message = 'Closing Soon (Last Orders)';
    canDeliverNow = false;
    deliveryWarning = 'Late-Night Kitchen Cutoff: Orders placed after 1:20 AM can be tracked online, but same-night doorstep delivery will not be dispatched as our service strictly closes at 2:00 AM. You can opt for express takeaway pickup or schedule priority delivery for tomorrow.';
  }

  return {
    isOpen,
    isNearClosing,
    currentPKTTime: timeString,
    currentPKTHour: hour,
    currentPKTMinute: minute,
    message,
    deliveryWarning,
    canDeliverNow,
    nextOpeningTime: '11:00 AM'
  };
}
