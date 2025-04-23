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
        <div className="rounded-2xl border  bg-white dark:border-gray-800 dark:bg-white/[0.03]">
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
{/* Event Form */}
        <div
          id="event-form"
          className={`transition-opacity duration-300 ${
            formZIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0,
            zIndex: formZIndex 
          }}
        >
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedEvent ? "Edit Event" : "Add Event"}
              </h2>
              <button
                onClick={() => toggleFormVisibility(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter event title"
                />
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <DatePicker
                    value={eventStartDate}
                    onChange={([date]) => setEventStartDate(date?.toISOString().split('T')[0] || '')}
                    options={datePickerOptions}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <DatePicker
                    value={eventEndDate}
                    onChange={([date]) => setEventEndDate(date?.toISOString().split('T')[0] || '')}
                    options={datePickerOptions}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Calendar Type Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Calendar
                </label>
                <select
                  value={eventLevel}
                  onChange={(e) => setEventLevel(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="primary">Primary</option>
                  <option value="success">Success</option>
                  <option value="danger">Danger</option>
                  <option value="warning">Warning</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6">
                <button
                  onClick={() => toggleFormVisibility(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOrUpdateEvent}
                  className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:hover:bg-brand-400"
                >
                  {selectedEvent ? "Update Event" : "Add Event"}
                </button>
              </div>
            </div>
          </div>
        </div>
</div>