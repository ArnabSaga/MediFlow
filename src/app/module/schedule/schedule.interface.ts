export interface ICreateSchedulePayload {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export interface IUpdateSchedulePayload {
  startDate?: string;
  endDate?: string;
  startDateTime?: string;
  endDateTime?: string;
  startTime?: string;
  endTime?: string;
}
