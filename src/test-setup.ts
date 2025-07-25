// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import "zone.js/testing";

import { getTestBed } from "@angular/core/testing";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";

getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    length: Object.keys(store).length,
    key: (index: number) => Object.keys(store)[index] || null,
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

Object.defineProperty(window, "sessionStorage", {
  value: localStorageMock,
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jasmine.createSpy("matchMedia").and.returnValue({
    matches: false,
    media: "query",
    onchange: null,
    addListener: jasmine.createSpy("addListener"),
    removeListener: jasmine.createSpy("removeListener"),
    addEventListener: jasmine.createSpy("addEventListener"),
    removeEventListener: jasmine.createSpy("removeEventListener"),
    dispatchEvent: jasmine.createSpy("dispatchEvent"),
  }),
});

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

export const TestUtils = {
  delay: (ms: number): Promise<void> =>
    new Promise<void>(resolve => {
      setTimeout(() => resolve(), ms);
    }),

  mockDate: (date: string | Date) => {
    const mockDate = new Date(date);
    spyOn(window, "Date").and.returnValue(mockDate as any);
    return mockDate;
  },

  mockConsole: () => {
    spyOn(console, "log");
    spyOn(console, "warn");
    spyOn(console, "error");
  },

  createMockTask: (overrides = {}) => ({
    id: "1",
    title: "Test Task",
    description: "Test Description",
    priority: "HIGH" as any,
    status: "TODO" as any,
    dueDate: "2024-12-31",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  }),

  createMockUser: (overrides = {}) => ({
    id: "1",
    name: "Test",
    lastName: "User",
    email: "test@example.com",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  }),
};
