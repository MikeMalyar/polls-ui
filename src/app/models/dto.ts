export class UserLoginDto {
  login: string;
  password: string;
}

export class RegistrationDto {
  login: string;
  password: string;
  repeatPassword: string;
  email: string;
  fullName: string;
}

export class MyPollDto {
  id: bigint;
  title: string;
  reacted: number;

  constructor(id, title, reacted) {
    this.id = id;
    this.title = title;
    this.reacted = reacted;
  }
}

export class MyGroupDto {
  id: bigint;
  name: string;
  newContent: number;

  constructor(id, name, newContent) {
    this.id = id;
    this.name = name;
    this.newContent = newContent;
  }
}
