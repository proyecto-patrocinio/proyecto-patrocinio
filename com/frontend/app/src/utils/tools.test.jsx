import {
    getClientDNI2ID,
    getClientID2DNI,
    getRandomNumber,
    formatTimestamp,
    formatDateToString,
    deleteCookie,
    findUniqueElementsInA,
  } from "./tools";
  
  // Mockear getClientList para evitar llamadas a la API real
  jest.mock("./client", () => ({
    getClientList: jest.fn(() => Promise.resolve([])),
  }));
  
  describe("getClientDNI2ID", () => {
    test("should return an object mapping DNI to ID", async () => {
      const mockClients = [
        { id: 1, id_value: "DNI123" },
        { id: 2, id_value: "DNI456" },
      ];
  
      // Mockear getClientList para devolver datos específicos
      jest.spyOn(require("./client"), "getClientList").mockResolvedValueOnce(
        mockClients
      );
  
      const result = await getClientDNI2ID();
      expect(result).toEqual({ DNI123: 1, DNI456: 2 });
    });
  });
  
  describe("getClientID2DNI", () => {
    test("should return an object mapping ID to DNI", async () => {
      const mockClients = [
        { id: 1, id_value: "DNI123" },
        { id: 2, id_value: "DNI456" },
      ];
  
      // Mockear getClientList para devolver datos específicos
      jest.spyOn(require("./client"), "getClientList").mockResolvedValueOnce(
        mockClients
      );
  
      const result = await getClientID2DNI();
      expect(result).toEqual({ 1: "DNI123", 2: "DNI456" });
    });
  });
  
  describe("getRandomNumber", () => {
    test("should return a random number within the specified range", () => {
      const result = getRandomNumber(10, 5);
      expect(result).toBeGreaterThanOrEqual(5);
      expect(result).toBeLessThanOrEqual(10);
    });
  });
  
  describe("formatTimestamp", () => {
    test("should format timestamp into a human-readable date and time string", () => {
      const timestamp = "2023-09-12T02:33:01.377806Z";
      const result = formatTimestamp(timestamp);
      expect(result).toEqual("12/9/2023 02:33:01");

    });
  });
  
  describe("formatDateToString", () => {
    test("should format Date object to 'YYYY-MM-DD' format", () => {
      const date = new Date("2023-09-12");
      const result = formatDateToString(date);
      expect(result).toEqual("2023-09-12");
    });
  });
