import { User } from "./user.entity";

describe("User Entity", () => {
  const mockUserData = {
    id: "1",
    name: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  };

  describe("create", () => {
    it("should create a user with valid data", () => {
      const user = User.create(mockUserData);

      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe("1");
      expect(user.name).toBe("John");
      expect(user.lastName).toBe("Doe");
      expect(user.email).toBe("john.doe@example.com");
      expect(user.createdAt).toEqual(new Date("2024-01-01T00:00:00.000Z"));
      expect(user.updatedAt).toEqual(new Date("2024-01-01T00:00:00.000Z"));
    });

    it("should handle empty name and lastName", () => {
      const userDataWithEmptyNames = {
        ...mockUserData,
        name: "",
        lastName: "",
      };
      const user = User.create(userDataWithEmptyNames);

      expect(user.name).toBe("");
      expect(user.lastName).toBe("");
    });

    it("should handle different email formats", () => {
      const userDataWithDifferentEmail = {
        ...mockUserData,
        email: "test.user+tag@example.co.uk",
      };
      const user = User.create(userDataWithDifferentEmail);

      expect(user.email).toBe("test.user+tag@example.co.uk");
    });
  });

  describe("getters", () => {
    let user: User;

    beforeEach(() => {
      user = User.create(mockUserData);
    });

    it("should return full name", () => {
      expect(user.fullName).toBe("John Doe");
    });

    it("should return full name with single name", () => {
      const singleNameUser = User.create({
        ...mockUserData,
        lastName: "",
      });
      expect(singleNameUser.fullName).toBe("John ");
    });

    it("should return full name with empty names", () => {
      const emptyNameUser = User.create({
        ...mockUserData,
        name: "",
        lastName: "",
      });
      expect(emptyNameUser.fullName).toBe(" ");
    });
  });

  describe("properties", () => {
    let user: User;

    beforeEach(() => {
      user = User.create(mockUserData);
    });

    it("should have readonly properties", () => {
      expect(user.id).toBe("1");
      expect(user.name).toBe("John");
      expect(user.lastName).toBe("Doe");
      expect(user.email).toBe("john.doe@example.com");
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it("should convert string dates to Date objects", () => {
      expect(user.createdAt).toEqual(new Date("2024-01-01T00:00:00.000Z"));
      expect(user.updatedAt).toEqual(new Date("2024-01-01T00:00:00.000Z"));
    });

    it("should handle different date formats", () => {
      const userWithDifferentDates = User.create({
        ...mockUserData,
        createdAt: "2024-06-15T12:30:45.123Z",
        updatedAt: "2024-06-16T08:15:30.456Z",
      });

      expect(userWithDifferentDates.createdAt).toEqual(new Date("2024-06-15T12:30:45.123Z"));
      expect(userWithDifferentDates.updatedAt).toEqual(new Date("2024-06-16T08:15:30.456Z"));
    });
  });

  describe("edge cases", () => {
    it("should handle special characters in names", () => {
      const specialCharUser = User.create({
        ...mockUserData,
        name: "José María",
        lastName: "García-López",
      });

      expect(specialCharUser.name).toBe("José María");
      expect(specialCharUser.lastName).toBe("García-López");
      expect(specialCharUser.fullName).toBe("José María García-López");
    });

    it("should handle very long names", () => {
      const longName = "A".repeat(100);
      const longLastName = "B".repeat(100);

      const longNameUser = User.create({
        ...mockUserData,
        name: longName,
        lastName: longLastName,
      });

      expect(longNameUser.name).toBe(longName);
      expect(longNameUser.lastName).toBe(longLastName);
      expect(longNameUser.fullName).toBe(`${longName} ${longLastName}`);
    });

    it("should handle unicode characters", () => {
      const unicodeUser = User.create({
        ...mockUserData,
        name: "王",
        lastName: "小明",
        email: "wang.xiaoming@example.com",
      });

      expect(unicodeUser.name).toBe("王");
      expect(unicodeUser.lastName).toBe("小明");
      expect(unicodeUser.fullName).toBe("王 小明");
    });
  });
});
