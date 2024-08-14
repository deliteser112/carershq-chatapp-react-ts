export interface Appointment {
    appointmentId: number;
    chatId?: number;
    initiatorUserId: number;
    acceptorUserId: number;
    state: number;
    appointmentDateTime: number;
    initiateDateTime?: number | null;
    acceptDateTime?: number | null;
    deleteDateTime?: number | null;
  }