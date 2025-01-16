import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Attendance, User } from '@/types/api';

export interface AttendanceRecords {
  records: Array<Attendance>
}

interface AuthStore extends AttendanceRecords {
  addRecord: (attendance: Attendance) => void;
  clearRecords: () => void;
}

export const initialAttendanceRecords: AttendanceRecords = {
  records: []
};

const useAttendance = create(
  persist<AuthStore>(
    (set) => ({
      key: 'attendance',
      ...initialAttendanceRecords,
      addRecord: (record: Attendance) => set((state) => ({ records: [...state.records, record] })),
      clearRecords: () => {
        set(initialAttendanceRecords);
      },
      recordOfflineAttendance: (data) => {
        localStorage.setItem('offlineAttendance', JSON.stringify(data));
        // Optionally, trigger syncing mechanism
      },
      syncOfflineAttendance: async () => {
        const offlineData = localStorage.getItem('offlineAttendance');
        if (offlineData) {
          try {
            const response = await axios.post('/api/attendance', JSON.parse(offlineData));
            localStorage.removeItem('offlineAttendance');
            return response.data;
          } catch (error) {
            console.error('Failed to sync offline attendance', error);
          }
        }
      },
    }),
    {
      name: 'HRIS-ATTENDANCE-STORAGE',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useAttendance;
