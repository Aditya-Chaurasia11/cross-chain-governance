import { useEffect, useState } from "react";

const TimeLeft = ({ unixTimestamp }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateTimeLeft = () => {
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds as a regular number
      const difference = Number(unixTimestamp) - currentTime; // Convert unixTimestamp to a number

      if (difference < 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(difference / 3600);
        const minutes = Math.floor((difference % 3600) / 60);
        const seconds = difference % 60;

        setTimeLeft({ hours, minutes, seconds });
      }
    };

    // Update time left every second
    const intervalId = setInterval(updateTimeLeft, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [unixTimestamp]);

  return (
    <div>
      {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  );
};

export default TimeLeft;
