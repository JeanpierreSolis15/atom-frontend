export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  get fullName(): string {
    return `${this.name} ${this.lastName}`;
  }

  static create(data: {
    id: string;
    name: string;
    lastName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  }): User {
    return new User(data.id, data.name, data.lastName, data.email, new Date(data.createdAt), new Date(data.updatedAt));
  }
}
