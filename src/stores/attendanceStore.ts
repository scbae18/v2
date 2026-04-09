import { create } from 'zustand'
import type { AttendanceSession } from '@/mock/attendance.mock'

interface AttendanceState {
  session: AttendanceSession | null
  showDetail: boolean
  showResult: boolean
  resultSummary: { present: number; late: number; absent: number } | null

  startSession: (s: AttendanceSession) => void
  updateSession: (s: AttendanceSession) => void
  endSession: (summary: { present: number; late: number; absent: number }) => void
  clearSession: () => void
  setShowDetail: (v: boolean) => void
  setShowResult: (v: boolean) => void
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  session: null,
  showDetail: false,
  showResult: false,
  resultSummary: null,

  startSession: (session) => set({ session, showDetail: false, showResult: false }),
  updateSession: (session) => set({ session }),
  endSession: (resultSummary) =>
    set({ session: null, showDetail: false, showResult: true, resultSummary }),
  clearSession: () =>
    set({ session: null, showDetail: false, showResult: false, resultSummary: null }),
  setShowDetail: (showDetail) => set({ showDetail }),
  setShowResult: (showResult) => set({ showResult }),
}))
