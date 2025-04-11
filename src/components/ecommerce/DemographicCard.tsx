import React, { useState, useEffect } from 'react';
import { MoreDotIcon } from "../../icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend} from 'recharts';
import USMap from './USMap';

interface DemographicStats {
  ageGroups: { name: string; value: number; }[];
  genderDistribution: { name: string; value: number; }[];
  topStates: {
    state: string;
    attendees: number;
    stateCode: string;
    percentage: number;
  }[];
  customerSegments: { name: string; value: number; }[];
  professions: { industry: string; count: number; }[];
  customerLifetime: { range: string; count: number; }[];
  devicePreference: { device: string; percentage: number; }[];
  attendanceFrequency: { frequency: string; attendees: number; }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeframe, setTimeframe] = useState('This Month');
  const [stats, setStats] = useState<DemographicStats>({
    ageGroups: [],
    genderDistribution: [],
    topStates: [],
    customerSegments: [],
    professions: [],
    customerLifetime: [],
    devicePreference: [],
    attendanceFrequency: []
  });
  // Initialize with static data
  const initialStateData: Record<string, number> = {
    CA: 1245,
    NY: 982,
    TX: 845,
    FL: 654,
    IL: 432
  };

  const [stateData, setStateData] = useState<Record<string, number>>(initialStateData);

  useEffect(() => {
    console.log('DemographicCard stateData:', stateData); // Debug log
  }, [stateData]);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  useEffect(() => {
    fetchDemographicStats();
  }, [timeframe]);

  const fetchDemographicStats = async () => {
    // Create a mapping of state codes to attendees
    const newStateData: Record<string, number> = {};
    
    const demoData = {
      ageGroups: [
        { name: '18-24', value: 20 },
        { name: '25-34', value: 35 },
        { name: '35-44', value: 25 },
        { name: '45-54', value: 15 },
        { name: '55+', value: 5 }
      ],
      genderDistribution: [
        { name: 'Male', value: 45 },
        { name: 'Female', value: 48 },
        { name: 'Other', value: 7 }
      ],
      topStates: [
        { state: 'California', stateCode: 'CA', attendees: 1245, percentage: 28.5 },
        { state: 'New York', stateCode: 'NY', attendees: 982, percentage: 22.4 },
        { state: 'Texas', stateCode: 'TX', attendees: 845, percentage: 19.3 },
        { state: 'Florida', stateCode: 'FL', attendees: 654, percentage: 14.9 },
        { state: 'Illinois', stateCode: 'IL', attendees: 432, percentage: 9.8 }
      ],
      customerSegments: [
        { name: 'New', value: 30 },
        { name: 'Regular', value: 45 },
        { name: 'VIP', value: 15 },
        { name: 'Inactive', value: 10 }
      ],
      professions: [
        { industry: 'Technology', count: 450 },
        { industry: 'Finance', count: 320 },
        { industry: 'Healthcare', count: 280 },
        { industry: 'Education', count: 210 },
        { industry: 'Other', count: 340 }
      ],
      customerLifetime: [
        { range: '0-6 months', count: 1200 },
        { range: '6-12 months', count: 850 },
        { range: '1-2 years', count: 650 },
        { range: '2+ years', count: 300 }
      ],
      devicePreference: [
        { device: 'Mobile', percentage: 55 },
        { device: 'Desktop', percentage: 35 },
        { device: 'Tablet', percentage: 10 }
      ],
      attendanceFrequency: [
        { frequency: 'Weekly', attendees: 850 },
        { frequency: 'Monthly', attendees: 1200 },
        { frequency: 'Quarterly', attendees: 750 },
        { frequency: 'Yearly', attendees: 200 }
      ]
    };

    // Update the state data based on topStates
    demoData.topStates.forEach(state => {
      newStateData[state.stateCode] = state.attendees;
    });

    setStateData(newStateData);
    setStats(demoData);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Attendee Demographics & Insights
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Comprehensive analysis of attendee behavior and segmentation
          </p>
        </div>
        <div className="relative inline-block">
          <button 
            className="hover:text-dark-900 relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            onClick={toggleDropdown}
          >
            <MoreDotIcon className="size-6" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem onItemClick={() => { setTimeframe('This Month'); closeDropdown(); }}>
              This Month
            </DropdownItem>
            <DropdownItem onItemClick={() => { setTimeframe('Last 3 Months'); closeDropdown(); }}>
              Last 3 Months
            </DropdownItem>
            <DropdownItem onItemClick={() => { setTimeframe('This Year'); closeDropdown(); }}>
              This Year
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Age Distribution Chart */}
          <div className="h-80">
            <h4 className="mb-3 font-medium text-gray-800 dark:text-white/90">
              Attendee Distribution
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.ageGroups}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value}%)`}
                  labelLine={false}
                >
                  {stats.ageGroups.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="dark:opacity-80" />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: '14px', color: 'var(--color-gray-700)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Device Preference */}
          <div>
            <h4 className="mb-3 mt-12 font-medium text-gray-800 dark:text-white/90">Device Preference</h4>
            <div className="space-y-3">
              {stats.devicePreference.map((device, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{device.device}</span>
                    <span className="font-medium text-gray-800 dark:text-white/90">{device.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full dark:bg-gray-700">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${device.percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column */}
        <div className="space-y-6">
          {/* Top States */}
          <div>
            <h4 className="mb-3 font-medium text-gray-800 dark:text-white/90">Top States</h4>
            <div className="space-y-4">
              {stats.topStates.map((state, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {state.stateCode}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white/90">
                        {state.state}
                      </p>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {state.attendees.toLocaleString()} Attendees
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {state.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* State Distribution Map */}
          <div className="mt-6">
            <h4 className="mb-3 font-medium text-gray-800 dark:text-white/90">
              Attendance Distribution
            </h4>
            <div className="h-[400px] rounded-lg border border-gray-200 dark:border-gray-700">
              <USMap 
                data={initialStateData} 
                mapColor="#D0D5DD"
              />
            </div>
          </div>

          {/* Attendance Frequency */}
          <div className="mt-6">
            <h4 className="mb-4 text-base font-medium text-gray-800 dark:text-white/90">
              Attendance Frequency
            </h4>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.attendanceFrequency.map((item) => (
                <div 
                  key={item.frequency}
                  className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.frequency}
                  </p>
                  <p className="mt-1 text-xl font-semibold text-gray-800 dark:text-white">
                    {item.attendees.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Segments */}
          <div>
            <h4 className="mb-3 font-medium text-gray-800 dark:text-white/90">Attendee Segments</h4>
            <div className="space-y-3">
              {stats.customerSegments.map((segment, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{segment.name}</span>
                    <span className="font-medium text-gray-800 dark:text-white/90">{segment.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full dark:bg-gray-700">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${segment.value}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Background */}
          <div>
            <h4 className="mb-3 font-medium text-gray-800 dark:text-white/90">Professional Background</h4>
            <div className="space-y-3">
              {stats.professions.map((profession, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{profession.industry}</span>
                    <span className="font-medium text-gray-800 dark:text-white/90">{profession.count}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full dark:bg-gray-700">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${(profession.count / Math.max(...stats.professions.map(p => p.count)) * 100)}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Lifetime */}
          <div>
            <h4 className="mb-3 font-medium text-gray-800 dark:text-white/90">Attendee Lifetime</h4>
            <div className="space-y-3">
              {stats.customerLifetime.map((lifetime, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{lifetime.range}</span>
                    <span className="font-medium text-gray-800 dark:text-white/90">{lifetime.count}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full dark:bg-gray-700">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${(lifetime.count / Math.max(...stats.customerLifetime.map(l => l.count)) * 100)}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
