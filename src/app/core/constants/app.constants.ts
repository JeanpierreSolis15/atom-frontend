export const APP_CONSTANTS = {
  ROUTES: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
    },
    TASKS: {
      KANBAN: "/kanban",
    },
  },

  MESSAGES: {
    SUCCESS: {
      LOGIN: "¡Bienvenido de vuelta!",
      REGISTER: "¡Cuenta creada exitosamente! Ya puedes iniciar sesión.",
      TASK_UPDATED: "Tarea actualizada correctamente",
      TASK_DELETED: "Tarea eliminada correctamente",
      LOGOUT: "Sesión cerrada correctamente",
    },
    ERROR: {
      LOGIN: "Error al iniciar sesión. Verifica tus credenciales.",
      REGISTER: "Error al crear la cuenta. Intenta nuevamente.",
      TASK_UPDATE: "Error al actualizar la tarea",
      TASK_DELETE: "Error al eliminar la tarea",
    },
    INFO: {
      LOGOUT: "Sesión cerrada correctamente",
    },
  },

  VALIDATION: {
    MIN_LENGTH: {
      NAME: 2,
      PASSWORD: 6,
    },
    MAX_LENGTH: {
      TASK_TITLE: 100,
      TASK_DESCRIPTION: 500,
    },
  },

  UI: {
    DIALOG_WIDTH: "600px",
    DEBOUNCE_TIME: 100,
    SNACKBAR_DURATION: {
      SUCCESS: 3000,
      ERROR: 5000,
      WARNING: 4000,
      INFO: 3000,
    },
  },

  TASK_STATUS: {
    TODO: "TODO",
    IN_PROGRESS: "IN_PROGRESS",
    DONE: "DONE",
  },
} as const;
