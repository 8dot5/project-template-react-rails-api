import { Grid, GridItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";

function Calendar({
  displayDate,
  displayRecCenter,
  displayResources,
  handleCalendarSelection,
}) {
  const [existingCalendarIds, setExistingCalendarIds] = useState([]);

  const recCenterOpenDateTime = new Date(displayRecCenter.opens_at);
  const recCenterCloseDateTime = new Date(displayRecCenter.closes_at);
  const recCenterOpenTime = recCenterOpenDateTime.getUTCHours();
  const recCenterCloseTime = recCenterCloseDateTime.getUTCHours();
  const recCenterHours = recCenterCloseTime - recCenterOpenTime;
  const numOfResources = displayResources.length;
  const gridColumns = numOfResources + 1;
  const dynamicGridTemplate = createDynamicGridTemplate();
  const dynamicColumns = `80px repeat(${numOfResources}, 1fr)`;
  const dynamicRows = `repeat(${recCenterHours + 1}, 1fr})`;

  useEffect(() => {
    fetch(
      `http://localhost:3000/admin/rec_centers/${displayRecCenter.id}/reservations/${displayDate}`,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((r) => r.json())
      .then((reservations) => {
        const reservationCalendarIds = reservations.map((reservation) => {
          const reservationStartDateTime = new Date(reservation.datetime_start);
          const recOpenDateTime = new Date(displayRecCenter.opens_at);
          const recOpenTime = recOpenDateTime.getUTCHours();
          const reservationStartTime = reservationStartDateTime.getUTCHours();
          const hoursFromOpenTime = reservationStartTime - recOpenTime;
          const resourceIndex = reservation.resource.id;
          const calendarId =
            (hoursFromOpenTime + 1) * gridColumns + resourceIndex;
          return `calendarId:${calendarId}`;
        });
        setExistingCalendarIds(reservationCalendarIds);
      });
  }, []);

  const calendarTopRow = [];
  const calendarBody = [];

  // calendar top row
  calendarTopRow.push(formatSquare());

  displayResources.forEach((resource) =>
    calendarTopRow.push(resourceSquare(resource))
  );

  // calendar body
  for (let i = 0; i < recCenterHours * gridColumns; i++) {
    const calendarId = i + gridColumns;
    if (calendarId % gridColumns === 0) {
      calendarBody.push(timeSquare(calendarId, i));
    } else {
      calendarBody.push(calendarSquare(calendarId));
    }
  }

  function createDynamicGridTemplate() {
    let gridTemplate = "";
    for (
      let i = 0;
      i < gridColumns + recCenterHours + numOfResources * recCenterHours;
      i++
    ) {
      if (i % gridColumns === 0) {
        gridTemplate = gridTemplate + `"calendarId:${i}`;
      } else if ((i + 1) % gridColumns === 0) {
        gridTemplate = gridTemplate + ` calendarId:${i}"`;
      } else {
        gridTemplate = gridTemplate + ` calendarId:${i}`;
      }
    }
    return gridTemplate;
  }

  function formatSquare() {
    return (
      <GridItem
        key="format"
        bg="white"
        area={"calendarId:0"}
        // position="fixed"
        // zIndex={2}
      ></GridItem>
    );
  }

  function resourceSquare(resource) {
    return (
      <GridItem
        key={resource.id}
        bg="teal.300"
        area={`calendarId:${resource.id}`}
        borderRadius="md"
        boxShadow="md"
        p={2}
        fontWeight="semibold"
        // position="fixed"
        // zIndex={2}
      >
        {resource.name}
      </GridItem>
    );
  }

  function timeSquare(calendarId, iteration) {
    return (
      <GridItem
        key={calendarId}
        area={`calendarId:${calendarId}`}
        bg="teal.100"
        borderRadius="md"
        boxShadow="md"
        p={3}
        fontWeight="semibold"
      >
        {iteration / gridColumns + recCenterOpenTime}:00
      </GridItem>
    );
  }

  function calendarSquare(calendarId) {
    const reservedSquare = existingCalendarIds.includes(
      `calendarId:${calendarId}`
    );
    if (reservedSquare) {
      return reservedTimeSquare(calendarId);
    } else {
      return availableTimeSquare(calendarId);
    }
  }

  function reservedTimeSquare(calendarId) {
    return (
      <GridItem
        key={calendarId}
        area={`calendarId:${calendarId}`}
        w="100%"
        bg="gray.200"
        color="gray.400"
        borderRadius="md"
        p={3}
        fontWeight="semibold"
        boxShadow="md"
        data-date={displayDate}
        data-time={Math.floor(calendarId / gridColumns) - 1 + recCenterOpenTime}
        data-resource-index={(calendarId % gridColumns) - 1}
      >
        Unavailable
      </GridItem>
    );
  }

  function availableTimeSquare(calendarId) {
    return (
      <GridItem
        key={calendarId}
        area={`calendarId:${calendarId}`}
        w="100%"
        bg="green.300"
        borderRadius="md"
        boxShadow="md"
        as="button"
        _hover={{ background: "green.400" }}
        _focus={{ background: "green.600" }}
        onClick={handleClick}
        data-date={displayDate}
        data-time={Math.floor(calendarId / gridColumns) - 1 + recCenterOpenTime}
        data-resource-index={(calendarId % gridColumns) - 1}
      ></GridItem>
    );
  }

  function handleClick(e) {
    e.preventDefault();

    const currentCalendarSelection = {
      date: e.target.dataset.date,
      time: e.target.dataset.time,
      resourceId: displayResources[e.target.dataset.resourceIndex].id,
      resourceName: displayResources[e.target.dataset.resourceIndex].name,
      bookingTypeId: 1,
      recCenterId: displayRecCenter.id,
      recCenterName: displayRecCenter.name,
    };
    handleCalendarSelection(currentCalendarSelection);
  }

  return (
    <div>
      <h2>Calendar</h2>
      <Grid
        templateAreas={dynamicGridTemplate}
        gridTemplateColumns={dynamicColumns}
        gridTemplateRows={dynamicRows}
        gap={4}
        mx={190}
      >
        {calendarTopRow}
        {calendarBody}
      </Grid>
    </div>
  );
}

export default Calendar;
