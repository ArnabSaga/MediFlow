import { addHours, addMinutes, format } from "date-fns";
import status from "http-status";
import { Prisma, Schedule } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { IQueryParams } from "../../interfaces/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import {
  scheduleFilterableFields,
  scheduleIncludeConfig,
  scheduleSearchableFields,
} from "./schedule.constant";
import { ICreateSchedulePayload, IUpdateSchedulePayload } from "./schedule.interface";
import { convertDateTime } from "./schedule.utils";

const createSchedule = async (payload: ICreateSchedulePayload) => {
  const { startDate, endDate, startTime, endTime } = payload;

  const interval = 30;

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  const schedules = [];

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(`${format(currentDate, "yyyy-MM-dd")}`, Number(startTime.split(":")[0])),
        Number(startTime.split(":")[1])
      )
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(`${format(currentDate, "yyyy-MM-dd")}`, Number(endTime.split(":")[0])),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      const start = convertDateTime(startDateTime);
      const end = convertDateTime(addMinutes(startDateTime, interval));

      const scheduleData = {
        startDateTime: start,
        endDateTime: end,
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });

        schedules.push(result);
      }

      startDateTime.setMinutes(startDateTime.getMinutes() + interval);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

const getAllSchedules = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<
    Schedule,
    Prisma.ScheduleWhereInput,
    Prisma.ScheduleInclude
  >(prisma.schedule, query, {
    searchableFields: scheduleSearchableFields,
    filterableFields: scheduleFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .paginate()
    .dynamicInclude(scheduleIncludeConfig)
    .sort()
    .fields()
    .execute();

  return result;
};

const getScheduleById = async (id: string) => {
  const schedule = await prisma.schedule.findUnique({
    where: {
      id: id,
    },
  });
  return schedule;
};

const updateSchedule = async (id: string, payload: IUpdateSchedulePayload) => {
  const {
    startDate,
    endDate,
    startDateTime: payloadStartDateTime,
    endDateTime: payloadEndDateTime,
    startTime,
    endTime,
  } = payload;

  const existingSchedule = await prisma.schedule.findUnique({
    where: {
      id: id,
    },
  });

  if (!existingSchedule) {
    throw new AppError(status.NOT_FOUND, "Schedule not found");
  }

  const startDateStr =
    startDate || payloadStartDateTime || format(existingSchedule.startDateTime, "yyyy-MM-dd");
  const endDateStr =
    endDate || payloadEndDateTime || format(existingSchedule.endDateTime, "yyyy-MM-dd");

  const startTimeStr = startTime || format(existingSchedule.startDateTime, "HH:mm");
  const endTimeStr = endTime || format(existingSchedule.endDateTime, "HH:mm");

  const startDateTime = new Date(
    addMinutes(
      addHours(
        `${format(new Date(startDateStr), "yyyy-MM-dd")}`,
        Number(startTimeStr.split(":")[0])
      ),
      Number(startTimeStr.split(":")[1])
    )
  );

  const endDateTime = new Date(
    addMinutes(
      addHours(`${format(new Date(endDateStr), "yyyy-MM-dd")}`, Number(endTimeStr.split(":")[0])),
      Number(endTimeStr.split(":")[1])
    )
  );

  const updatedSchedule = await prisma.schedule.update({
    where: {
      id: id,
    },
    data: {
      startDateTime: convertDateTime(startDateTime),
      endDateTime: convertDateTime(endDateTime),
    },
  });

  return updatedSchedule;
};

const deleteSchedule = async (id: string) => {
  await prisma.schedule.delete({
    where: {
      id: id,
    },
  });
  return true;
};

export const ScheduleService = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
