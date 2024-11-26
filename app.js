import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Users, Plus, X } from 'lucide-react';

const CourtBookingCalendar = () => {
  // Initialize all state variables
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [newBooking, setNewBooking] = useState({
    time: '',
    court: '',
    bookedBy: ''
  });

  // Sample players - in real app, this would come from backend
  const players = [
    "John D.", "Sarah K.", "Mike R.", "Lisa P.", "Tom H.", 
    "Amy W.", "Bob C.", "Emma S.", "David L.", "Karen M."
  ];

  // Sample data structure - in real app, this would come from backend
  const [bookings, setBookings] = useState({
    "2024-11-27": {
      courts: [
        { time: "8-9pm", court: "1", bookedBy: "SR" },
        { time: "8-9pm", court: "5", bookedBy: "AH" }
      ],
      players: ["SR", "AH", "JD", "SK", "MR", "LP"]
    }
  });

  const addBooking = () => {
    if (!selectedDate || !newBooking.time || !newBooking.court || !newBooking.bookedBy) return;

    setBookings(prev => {
      const newBookings = { ...prev };
      if (!newBookings[selectedDate]) {
        newBookings[selectedDate] = { courts: [], players: [] };
      }
      newBookings[selectedDate].courts.push(newBooking);
      return newBookings;
    });

    setNewBooking({ time: '', court: '', bookedBy: '' });
    setShowBookingForm(false);
  };

  const togglePlayer = (date, player) => {
    setBookings(prev => {
      const newBookings = { ...prev };
      if (!newBookings[date]) {
        newBookings[date] = { courts: [], players: [] };
      }
      
      const players = newBookings[date].players || [];
      const index = players.indexOf(player);
      
      if (index === -1) {
        players.push(player);
      } else {
        players.splice(index, 1);
      }
      
      newBookings[date].players = players;
      return newBookings;
    });
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDate(null);
  };

  const hasBookings = (date) => {
    const dateStr = formatDate(date);
    return bookings[dateStr]?.courts.length > 0;
  };

  const renderBookingForm = () => {
    if (!showBookingForm) return null;

    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">Add New Court Booking</h4>
          <button 
            onClick={() => setShowBookingForm(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <select 
              className="w-full p-2 border rounded"
              value={newBooking.time}
              onChange={e => setNewBooking({...newBooking, time: e.target.value})}
            >
              <option value="">Select time</option>
              <option value="8-9am">8-9am</option>
              <option value="9-10am">9-10am</option>
              <option value="8-9pm">8-9pm</option>
              <option value="9-10pm">9-10pm</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Court</label>
            <select 
              className="w-full p-2 border rounded"
              value={newBooking.court}
              onChange={e => setNewBooking({...newBooking, court: e.target.value})}
            >
              <option value="">Select court</option>
              {[...Array(15)].map((_, i) => (
                <option key={i+1} value={i+1}>Court {i+1}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Booked By</label>
            <input 
              type="text"
              className="w-full p-2 border rounded"
              value={newBooking.bookedBy}
              onChange={e => setNewBooking({...newBooking, bookedBy: e.target.value})}
              placeholder="Your initials"
            />
          </div>
        </div>
        <button
          onClick={addBooking}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Booking
        </button>
      </div>
    );
  };

  const renderPlayerSelection = () => {
    if (!selectedDate) return null;

    const dayBookings = bookings[selectedDate] || { players: [] };
    
    return (
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-3">Who's Playing?</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {players.map(player => (
            <button
              key={player}
              onClick={() => togglePlayer(selectedDate, player)}
              className={`p-2 rounded text-sm text-left ${
                dayBookings.players.includes(player)
                  ? 'bg-green-500 text-white'
                  : 'bg-white border hover:bg-green-50'
              }`}
            >
              {player}
            </button>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Total players: {dayBookings.players.length}
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border bg-gray-50"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = formatDate(date);
      const dayBookings = bookings[dateStr];
      const hasBooking = hasBookings(date);

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(dateStr)}
          className={`h-24 border p-2 cursor-pointer transition-colors
            ${hasBooking ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'}
            ${selectedDate === dateStr ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className="font-medium">{day}</div>
          {hasBooking && (
            <div className="text-xs text-blue-600 mt-1">
              {bookings[dateStr].courts.length} courts
            </div>
          )}
          {dayBookings?.players?.length > 0 && (
            <div className="text-xs text-green-600 mt-1">
              {dayBookings.players.length} players
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const renderDayDetails = () => {
    if (!selectedDate) return null;

    const dayBookings = bookings[selectedDate]?.courts || [];
    const timeSlots = [...new Set(dayBookings.map(b => b.time))].sort();

    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-lg">
            {new Date(selectedDate).toLocaleDateString()}
          </h3>
          <button
            onClick={() => setShowBookingForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
            Book Court
          </button>
        </div>

        {renderBookingForm()}
        {renderPlayerSelection()}

        {timeSlots.map(time => (
          <div key={time} className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">{time}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {dayBookings
                .filter(b => b.time === time)
                .map((booking, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded border hover:shadow-md transition-shadow"
                  >
                    <div className="text-sm">
                      <span className="font-medium">Court {booking.court}</span>
                      <span className="text-gray-500 ml-2">- {booking.bookedBy}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span>
              {currentMonth.toLocaleDateString('default', {
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium p-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {renderCalendar()}
          </div>
          {renderDayDetails()}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourtBookingCalendar;
