return (
    <>
      {/* <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800/50 lg:p-6"> */}
      <PageMeta
        title="Calendar Dashboard "
        description="This is React.js Calendar"
        />
        {/* </div> */}
      <PageBreadcrumb pageTitle="Calendar" />
      <Toast
        message="Please click on a date to add an event!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="info"
        position="center" // This will center the toast both vertically and horizontally
      />
      {error && (
        <div className="p-2 mb-4 rounded-lg bg-error-50 text-error-500">
          <p>{error}</p>
        </div>
      )}
      <div className="p-2 md:p-6 2xl:p-3">
        <div className="mx-auto max-w-full">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            // Drag-n-drop settings
            editable={true}
            eventStartEditable={true}
            eventDurationEditable={true}
            droppable={true}
            dragRevertDuration={0}
            dragScroll={true}
            snapDuration={"00:15:00"} // Snap to 15-minute intervals
            eventOverlap={true} // Prevent events from overlapping
            // eventOpacity={0.75}

            // Event constraints
            // eventConstraint={{
            //   startTime: "00:00",
            //   endTime: "24:00",
            // }}
            // Drag-n-drop callbacks
            eventDragStart={handleEventDragEnter}
            eventDragStop={(info) => {
              console.log("Drag stopped:", info);
              const cell = info.el;
              cell.classList.remove("is-dragging");
            }}
            eventLeave={handleEventDragLeave}
            eventDrop={handleCalendarEventDrop}
            // External drag-n-drop
            dropAccept=".fc-event"
            drop={(info) => {
              console.log("External item dropped:", info);
            }}
            eventReceive={(info) => {
              console.log("External event received:", info);
              // Handle the new event here
              const newEvent = {
                title: info.event.title,
                start: info.event.start,
                end: info.event.end,
                allDay: info.event.allDay,
                extendedProps: info.event.extendedProps,
              };
              setEvents((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  title: newEvent.title,
                  start:
                    newEvent.start?.toISOString() || new Date().toISOString(),
                  end: newEvent.end?.toISOString() || new Date().toISOString(),
                  allDay: newEvent.allDay ?? true,
                  extendedProps: {
                    calendar: newEvent.extendedProps?.calendar || "primary",
                  },
                },
              ]);
            }}
            // Touch support settings
            selectLongPressDelay={1000} // 1 second for long-press
            eventLongPressDelay={1000} // 1 second for event long-press
            headerToolbar={{
              left: "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            // titleFormat={{ // Add this prop
            //   month: 'long yyyy', // Will display as "September 2023"
            //   // Alternative formats:
            //   // month: 'short yyyy' // Will display as "Sep 2023"
            //   // month: "MMM yyyy" // Will display as "Sep 2023"
            // }}
            events={events}
            selectable={true}
            selectMirror={true}
            select={handleDateSelect}
            // selectLongPressDelay={0} // Reduce long press delay for mobile
            longPressDelay={0} // Reduce general long press delay
            selectMinDistance={0} // Reduce minimum drag distance for selection
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            // eventResize={handleEventResize}
            // In your FullCalendar component, modify the addEventButton handler:
            customButtons={{
              addEventButton: {
                text: "Add Event +",
                click: function () {
                  // Set start date to today
                  const today = new Date();
                  const tomorrow = new Date();
                  tomorrow.setDate(today.getDate() + 1);

                  // Format dates as YYYY-MM-DD
                  const startDate = today.toISOString().split("T")[0];
                  const endDate = tomorrow.toISOString().split("T")[0];

                  console.log("Setting default dates for new event:", {
                    startDate,
                    endDate
                  });

                  // Set the dates and open modal
                  setEventStartDate(startDate);
                  setEventEndDate(endDate);
                  openModal();
                },
              },
            }}
            buttonIcons={{
              prev: "chevron-left",
              next: "chevron-right",
            }}
            buttonText={{
              today: "Today",
            }}
            bootstrapFontAwesome={false}
            timeZone="UTC"
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            dayMaxEvents={true}
            height="auto"
            nextDayThreshold="23:59:59" 
            displayEventEnd={true}
            // eventConstraint={null}
            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: "short",
            }}
          />
        </div>
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[700px] p-6 lg:p-10 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                {selectedEvent ? "Edit Event" : "Add Event"}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Plan your next big moment: schedule or edit an event to stay on
                track
              </p>
            </div>
            <div className="mt-8">
              <div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Event Title <span className="text-error-500">*</span>
                  </label>
                  <input
                    id="event-title"
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    required
                    placeholder="Enter event title"
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Event Color
                </label>
                <div className="flex flex-wrap items-center gap-4 sm:gap-5 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  {Object.entries(calendarsEvents).map(([key, value]) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                    >
                      <input
                        type="radio"
                        name="eventColor"
                        value={value}
                        checked={eventLevel === value}
                        onChange={(e) => setEventLevel(e.target.value)}
                        className="hidden"
                      />
                      <div
                        className={`
                        w-14 h-8 rounded-full flex items-center justify-center px-10
                        ${
                          eventLevel === value
                            ? "ring-2 ring-offset-2 ring-brand-500"
                            : ""
                        }
                        ${value === "primary" && "bg-brand-500"}
                        ${value === "success" && "bg-success-500"}
                        ${value === "danger" && "bg-error-500"}
                        ${value === "warning" && "bg-orange-500"}
                        text-white text-sm
                      `}
                      >
                        {key}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Enter Start Date <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <DatePicker
                    value={eventStartDate}
                    onChange={([date]) => {
                      if (date) {
                        const formattedDate = date.toISOString().split("T")[0];
                        setEventStartDate(formattedDate);
                        
                        // If end date is before new start date, update end date
                        if (eventEndDate && new Date(eventEndDate) < new Date(formattedDate)) {
                          const newEndDate = new Date(formattedDate);
                          newEndDate.setDate(newEndDate.getDate() + 1);
                          setEventEndDate(newEndDate.toISOString().split("T")[0]);
                        }
                      }
                    }}
                    options={{
                      ...datePickerOptions,
                      defaultDate: eventStartDate
                    }}
                    required
                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Enter End Date <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <DatePicker
                    value={eventEndDate}
                    onChange={([date]) => {
                      if (date) {
                        const formattedDate = date.toISOString().split("T")[0];
                        setEventEndDate(formattedDate);
                      }
                    }}
                    options={{
                      ...datePickerOptions,
                      defaultDate: eventEndDate
                    }}
                    required
                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>
            </div>
            <div className="mt-2">
              {!eventTitle.trim() && (
                <p className="text-sm text-error-500">Event Title is required</p>
              )}
              {!eventStartDate && (
                <p className="text-sm text-error-500">Start date is required</p>
              )}
              {!eventEndDate && (
                <p className="text-sm text-error-500">End date is required</p>
              )}
              {!eventLevel && (
                <p className="text-sm text-error-500">Event level Color is required</p>
              )}
              {eventStartDate && eventEndDate && !isValidDateRange(eventStartDate, eventEndDate) && (
                <p className="text-sm text-error-500">End date must be after or equal to start date</p>
              )}
            </div>
            <div className="mt-8 flex justify-end gap-4">
              {selectedEvent && (
                <button
                  onClick={handleDeleteEvent}
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg border border-error-500 px-6 py-2.5 text-center text-sm font-medium text-error-500 hover:bg-error-50 focus:ring-4 focus:ring-error-500/10 dark:border-error-500 dark:hover:bg-error-500/10"
                >
                  Delete Event
                </button>
              )}
              <button
                disabled={!areRequiredFieldsFilled() || !isValidDateRange(eventStartDate, eventEndDate)}
                onClick={handleAddOrUpdateEvent}
                type="button"
                className={`inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-center text-sm font-medium ${
                  !areRequiredFieldsFilled() || !isValidDateRange(eventStartDate, eventEndDate)
                    ? 'bg-gray-300 cursor-not-allowed dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    : 'bg-brand-500 text-white hover:bg-brand-600 focus:ring-4 focus:ring-brand-500/10 dark:bg-brand-500 dark:hover:bg-brand-400'
                }`}
              >
                {selectedEvent ? "Update Event" : "Save Event"}
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          className="max-w-[400px] p-6"
        >
          <div className="flex flex-col">
            <h5 className="mb-2 font-semibold text-gray-800 dark:text-white/90 text-lg">
              Confirm Deletion
            </h5>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this event? This action cannot be
              undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                Delete Event
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};