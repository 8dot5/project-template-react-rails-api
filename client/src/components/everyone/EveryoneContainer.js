import Calendar from "../reusables/Calendar";
import DateCarousel from "../reusables/DateCarousel";
import RecCenterCarousel from "../reusables/RecCenterCarousel";
import LoginModal from "./LoginModal";
import { CircularProgress } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

function EveryoneContainer({
  recCenters,
  loginModalOpen,
  setLoginModalOpen,
  setUser,
}) {
  let today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  today = year + "-" + month + "-" + day;

  const [displayDate, setDisplayDate] = useState(today);
  const [displayReservation, setDisplayReservation] = useState({});
  const [displayRecCenter, setDisplayRecCenter] = useState(recCenters[0]);
  const [displayResources, setDisplayResources] = useState([]);

  useEffect(() => {
    setDisplayRecCenter(recCenters[0]);
  }, [recCenters]);

  useEffect(() => {
    if (displayRecCenter) {
      fetch(
        `http://127.0.0.1:3000/admin/rec_centers/${displayRecCenter.id}/resources`,
        {
          method: "GET",
          credentials: "include",
        }
      )
        .then((r) => r.json())
        .then((resourceData) => setDisplayResources(resourceData));
    }
  }, [displayRecCenter]);

  function handleCalendarSelection(currentCalendarSelection) {
    setDisplayReservation(currentCalendarSelection);
  }

  return (
    <div>
      <RecCenterCarousel recCenters={recCenters} />
      <br />
      <DateCarousel />
      {displayRecCenter ? (
        <Calendar
          displayDate={displayDate}
          displayRecCenter={displayRecCenter}
          displayResources={displayResources}
          handleCalendarSelection={handleCalendarSelection}
        />
      ) : (
        <CircularProgress isIndeterminate color="green.300" />
      )}
      {loginModalOpen ? (
        <LoginModal setLoginModalOpen={setLoginModalOpen} setUser={setUser} />
      ) : null}
      <h3> Reserve </h3>
    </div>
  );
}

export default EveryoneContainer;
